import { supabaseAdmin } from "@/lib/supabase";
import { CATALOG } from "@/lib/catalog";
import { countryNameFromCode } from "@/lib/countries";
import { getFundingStats } from "@/app/actions/funding";
import {
  DEFAULT_SHIPPING_COGS_EUR,
  PACKAGING_COGS_EUR,
  SELFNAMED_TIERS,
  getActiveTier,
  getTotalBatchDuoCount,
  calculateProfit,
  resolveLineItems,
} from "@/lib/funding-engine";

export interface AdminOrderItem {
  productId: string | null;
  name: string;
  quantity: number;
}

export interface AdminOrderRow {
  id: string;
  stripeSessionId: string;
  customerEmail: string;
  country: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  status: string | null;
  netProfit: number | null;
  shippingStatus: string | null;
  carrier: string | null;
  trackingUrl: string | null;
  createdAt: string;
  items: AdminOrderItem[];
}

export async function getRecentOrdersAdmin(
  limit = 100,
): Promise<AdminOrderRow[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, stripe_session_id, customer_email, amount_total, currency, payment_status, status, net_profit, shipping_status, carrier, tracking_url, shipping_details, created_at, order_items(product_id, quantity)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[AdminData] getRecentOrdersAdmin error:", error);
    return [];
  }

  return (data ?? []).map((o: any) => ({
    id: o.id,
    stripeSessionId: o.stripe_session_id,
    customerEmail: o.customer_email,
    country: countryNameFromCode(o.shipping_details?.address?.country),
    amountTotal: Number(o.amount_total) || 0,
    currency: o.currency,
    paymentStatus: o.payment_status,
    status: o.status,
    netProfit:
      o.net_profit !== null && o.net_profit !== undefined
        ? Number(o.net_profit)
        : null,
    shippingStatus: o.shipping_status,
    carrier: o.carrier,
    trackingUrl: o.tracking_url,
    createdAt: o.created_at,
    items: (o.order_items ?? []).map((item: any) => {
      const catalogItem = CATALOG.find((c) => c.id === item.product_id);
      return {
        productId: item.product_id,
        name: catalogItem?.name ?? item.product_id ?? "item",
        quantity: item.quantity,
      };
    }),
  }));
}

export interface FinancialSummary {
  grossRevenue: number;
  netProfit: number;
  v2Funded: number;
  v2Target: number;
  v2Percentage: number;
  activeTierIndex: number;
  totalDuoCount: number;
  productCogs: number;
  packagingCogs: number;
  avgShippingCogs: number;
  totalShippingCogs: number;
  stripeFees: number;
  orderCount: number;
}

const EMPTY_SUMMARY: FinancialSummary = {
  grossRevenue: 0,
  netProfit: 0,
  v2Funded: 0,
  v2Target: 15000,
  v2Percentage: 0,
  activeTierIndex: 1,
  totalDuoCount: 0,
  productCogs: 0,
  packagingCogs: 0,
  avgShippingCogs: DEFAULT_SHIPPING_COGS_EUR,
  totalShippingCogs: 0,
  stripeFees: 0,
  orderCount: 0,
};

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, amount_total, shipping_cogs, order_items(product_id, quantity)")
    .eq("payment_status", "paid")
    .neq("status", "refunded");

  if (error || !orders) {
    console.error("[AdminData] getFinancialSummary error:", error);
    return EMPTY_SUMMARY;
  }

  const [totalDuoCount, fundingStats] = await Promise.all([
    getTotalBatchDuoCount(),
    getFundingStats(),
  ]);

  const tier = getActiveTier(totalDuoCount);
  const activeTierIndex =
    SELFNAMED_TIERS.findIndex((t) => t.minDuos === tier.minDuos) + 1;

  let grossRevenue = 0;
  let netProfit = 0;
  let productCogs = 0;
  let packagingCogs = 0;
  let totalShippingCogs = 0;
  let stripeFees = 0;

  for (const order of orders as any[]) {
    const amount = Number(order.amount_total) || 0;
    const shippingCogs =
      order.shipping_cogs !== null && order.shipping_cogs !== undefined
        ? Number(order.shipping_cogs)
        : DEFAULT_SHIPPING_COGS_EUR;
    const lineItems = resolveLineItems(order.order_items ?? []);
    const result = calculateProfit(amount, lineItems, shippingCogs, totalDuoCount);

    grossRevenue += amount;
    netProfit += result.netProfit;
    productCogs += result.productCogs;
    packagingCogs += PACKAGING_COGS_EUR;
    totalShippingCogs += shippingCogs;
    stripeFees += result.stripeFee;
  }

  const orderCount = orders.length;

  return {
    grossRevenue: Math.round(grossRevenue * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    v2Funded: fundingStats.current_funded,
    v2Target: fundingStats.target_goal,
    v2Percentage: fundingStats.percentage,
    activeTierIndex: activeTierIndex > 0 ? activeTierIndex : 1,
    totalDuoCount,
    productCogs: Math.round(productCogs * 100) / 100,
    packagingCogs: Math.round(packagingCogs * 100) / 100,
    avgShippingCogs:
      orderCount > 0
        ? Math.round((totalShippingCogs / orderCount) * 100) / 100
        : DEFAULT_SHIPPING_COGS_EUR,
    totalShippingCogs: Math.round(totalShippingCogs * 100) / 100,
    stripeFees: Math.round(stripeFees * 100) / 100,
    orderCount,
  };
}
