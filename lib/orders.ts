import Stripe from "stripe";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CATALOG } from "./catalog";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url)
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables.",
    );
  if (!key)
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not defined. If you just added it to .env.local, you MUST restart your Next.js development server (Ctrl+C and npm run dev) for it to take effect.",
    );

  return createClient(url, key);
};

/**
 * Resolves an existing Supabase auth user id for a given Stripe customer
 * or email, so newly synced orders can be attached to an account even if
 * the account already existed before this order was placed.
 */
async function resolveUserId(
  supabase: SupabaseClient,
  stripeCustomerId: string | null | undefined,
  email: string | null | undefined,
): Promise<string | null> {
  if (stripeCustomerId) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", stripeCustomerId)
      .maybeSingle();
    if (data) return data.id;
  }
  if (email) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .maybeSingle();
    if (data) return data.id;
  }
  return null;
}

/** Keeps the profile's Stripe customer id + last shipping address in sync. */
async function syncProfileFromOrder(
  supabase: SupabaseClient,
  userId: string | null,
  stripeCustomerId: string | null | undefined,
  shippingDetails: unknown,
) {
  if (!userId) return;
  const patch: Record<string, unknown> = {};
  if (stripeCustomerId) patch.stripe_customer_id = stripeCustomerId;
  if (shippingDetails) patch.default_shipping_address = shippingDetails;
  if (Object.keys(patch).length === 0) return;

  patch.updated_at = new Date().toISOString();
  await supabase.from("profiles").update(patch).eq("id", userId);
}

export async function syncStripeSessionToSupabase(sessionId: string) {
  const supabase = getSupabase();

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (existingOrder) {
    return { order: existingOrder, isNew: false };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });

  if (!session || session.payment_status !== "paid") {
    throw new Error("Session not found or payment not completed");
  }

  const customerEmail = session.customer_details?.email ?? null;
  const customerName = session.customer_details?.name;
  const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
  const currency = session.currency || "eur";
  const paymentStatus = session.payment_status;
  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : null;

  const shippingDetails =
    (session as any).collected_information?.shipping_details ||
    session.customer_details;

  const userId = await resolveUserId(supabase, stripeCustomerId, customerEmail);

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      stripe_session_id: session.id,
      customer_email: customerEmail,
      customer_name: customerName,
      amount_total: amountTotal,
      currency: currency,
      payment_status: paymentStatus,
      shipping_details: shippingDetails,
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
    })
    .select(
      "id, stripe_session_id, customer_email, customer_name, amount_total, currency, payment_status, shipping_details, user_id, stripe_customer_id, created_at",
    )
    .single();

  if (orderError) {
    console.error("Error inserting order into Supabase:", orderError);
    throw orderError;
  }

  const lineItems = session.line_items?.data || [];
  const orderItemsToInsert = lineItems.map((item) => {
    const stripeProduct = item.price?.product as Stripe.Product | undefined;
    const catalogProductId = stripeProduct?.metadata?.productId || null;

    return {
      order_id: orderData.id,
      product_id: catalogProductId,
      quantity: item.quantity || 1,
      price_at_purchase: (item.price?.unit_amount || 0) / 100,
    };
  });

  if (orderItemsToInsert.length > 0) {
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error("Error inserting order items into Supabase:", itemsError);
      throw itemsError;
    }
  }

  await syncProfileFromOrder(supabase, userId, stripeCustomerId, shippingDetails);

  const { data: finalOrder } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderData.id)
    .single();

  return { order: finalOrder || orderData, isNew: true };
}

/**
 * Syncs a Stripe PaymentIntent (from the custom Elements checkout) to Supabase.
 * The PaymentIntent ID is stored in the stripe_session_id column for compatibility.
 */
export async function syncStripePaymentIntentToSupabase(paymentIntentId: string) {
  const supabase = getSupabase();

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("stripe_session_id", paymentIntentId)
    .maybeSingle();

  if (existingOrder) {
    return { order: existingOrder, isNew: false };
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["payment_method", "latest_charge"],
  });

  if (!paymentIntent || paymentIntent.status !== "succeeded") {
    throw new Error("PaymentIntent not found or payment not completed");
  }

  const stripeCustomerId =
    typeof paymentIntent.customer === "string" ? paymentIntent.customer : null;

  const charge = paymentIntent.latest_charge as Stripe.Charge | null;
  const billingDetails = charge?.billing_details;
  const customerEmail =
    paymentIntent.receipt_email ||
    billingDetails?.email ||
    paymentIntent.metadata?.customer_email ||
    "unknown@bycore.eu"; // fallback to prevent NOT NULL DB error
  const customerName = billingDetails?.name || null;
  const amountTotal = paymentIntent.amount / 100;
  const currency = paymentIntent.currency || "eur";

  const chargeShipping = charge?.shipping;
  const shippingDetails = chargeShipping
    ? {
        name: chargeShipping.name,
        address: {
          line1: chargeShipping.address?.line1,
          line2: chargeShipping.address?.line2,
          city: chargeShipping.address?.city,
          postal_code: chargeShipping.address?.postal_code,
          country: chargeShipping.address?.country,
        },
      }
    : billingDetails
      ? {
          name: billingDetails.name,
          address: {
            line1: billingDetails.address?.line1,
            line2: billingDetails.address?.line2,
            city: billingDetails.address?.city,
            postal_code: billingDetails.address?.postal_code,
            country: billingDetails.address?.country,
          },
        }
      : null;

  // Prefer the user_id set at checkout time (logged-in flow), fall back to
  // resolving by Stripe customer id / email (covers guests who later sign up).
  const userId =
    paymentIntent.metadata?.user_id ||
    (await resolveUserId(supabase, stripeCustomerId, customerEmail));

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      stripe_session_id: paymentIntentId, // reuse column to store PI id
      customer_email: customerEmail,
      customer_name: customerName,
      amount_total: amountTotal,
      currency: currency,
      payment_status: "paid",
      shipping_details: shippingDetails,
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
    })
    .select(
      "id, stripe_session_id, customer_email, customer_name, amount_total, currency, payment_status, shipping_details, user_id, stripe_customer_id, created_at",
    )
    .single();

  if (orderError) {
    console.error("Error inserting order into Supabase:", orderError);
    throw orderError;
  }

  const itemsMeta = paymentIntent.metadata?.items || "";
  const orderItemsToInsert = itemsMeta
    .split(",")
    .filter(Boolean)
    .map((entry: string) => {
      const [productId, qty] = entry.split("×");
      const shippingCentsStr = paymentIntent.metadata?.shipping_cents || "0";
      const subtotalCentsStr = paymentIntent.metadata?.subtotal_cents || "0";
      const totalItems = itemsMeta.split(",").filter(Boolean).length;
      const catalogItem = CATALOG.find((c) => c.id === productId?.trim());
      const priceAtPurchase = catalogItem
        ? catalogItem.price
        : totalItems > 0
          ? parseInt(subtotalCentsStr) / 100 / totalItems
          : amountTotal;

      return {
        order_id: orderData.id,
        product_id: productId?.trim() || null,
        quantity: parseInt(qty?.trim() || "1", 10),
        price_at_purchase: Math.round(priceAtPurchase * 100) / 100,
      };
    });

  if (orderItemsToInsert.length > 0) {
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error("Error inserting order items:", itemsError);
      // Non-fatal — order is still saved
    }
  }

  await syncProfileFromOrder(supabase, userId, stripeCustomerId, shippingDetails);

  const { data: finalOrder } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderData.id)
    .single();

  return { order: finalOrder || orderData, isNew: true };
}
