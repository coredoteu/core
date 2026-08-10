import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const { paymentIntentId, email } = await req.json();

    if (!paymentIntentId || !email) {
      return NextResponse.json(
        { error: "paymentIntentId and email are required" },
        { status: 400 },
      );
    }

    const existing = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Guard against attaching an email to a payment that's already settled.
    if (existing.status === "succeeded" || existing.status === "canceled") {
      return NextResponse.json(
        { error: "payment intent is no longer editable" },
        { status: 400 },
      );
    }

    const customerId = await getOrCreateStripeCustomer(email);

    await stripe.paymentIntents.update(paymentIntentId, {
      customer: customerId,
      receipt_email: email,
      metadata: {
        ...existing.metadata,
        customer_email: email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("update-contact error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
