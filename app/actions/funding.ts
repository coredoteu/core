"use server";

import { createClient } from "@supabase/supabase-js";
import { V2_TARGET_GOAL_EUR } from "@/lib/funding-engine";

/**
 * Fetches live V2 funding stats from the `orders` table.
 *
 * Uses the Supabase service-role key so it can bypass RLS and aggregate
 * across all paid, non-refunded orders in the batch.
 *
 * Returns:
 *   - current_funded: sum of v2_funded_amount across qualifying orders (EUR)
 *   - target_goal:    fixed V2 goal (€ 15,000)
 *   - percentage:     clamped 0–100 with 2 decimal places
 */
export async function getFundingStats(): Promise<{
  current_funded: number;
  target_goal: number;
  percentage: number;
}> {
  const fallback = { current_funded: 0, target_goal: V2_TARGET_GOAL_EUR, percentage: 0 };

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { data, error } = await supabase
      .from("orders")
      .select("v2_funded_amount")
      .eq("payment_status", "paid")
      .neq("status", "refunded");

    if (error) {
      console.error("[FundingStats] Supabase query error:", error.message);
      return fallback;
    }

    const totalFunded = (data ?? []).reduce(
      (sum, row) => sum + (Number(row.v2_funded_amount) || 0),
      0,
    );

    const rounded = Math.round(totalFunded * 100) / 100;
    const percentage = Math.min(
      100,
      Math.round((rounded / V2_TARGET_GOAL_EUR) * 10000) / 100,
    );

    return {
      current_funded: rounded,
      target_goal: V2_TARGET_GOAL_EUR,
      percentage,
    };
  } catch (err) {
    console.error("[FundingStats] Unexpected error:", err);
    return fallback;
  }
}
