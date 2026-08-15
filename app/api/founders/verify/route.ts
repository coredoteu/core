import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import crypto from "crypto";

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined.");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined.");

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const FOUNDER_COUPON_ID = "FOUNDER_15_OFF";

async function getOrCreateFounderCoupon(stripe: Stripe): Promise<string> {
  try {
    const existing = await stripe.coupons.retrieve(FOUNDER_COUPON_ID);
    if (existing && existing.valid) return existing.id;
  } catch (err: any) {
    // If not found, proceed to create
  }

  const created = await stripe.coupons.create({
    id: FOUNDER_COUPON_ID,
    percent_off: 15,
    duration: "once",
    name: "Founder 15% Off (Single Use)",
  });
  return created.id;
}

function generateFounderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FOUNDER-";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawEmail: string = body?.email ?? "";
    const email = rawEmail.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "a valid email address is required.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabase();

    // Query orders table for a completed payment with this email
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, customer_email, payment_status")
      .ilike("customer_email", email)
      .eq("payment_status", "paid")
      .maybeSingle();

    if (error) {
      console.error("[founders/verify] Supabase query error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "a server error occurred. please try again.",
        },
        { status: 500 },
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error:
            "access denied. this email address was not found in our batch 01 order history.",
        },
        { status: 404 },
      );
    }

    const stripe = getStripe();
    const couponId = await getOrCreateFounderCoupon(stripe);

    // Check if an active promotion code was already generated in Stripe for this email
    let promoCodeString: string | null = null;

    try {
      const activeCodes = await stripe.promotionCodes.list({
        active: true,
        limit: 100,
      });
      const existing = activeCodes.data.find(
        (p) =>
          p.metadata?.customer_email?.toLowerCase() === email &&
          p.max_redemptions === 1 &&
          p.times_redeemed === 0,
      );
      if (existing) {
        promoCodeString = existing.code;
      }
    } catch (e) {
      console.warn("[founders/verify] Could not list existing promo codes:", e);
    }

    // If no active unused code exists, generate a new single-use promotion code in Stripe
    if (!promoCodeString) {
      let created = false;
      let attempts = 0;

      while (!created && attempts < 5) {
        attempts++;
        const candidateCode = generateFounderCode();
        try {
          const promoCode = await stripe.promotionCodes.create({
            promotion: {
              type: "coupon",
              coupon: couponId,
            },
            code: candidateCode,
            max_redemptions: 1,
            metadata: {
              customer_email: email,
              batch: "01",
              order_id: order.id,
            },
          });
          promoCodeString = promoCode.code;
          created = true;
        } catch (err: any) {
          if (err?.code === "resource_already_exists") {
            continue; // Retry with a new random code
          }
          console.error("[founders/verify] Stripe promo code creation error:", err);
          break;
        }
      }
    }

    // Fallback if Stripe promo code creation encountered an issue
    if (!promoCodeString) {
      promoCodeString = "FOUNDER15";
    }

    // Flag the record as a founding member in Supabase (non-fatal if columns are not present)
    try {
      await supabase
        .from("orders")
        .update({
          is_founding_member: true,
          founder_promo_code: promoCodeString,
        })
        .eq("id", order.id);
    } catch (updateError: any) {
      console.warn(
        "[founders/verify] Could not update founder fields on order:",
        updateError?.message,
      );
    }

    return NextResponse.json({
      success: true,
      code: promoCodeString,
      message:
        "verified. you are now registered as a batch 01 founding member with lifetime perks and 24h early access to project v2.",
    });
  } catch (err) {
    console.error("[founders/verify] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "a server error occurred. please try again.",
      },
      { status: 500 },
    );
  }
}
