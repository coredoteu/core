/**
 * lib/funding-engine.ts
 *
 * V2 Custom Batch Funding — Profit Calculation Engine
 *
 * Implements the full Dutch KOR (0% output VAT, non-reclaimable 21% input VAT)
 * profit model for CORE. Batch 01 orders, with:
 *   - Selfnamed tiered manufacturing COGS (volume-sensitive)
 *   - Fixed packaging COGS
 *   - Dynamic outbound shipping COGS (default 5.99, updated from Sendcloud)
 *   - Stripe processing fee (1.5% + €0.25)
 */

import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Target funding goal for V2 R&D, tooling, and 2x 300 kg custom batches */
export const V2_TARGET_GOAL_EUR = 15_000.00;

/**
 * Fixed packaging COGS per order (incl. 21% non-reclaimable VAT):
 *   Purepack box       € 1.57
 *   Logo sticker       € 0.57
 *   A6 BioPuur insert  € 0.35
 *   Tissue paper       € 0.11
 *   Seal sticker       € 0.02
 *   ─────────────────────────
 *   TOTAL              € 2.62
 */
export const PACKAGING_COGS_EUR = 2.62;

/** Default estimated outbound shipping cost (PostNL/DHL tracked) */
export const DEFAULT_SHIPPING_COGS_EUR = 5.99;

/** Stripe processing fee rate */
const STRIPE_FEE_RATE = 0.015;
/** Stripe fixed fee per transaction */
const STRIPE_FEE_FIXED_EUR = 0.25;

// ---------------------------------------------------------------------------
// Selfnamed Tiered COGS
// ---------------------------------------------------------------------------

/** One pricing tier based on total Duo-equivalent units in the batch */
interface SelNamedTier {
  /** Minimum total Duo-equivalent units (inclusive) */
  minDuos: number;
  /** Maximum total Duo-equivalent units (inclusive, Infinity for open-ended) */
  maxDuos: number;
  /** Manufacturing + inbound freight COGS for one Duo set (incl. 21% VAT) */
  duoCogs: number;
  /** Manufacturing + inbound freight COGS for one single bottle (incl. 21% VAT) */
  singleCogs: number;
}

/**
 * Selfnamed tiered COGS table.
 * Tier is determined by the TOTAL number of Duo units across all paid,
 * non-refunded Batch 01 orders at the time of each calculation.
 */
export const SELFNAMED_TIERS: SelNamedTier[] = [
  { minDuos: 1,   maxDuos: 9,   duoCogs: 32.16, singleCogs: 16.08 },
  { minDuos: 10,  maxDuos: 24,  duoCogs: 24.40, singleCogs: 12.20 },
  { minDuos: 25,  maxDuos: 49,  duoCogs: 24.46, singleCogs: 12.23 },
  { minDuos: 50,  maxDuos: 99,  duoCogs: 25.39, singleCogs: 12.70 },
  { minDuos: 100, maxDuos: Infinity, duoCogs: 24.77, singleCogs: 12.38 },
];

/**
 * Resolve the active Selfnamed tier for a given total Duo count.
 * Falls back to Tier 1 if duoCount < 1.
 */
export function getActiveTier(totalDuoCount: number): SelNamedTier {
  const effective = Math.max(1, totalDuoCount);
  return (
    SELFNAMED_TIERS.find(
      (t) => effective >= t.minDuos && effective <= t.maxDuos,
    ) ?? SELFNAMED_TIERS[0]
  );
}

// ---------------------------------------------------------------------------
// Per-order Profit Calculation
// ---------------------------------------------------------------------------

export interface OrderLineItems {
  /** Total quantity of duo-system-001 in this order */
  duoQuantity: number;
  /** Total quantity of individual single-bottle SKUs in this order */
  singleQuantity: number;
}

export interface ProfitResult {
  netProfit: number;
  v2FundedAmount: number;
  productCogs: number;
  fulfillmentCogs: number;
  stripeFee: number;
}

/**
 * Calculate net profit and V2 funded amount for a single order.
 *
 * @param orderRevenue   Actual amount collected (EUR), after all discounts applied
 * @param lineItems      Quantities of each product type in this order
 * @param shippingCogs   Actual outbound shipping cost (defaults to 5.99)
 * @param totalDuoCount  Current total Duo units in the batch (for tier resolution)
 */
export function calculateProfit(
  orderRevenue: number,
  lineItems: OrderLineItems,
  shippingCogs: number = DEFAULT_SHIPPING_COGS_EUR,
  totalDuoCount: number = 1,
): ProfitResult {
  const tier = getActiveTier(totalDuoCount);

  const productCogs =
    lineItems.duoQuantity * tier.duoCogs +
    lineItems.singleQuantity * tier.singleCogs;

  const fulfillmentCogs = PACKAGING_COGS_EUR + shippingCogs;

  const stripeFee =
    Math.round((orderRevenue * STRIPE_FEE_RATE + STRIPE_FEE_FIXED_EUR) * 100) /
    100;

  const rawNetProfit =
    orderRevenue - productCogs - fulfillmentCogs - stripeFee;

  const netProfit = Math.round(rawNetProfit * 100) / 100;
  const v2FundedAmount = Math.max(0, netProfit);

  return { netProfit, v2FundedAmount, productCogs, fulfillmentCogs, stripeFee };
}

// ---------------------------------------------------------------------------
// Batch Aggregation Helpers (Supabase admin client)
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

/**
 * Count the total number of Duo-equivalent units across all paid,
 * non-refunded orders in the batch (used for tier resolution).
 *
 * A "Duo unit" = one `duo-system-001` line item.
 * Single bottles count as 0 toward the tier threshold.
 */
export async function getTotalBatchDuoCount(): Promise<number> {
  const supabase = getSupabaseAdmin();

  // Fetch all order_items for paid, non-refunded orders
  const { data, error } = await supabase
    .from("order_items")
    .select("quantity, product_id, orders!inner(payment_status, status)")
    .eq("orders.payment_status", "paid")
    .neq("orders.status", "refunded")
    .eq("product_id", "duo-system-001");

  if (error) {
    console.error("[FundingEngine] getTotalBatchDuoCount error:", error);
    return 1; // Safe fallback — Tier 1
  }

  return (data ?? []).reduce((sum, row) => sum + (row.quantity ?? 0), 0);
}

/**
 * Recalculate and persist `net_profit` and `v2_funded_amount` for a
 * specific order. Used when:
 *   - Sendcloud returns the actual carrier price (shipping_cogs update)
 *   - The batch crosses a tier boundary (cascading recalc)
 *
 * @param orderId   Supabase `orders.id` UUID
 */
export async function recalculateOrderProfit(orderId: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Fetch the order
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("id, amount_total, shipping_cogs, payment_status, status")
    .eq("id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    console.error(
      "[FundingEngine] recalculateOrderProfit — order not found:",
      orderId,
      orderErr,
    );
    return;
  }

  // Skip if order is not in a profitable state
  if (order.payment_status !== "paid" || order.status === "refunded") {
    await supabase
      .from("orders")
      .update({ v2_funded_amount: 0.00 })
      .eq("id", orderId);
    return;
  }

  // Fetch line items
  const { data: items, error: itemsErr } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  if (itemsErr) {
    console.error(
      "[FundingEngine] recalculateOrderProfit — items error:",
      itemsErr,
    );
    return;
  }

  const lineItems = resolveLineItems(items ?? []);
  const shippingCogs = order.shipping_cogs ?? DEFAULT_SHIPPING_COGS_EUR;
  const totalDuos = await getTotalBatchDuoCount();

  const { netProfit, v2FundedAmount } = calculateProfit(
    order.amount_total,
    lineItems,
    shippingCogs,
    totalDuos,
  );

  const { error: updateErr } = await supabase
    .from("orders")
    .update({
      net_profit: netProfit,
      v2_funded_amount: v2FundedAmount,
    })
    .eq("id", orderId);

  if (updateErr) {
    console.error(
      "[FundingEngine] recalculateOrderProfit — update error:",
      updateErr,
    );
  } else {
    console.log(
      `[FundingEngine] Recalculated order ${orderId}: net_profit=${netProfit}, v2_funded=${v2FundedAmount}`,
    );
  }
}

/**
 * After a new order is inserted, check if the batch has crossed a Selfnamed
 * tier boundary and if so, recalculate ALL paid non-refunded orders.
 *
 * This ensures existing orders benefit from (or correctly reflect) the
 * volume-sensitive COGS at all times.
 *
 * @param newOrderId   The freshly inserted order's UUID
 */
export async function recalculateBatchIfTierChanged(
  newOrderId: string,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const totalDuos = await getTotalBatchDuoCount();
  const newTier = getActiveTier(totalDuos);

  // Determine old tier (before this order) — subtract this order's duo quantity
  const { data: newOrderItems } = await supabase
    .from("order_items")
    .select("quantity, product_id")
    .eq("order_id", newOrderId)
    .eq("product_id", "duo-system-001");

  const newOrderDuoQty = (newOrderItems ?? []).reduce(
    (sum, i) => sum + (i.quantity ?? 0),
    0,
  );
  const prevDuos = Math.max(0, totalDuos - newOrderDuoQty);
  const oldTier = getActiveTier(prevDuos);

  if (oldTier.minDuos === newTier.minDuos) {
    // No tier change — just compute this order's own profit, done
    await recalculateOrderProfit(newOrderId);
    return;
  }

  console.log(
    `[FundingEngine] Tier changed: Tier ${SELFNAMED_TIERS.indexOf(oldTier) + 1} → Tier ${SELFNAMED_TIERS.indexOf(newTier) + 1} (${totalDuos} total duos). Recalculating all batch orders.`,
  );

  // Fetch all paid non-refunded order IDs
  const { data: allOrders, error } = await supabase
    .from("orders")
    .select("id")
    .eq("payment_status", "paid")
    .neq("status", "refunded");

  if (error || !allOrders) {
    console.error(
      "[FundingEngine] recalculateBatchIfTierChanged — fetch error:",
      error,
    );
    return;
  }

  // Recalculate each order sequentially to avoid flooding the DB
  for (const { id } of allOrders) {
    await recalculateOrderProfit(id);
  }
}

// ---------------------------------------------------------------------------
// Utility: parse order_items rows → OrderLineItems
// ---------------------------------------------------------------------------

export function resolveLineItems(
  items: Array<{ product_id: string | null; quantity: number }>,
): OrderLineItems {
  let duoQuantity = 0;
  let singleQuantity = 0;

  for (const item of items) {
    const pid = item.product_id ?? "";
    if (pid === "duo-system-001") {
      duoQuantity += item.quantity;
    } else if (pid === "shampoo-290" || pid === "conditioner-290") {
      singleQuantity += item.quantity;
    }
  }

  return { duoQuantity, singleQuantity };
}
