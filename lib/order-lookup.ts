import type { SupabaseClient } from "@supabase/supabase-js";

const ORDER_SELECT_WITH_ITEMS =
  "id, stripe_session_id, amount_total, currency, payment_status, created_at, " +
  "shipping_details, carrier, tracking_number, tracking_url, shipping_status, cancellation_requested, cancellation_requested_at, order_items(product_id, quantity, price_at_purchase)";

export async function findOrder(supabaseAsUser: SupabaseClient, reference?: string): Promise<{ data: any; error: any }> {
  let query = supabaseAsUser
    .from("orders")
    .select(ORDER_SELECT_WITH_ITEMS)
    .order("created_at", { ascending: false })
    .limit(1);

  if (reference) {
    query = supabaseAsUser
      .from("orders")
      .select(ORDER_SELECT_WITH_ITEMS)
      .or(`id.ilike.%${reference}%,stripe_session_id.ilike.%${reference}%`)
      .order("created_at", { ascending: false })
      .limit(1);
  }

  return query.maybeSingle();
}
