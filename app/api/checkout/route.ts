import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CATALOG } from "@/lib/catalog";
import { FREE_SHIPPING_THRESHOLD_EUR } from "@/lib/constants";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "cart is empty" }, { status: 400 });
    }

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
        price_data: {
          currency: "eur",
          product_data: {
            name: `CORE. ${catalogItem.name}`,
            images: catalogItem.image
              ? [`https://bycore.eu${catalogItem.image}`]
              : [],
            metadata: {
              productId: catalogItem.id,
            },
          },
          unit_amount: Math.round(catalogItem.price * 100),
          tax_behavior: "inclusive",
        },
        quantity: item.quantity,
      };
    });

    const subtotal = lineItems.reduce(
      (acc: number, item: any) =>
        acc + item.price_data.unit_amount * item.quantity,
      0,
    );
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_EUR * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: lineItems,
      mode: "payment",
      automatic_tax: { enabled: true },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://bycore.eu"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://bycore.eu"}/cart`,
      shipping_address_collection: {
        allowed_countries: ["NL", "BE", "DE", "FR", "GB", "US", "IT", "ES"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: isFreeShipping ? 0 : 595, currency: "eur" },
            display_name: isFreeShipping
              ? "Free Standard Shipping"
              : "Standard Shipping",
            tax_behavior: "inclusive",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
