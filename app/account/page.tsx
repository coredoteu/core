import { redirect } from "next/navigation";
import { getServerSession, createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import SignOutButton from "@/components/account/SignOutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account — CORE.",
  description: "Manage your CORE. account and view your order history.",
};

// ── Types ───────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  product_id: string;
  products: {
    name: string;
    size: string;
    unit: string;
    image: string;
  } | null;
}

interface Order {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name: string | null;
  amount_total: number;
  currency: string;
  payment_status: string;
  shipping_details: {
    name?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
  } | null;
  created_at: string;
  order_items: OrderItem[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function formatAddress(
  details: Order["shipping_details"]
): string | null {
  if (!details?.address) return null;
  const { line1, city, postal_code, country } = details.address;
  return [line1, city, postal_code, country].filter(Boolean).join(", ");
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AccountPage() {
  // 1. Auth guard
  const session = await getServerSession();
  if (!session) redirect("/login");

  const user = session.user;
  const email = user.email ?? "";
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? email.split("@")[0];
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // 2. Fetch orders (using admin client to bypass RLS, filtered by email)
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id,
      stripe_session_id,
      customer_email,
      customer_name,
      amount_total,
      currency,
      payment_status,
      shipping_details,
      created_at,
      order_items (
        id,
        quantity,
        price_at_purchase,
        product_id,
        products (
          name,
          size,
          unit,
          image
        )
      )
    `
    )
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  const safeOrders: Order[] = (orders as Order[] | null) ?? [];

  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-20 px-6">
      {/* Subtle top glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto space-y-12">
        {/* ── Profile Header ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
                <span className="text-xs font-mono text-white/50 tracking-wider">
                  {initials}
                </span>
              </div>
              {/* Name + email */}
              <div>
                <div className="flex items-center gap-2.5 mb-0.5">
                  <h1 className="text-base font-light text-white/90 tracking-tight lowercase">
                    {fullName}
                  </h1>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-white/30 border border-white/10 rounded-full px-2 py-0.5 lowercase">
                    customer
                  </span>
                </div>
                <p className="text-[11px] font-mono text-white/30">{email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>

          {/* Divider */}
          <div className="mt-8 h-px bg-white/[0.06]" />
        </section>

        {/* ── Order History ───────────────────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <p className="text-[10px] font-mono tracking-[0.3em] text-white/30 lowercase mb-1">
              order history
            </p>
            <p className="text-[11px] text-white/20">
              {safeOrders.length === 0
                ? "no orders yet"
                : `${safeOrders.length} order${safeOrders.length > 1 ? "s" : ""}`}
            </p>
            {error && (
              <p className="mt-2 text-[11px] font-mono text-red-400/60">
                could not load orders
              </p>
            )}
          </div>

          {safeOrders.length === 0 ? (
            /* Empty state */
            <div className="border border-white/[0.06] rounded-sm px-6 py-10 text-center">
              <p className="text-[11px] font-mono text-white/20 lowercase tracking-wider">
                your orders will appear here
              </p>
              <a
                href="/shop"
                className="mt-4 inline-block text-[10px] font-mono tracking-[0.25em] lowercase text-white/40 hover:text-white/70 underline underline-offset-4 decoration-white/15 transition-colors duration-200"
              >
                explore the shop →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {safeOrders.map((order) => {
                const address = formatAddress(order.shipping_details);
                return (
                  <article
                    key={order.id}
                    className="border border-white/[0.08] rounded-sm bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-300"
                  >
                    {/* Order header */}
                    <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-white/[0.06]">
                      <div>
                        <p className="text-[9px] font-mono tracking-[0.25em] text-white/25 lowercase mb-1">
                          {formatDate(order.created_at)}
                        </p>
                        <p className="text-[10px] font-mono text-white/20 truncate max-w-[200px]">
                          #{order.stripe_session_id.slice(-12)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Payment status pill */}
                        <span
                          className={`text-[9px] font-mono tracking-[0.2em] lowercase px-2 py-0.5 rounded-full border ${
                            order.payment_status === "paid"
                              ? "text-emerald-400/70 border-emerald-400/20 bg-emerald-400/5"
                              : "text-yellow-400/70 border-yellow-400/20 bg-yellow-400/5"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                        {/* Total */}
                        <span className="text-sm font-light text-white/80">
                          {formatCurrency(order.amount_total, order.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="px-5 py-4 space-y-3">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            {/* Quantity badge */}
                            <span className="text-[9px] font-mono text-white/30 bg-white/[0.04] border border-white/[0.06] rounded-sm w-6 h-6 flex items-center justify-center shrink-0">
                              {item.quantity}
                            </span>
                            <div>
                              <p className="text-[12px] text-white/70 lowercase leading-tight">
                                {item.products?.name ?? item.product_id}
                              </p>
                              {item.products?.size && (
                                <p className="text-[10px] font-mono text-white/25 mt-0.5">
                                  {item.products.size}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-[12px] font-mono text-white/40 shrink-0">
                            {formatCurrency(item.price_at_purchase, order.currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping address */}
                    {address && (
                      <div className="px-5 pb-4 pt-1">
                        <p className="text-[9px] font-mono tracking-[0.2em] text-white/20 lowercase mb-1">
                          ships to
                        </p>
                        <p className="text-[11px] text-white/30">{address}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
