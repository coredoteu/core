import { NextResponse } from "next/server";
import { sendOrderConfirmation } from "@/lib/emails";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, orderNumber, amount, currency, items } = body;

    if (!email) {
      return NextResponse.json(
        { error: "email is required in JSON body" },
        { status: 400 },
      );
    }

    const result = await sendOrderConfirmation(
      email,
      orderNumber || "ORDER-TEST-001",
      amount || 2999,
      currency || "eur",
      items || [
        { name: "system 001 / cleanser", quantity: 1, price: 14.99 },
        { name: "system 002 / moisturizer", quantity: 1, price: 15.00 },
      ],
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, resendData: result.data }, { status: 200 });
  } catch (error) {
    console.error("[Test Email Error]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
