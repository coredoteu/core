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
    const { paymentIntentId, promoCode, items } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "paymentIntentId is required" },
        { status: 400 },
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "cart is empty" }, { status: 400 });
    }

    // Check existing payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (
      paymentIntent.status === "succeeded" ||
      paymentIntent.status === "canceled"
    ) {
      return NextResponse.json(
        { error: "payment intent is no longer editable" },
        { status: 400 },
      );
    }

    // Canonical subtotal calculation from CATALOG
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
        price: catalogItem.price,
        quantity: item.quantity,
      };
    });

    const rawSubtotalCents = lineItems.reduce(
      (acc: number, item: any) =>
        acc + Math.round(item.price * 100) * item.quantity,
      0,
    );

    let discountCents = 0;
    let appliedCode: string | null = null;
    let percentOff: number | null = null;

    const cleanCode = (promoCode || "").trim().toUpperCase();

    if (cleanCode) {
      // 1. Look up active promotion code in Stripe
      const promoList = await stripe.promotionCodes.list({
        code: cleanCode,
        active: true,
        limit: 1,
      });

      let coupon: Stripe.Coupon | null = null;

      if (promoList.data.length > 0) {
        const promo = promoList.data[0];

        // Validate redemptions
        if (
          promo.max_redemptions !== null &&
          promo.times_redeemed >= promo.max_redemptions
        ) {
          return NextResponse.json(
            { error: "this promo code has already been redeemed." },
            { status: 400 },
          );
        }

        if (promo.expires_at && promo.expires_at * 1000 < Date.now()) {
          return NextResponse.json(
            { error: "this promo code has expired." },
            { status: 400 },
          );
        }

        if (promo.promotion?.coupon) {
          if (typeof promo.promotion.coupon === "string") {
            coupon = await stripe.coupons.retrieve(promo.promotion.coupon);
          } else {
            coupon = promo.promotion.coupon as Stripe.Coupon;
          }
        }
        appliedCode = promo.code;
      } else {
        // 2. Check if a coupon exists directly with this ID/code
        try {
          const directCoupon = await stripe.coupons.retrieve(cleanCode);
          if (directCoupon && directCoupon.valid) {
            if (
              directCoupon.max_redemptions !== null &&
              directCoupon.times_redeemed >= directCoupon.max_redemptions
            ) {
              return NextResponse.json(
                { error: "this promo code has already been redeemed." },
                { status: 400 },
              );
            }
            coupon = directCoupon;
            appliedCode = cleanCode;
          }
        } catch {}
      }

      if (!coupon) {
        return NextResponse.json(
          { error: "invalid promo code." },
          { status: 400 },
        );
      }

      // Calculate discount amount
      if (coupon.percent_off) {
        percentOff = coupon.percent_off;
        discountCents = Math.round(
          rawSubtotalCents * (coupon.percent_off / 100),
        );
      } else if (coupon.amount_off) {
        discountCents = Math.min(rawSubtotalCents, coupon.amount_off);
      }
    }

    const discountedSubtotalCents = Math.max(
      0,
      rawSubtotalCents - discountCents,
    );
    const isFreeShipping =
      discountedSubtotalCents >= FREE_SHIPPING_THRESHOLD_EUR * 100;
    const shippingCents = isFreeShipping
      ? 0
      : Math.round(SHIPPING_COST_EUR * 100);
    const totalCents = discountedSubtotalCents + shippingCents;

    // Update PaymentIntent in Stripe
    await stripe.paymentIntents.update(paymentIntentId, {
      amount: totalCents,
      metadata: {
        ...paymentIntent.metadata,
        promo_code: appliedCode || "",
        discount_cents: discountCents.toString(),
        subtotal_cents: discountedSubtotalCents.toString(),
        shipping_cents: shippingCents.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      discountCents,
      percentOff,
      subtotalCents: discountedSubtotalCents,
      originalSubtotalCents: rawSubtotalCents,
      shippingCents,
      totalCents,
      isFreeShipping,
      appliedCode,
    });
  } catch (error: unknown) {
    console.error("apply-promo error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
