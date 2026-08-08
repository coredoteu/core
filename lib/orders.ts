import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

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

export async function syncStripeSessionToSupabase(sessionId: string) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase configuration missing");
  }

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (existingOrder) {
    return existingOrder;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });

  if (!session || session.payment_status !== "paid") {
    throw new Error("Session not found or payment not completed");
  }

  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
  const currency = session.currency || "eur";
  const paymentStatus = session.payment_status;

  const shippingDetails =
    (session as any).collected_information?.shipping_details ||
    session.customer_details;

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
    })
    .select(
      "id, stripe_session_id, customer_email, customer_name, amount_total, currency, payment_status, shipping_details, created_at",
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

  const { data: finalOrder } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderData.id)
    .single();

  return finalOrder || orderData;
}
