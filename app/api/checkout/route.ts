import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CATALOG } from "@/lib/catalog";
import { FREE_SHIPPING_THRESHOLD_EUR } from "@/lib/constants";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SHIPPING_COST_EUR = 5.95;

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "cart is empty" }, { status: 400 });
    }

    // Validate & price items server-side from the catalog (never trust client prices)
    const lineItems = items.map((item: any) => {
      const catalogItem = CATALOG.find(
        (p) => p.id === item.product?.id || p.id === item.product,
      );
      if (!catalogItem) {
        throw new Error(
          `product ${item.product?.id || item.product} not found in catalog`,
        );
      }
      return {
        id: catalogItem.id,
        name: catalogItem.name,
        unit: catalogItem.unit,
        size: catalogItem.size,
        image: catalogItem.image,
        price: catalogItem.price,
        quantity: item.quantity,
      };
    });

    const subtotalCents = lineItems.reduce(
      (acc: number, item: any) => acc + Math.round(item.price * 100) * item.quantity,
      0,
    );

    const isFreeShipping = subtotalCents >= FREE_SHIPPING_THRESHOLD_EUR * 100;
    const shippingCents = isFreeShipping ? 0 : Math.round(SHIPPING_COST_EUR * 100);
    const totalCents = subtotalCents + shippingCents;

    // Build Stripe metadata for order tracking
    const itemsMetadata = lineItems
      .map((i: any) => `${i.id}×${i.quantity}`)
      .join(",");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: itemsMetadata,
        subtotal_cents: subtotalCents.toString(),
        shipping_cents: shippingCents.toString(),
        source: "bycore-web-custom-checkout",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalCents,
      subtotal: subtotalCents,
      shippingCost: shippingCents,
      isFreeShipping,
      orderSummary: lineItems,
    });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
