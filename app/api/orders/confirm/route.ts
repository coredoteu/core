import { NextResponse } from "next/server";
import {
  syncStripeSessionToSupabase,
  syncStripePaymentIntentToSupabase,
} from "@/lib/orders";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    const paymentIntentId = searchParams.get("payment_intent_id");

    if (paymentIntentId) {
      // New custom Elements checkout flow
      const order = await syncStripePaymentIntentToSupabase(paymentIntentId);
      return NextResponse.json({ order });
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID or Payment Intent ID is required" },
        { status: 400 },
      );
    }

    // Legacy hosted Checkout Session flow
    const order = await syncStripeSessionToSupabase(sessionId);
    return NextResponse.json({ order });
  } catch (error: unknown) {
    console.error("Order confirmation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to confirm order",
      },
      { status: 500 },
    );
  }
}
