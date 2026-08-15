import { supabaseAdmin } from "@/lib/supabase";

export async function getActiveBatch() {
  const { data, error } = await supabaseAdmin
    .from("batches")
    .select("batch_number, phase, preorder_close_date, ship_window_start, ship_window_end, stock_count")
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return {
    batchNumber: data.batch_number,
    phase: data.phase,
    preorderCloseDate: data.preorder_close_date,
    shipWindowStart: data.ship_window_start,
    shipWindowEnd: data.ship_window_end,
    stockCount: data.stock_count,
  };
}
