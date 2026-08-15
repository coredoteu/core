import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  syncStripeSessionToSupabase,
  syncStripePaymentIntentToSupabase,
} from "@/lib/orders";
import { sendOrderConfirmation, createSendcloudParcel } from "@/lib/emails";
import { CATALOG } from "@/lib/catalog";
import { recalculateBatchIfTierChanged } from "@/lib/funding-engine";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

async function claimEvent(eventId: string, type: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("webhook_events")
    .insert({ stripe_event_id: eventId, type });

  if (error) {
    if (error.code === "23505") return false;
    console.error("webhook_events insert error:", error);
    return true;
  }
  return true;
}

function buildEmailItems(order: any) {
  return (order?.order_items ?? []).map((item: any) => {
    const catalogItem = CATALOG.find((c) => c.id === item.product_id);
    return {
      name: catalogItem?.name ?? item.product_id ?? "item",
      quantity: item.quantity,
      price: item.price_at_purchase,
    };
  });
}

/**
 * Mark an order as refunded and zero out its v2_funded_amount.
 * Looks up by payment_intent_id first, then falls back to stripe_session_id.
 */
async function handleRefund(
  paymentIntentId: string | null,
  stripeSessionId: string | null,
): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Build the OR filter for the lookup
  const filters: string[] = [];
  if (paymentIntentId) {
    filters.push(`payment_intent_id.eq.${paymentIntentId}`);
  }
  if (stripeSessionId) {
    filters.push(`stripe_session_id.eq.${stripeSessionId}`);
  }
  if (filters.length === 0) {
    console.warn("[Stripe Webhook] handleRefund called with no identifiers");
    return;
  }

  const { data: orders, error: fetchErr } = await supabase
    .from("orders")
    .select("id")
    .or(filters.join(","));

  if (fetchErr || !orders || orders.length === 0) {
    console.warn(
      "[Stripe Webhook] handleRefund — order not found:",
      { paymentIntentId, stripeSessionId },
      fetchErr,
    );
    return;
  }

  const orderIds = orders.map((o) => o.id);
  const { error: updateErr } = await supabase
    .from("orders")
    .update({ status: "refunded", v2_funded_amount: 0.00 })
    .in("id", orderIds);

  if (updateErr) {
    console.error("[Stripe Webhook] handleRefund — update error:", updateErr);
  } else {
    console.log(
      `[Stripe Webhook] Marked ${orderIds.length} order(s) as refunded:`,
      orderIds,
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(`Webhook Error: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook Error: ${errorMessage}` },
        { status: 400 },
      );
    }

    const isFirstDelivery = await claimEvent(event.id, event.type);
    if (!isFirstDelivery) {
      return NextResponse.json({ received: true, deduped: true }, { status: 200 });
    }

    // ── checkout.session.completed ────────────────────────────────────────────
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { order, isNew } = await syncStripeSessionToSupabase(session.id);

      if (isNew && order?.id) {
        // Trigger tier-aware batch recalculation for the entire batch
        await recalculateBatchIfTierChanged(order.id);
      }

      const email = session.customer_details?.email || order?.customer_email;
      if (isNew && email && email !== "unknown@bycore.eu") {
        await sendOrderConfirmation(
          email,
          session.id.slice(-8),
          session.amount_total || 0,
          session.currency || "eur",
          buildEmailItems(order),
        );
      }

      await createSendcloudParcel(session);
    }

    // ── payment_intent.succeeded ──────────────────────────────────────────────
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const { order, isNew } =
        await syncStripePaymentIntentToSupabase(paymentIntent.id);

      if (isNew && order?.id) {
        // Trigger tier-aware batch recalculation
        await recalculateBatchIfTierChanged(order.id);
      }

      if (isNew) {
        let email =
          order?.customer_email && order.customer_email !== "unknown@bycore.eu"
            ? order.customer_email
            : paymentIntent.receipt_email || paymentIntent.metadata?.customer_email;

        if (!email || email === "unknown@bycore.eu") {
          const charge = await stripe.charges.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          });
          email = charge.data[0]?.billing_details?.email || undefined;
        }

        if (email && email !== "unknown@bycore.eu") {
          console.log(`[Stripe Webhook] Sending order confirmation email to ${email}`);
          await sendOrderConfirmation(
            email,
            paymentIntent.id.slice(-8),
            paymentIntent.amount,
            paymentIntent.currency || "eur",
            buildEmailItems(order),
          );
        } else {
          console.warn(
            `[Stripe Webhook] Skipping order confirmation email: No valid customer email for PaymentIntent ${paymentIntent.id}`,
          );
        }
      }
    }

    // ── charge.refunded ───────────────────────────────────────────────────────
    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const piId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : (charge.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;

      await handleRefund(piId, null);
    }

    // ── payment_intent.canceled ───────────────────────────────────────────────
    if (event.type === "payment_intent.canceled") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handleRefund(paymentIntent.id, null);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
