import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  syncStripeSessionToSupabase,
  syncStripePaymentIntentToSupabase,
} from "@/lib/orders";
import { sendOrderConfirmation, createSendcloudParcel } from "@/lib/emails";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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

    // Legacy: hosted Checkout Session
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await syncStripeSessionToSupabase(session.id);

      const email = session.customer_details?.email;
      if (email) {
        await sendOrderConfirmation(
          email,
          session.id.slice(-8),
          session.amount_total || 0,
          session.currency || "eur",
        );
      }

      await createSendcloudParcel(session);
    }

    // New: custom Elements checkout (PaymentIntent)
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Only handle intents from our custom checkout (metadata flag)
      if (paymentIntent.metadata?.source === "bycore-web-custom-checkout") {
        await syncStripePaymentIntentToSupabase(paymentIntent.id);

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
          );
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
