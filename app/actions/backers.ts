"use server";

import { createClient } from "@supabase/supabase-js";
import { countryNameFromCode } from "@/lib/countries";

export interface BackerLedgerEntry {
  founderNumber: number;
  country: string;
  productLabel: string;
  v2FundedAmount: number;
  createdAt: string;
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function getBackerLedger(
  limitCount = 10,
): Promise<BackerLedgerEntry[]> {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.rpc("get_backer_ledger", {
      limit_count: limitCount,
    });

    if (error) {
      console.error("[BackerLedger] rpc error:", error.message);
      return [];
    }

    return (data ?? []).map((row: any) => ({
      founderNumber: Number(row.founder_number),
      country: countryNameFromCode(row.country),
      productLabel: row.product_label as string,
      v2FundedAmount: Number(row.v2_funded_amount) || 0,
      createdAt: row.created_at as string,
    }));
  } catch (err) {
    console.error("[BackerLedger] unexpected error:", err);
    return [];
  }
}
