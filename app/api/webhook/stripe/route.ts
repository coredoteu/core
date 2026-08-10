import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  syncStripeSessionToSupabase,
  syncStripePaymentIntentToSupabase,
} from "@/lib/orders";
import { sendOrderConfirmation, createSendcloudParcel } from "@/lib/emails";
import { CATALOG } from "@/lib/catalog";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** Returns true the first time we see this Stripe event id, false on any repeat delivery. */
async function claimEvent(eventId: string, type: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("webhook_events")
    .insert({ stripe_event_id: eventId, type });

  if (error) {
    if (error.code === "23505") return false; // unique_violation -> already processed
    console.error("webhook_events insert error:", error);
    // Fail open on unexpected DB errors: a missed order is worse than a
    // rare duplicate email.
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

    // Legacy: hosted Checkout Session
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { order, isNew } = await syncStripeSessionToSupabase(session.id);

      const email = session.customer_details?.email;
      if (isNew && email) {
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

    // Live path: custom Elements checkout (PaymentIntent)
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      if (paymentIntent.metadata?.source === "bycore-web-custom-checkout") {
        const { order, isNew } =
          await syncStripePaymentIntentToSupabase(paymentIntent.id);

        if (isNew) {
          const charge = await stripe.charges.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          });
          const email =
            charge.data[0]?.billing_details?.email ||
            paymentIntent.receipt_email;

          if (email) {
            await sendOrderConfirmation(
              email,
              paymentIntent.id.slice(-8),
              paymentIntent.amount,
              paymentIntent.currency || "eur",
              buildEmailItems(order),
            );
          }
        }
      }
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
