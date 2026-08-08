"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import { CATALOG } from "@/lib/catalog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderDetail {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name?: string;
  amount_total: number;
  currency: string;
  payment_status: string;
  shipping_details?: {
    name?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
  };
  created_at: string;
  order_items?: {
    id: string;
    product_id: string;
    quantity: number;
    price_at_purchase: number;
  }[];
}

// ─── Loader ───────────────────────────────────────────────────────────────────

function LoaderState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <div className="relative w-12 h-12">
        <div
          className="absolute inset-0 border border-white/20 animate-ping"
          style={{ animationDuration: "1.6s" }}
        />
        <div className="absolute inset-2 border border-white/40" />
        <div className="absolute inset-4 bg-white/10" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="font-mono text-[10px] text-text-muted lowercase tracking-[0.3em]">
          confirming order
        </p>
        <p className="font-mono text-[10px] text-text-faint lowercase tracking-[0.2em]">
          syncing system...
        </p>
      </div>
    </div>
  );
}

// ─── Row helper ───────────────────────────────────────────────────────────────

function DataRow({
  label,
  value,
  valueClass = "text-white",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-hairline last:border-0">
      <span className="text-[10px] font-mono tracking-[0.2em] text-text-faint lowercase">
        {label}
      </span>
      <span className={`text-xs font-mono ${valueClass} lowercase`}>{value}</span>
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const cartCleared = useRef(false);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    // Clear cart exactly once — not reactive to clearCart reference changes
    if (!cartCleared.current) {
      clearCart();
      cartCleared.current = true;
    }

    if (!sessionId) {
      setLoading(false);
      setSyncError("no session id provided.");
      return;
    }

    let cancelled = false;

    async function fetchOrder() {
      try {
        const res = await fetch(
          `/api/orders/confirm?session_id=${encodeURIComponent(sessionId!)}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (cancelled) return;

        if (res.ok && data.order) {
          setOrder(data.order);
        } else {
          // Payment was captured by Stripe even if DB sync fails
          setSyncError(data.error || "order details unavailable.");
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "network error";
        setSyncError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrder();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (loading) return <LoaderState />;

  // ── No session at all ────────────────────────────────────────────────────
  if (!sessionId) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-32 md:pt-44 pb-24">
        <div className="border border-hairline p-8 md:p-12 max-w-lg mx-auto bg-white/[0.02] flex flex-col gap-6">
          <span className="font-mono text-[10px] tracking-[0.3em] text-text-faint lowercase">
            status / unknown
          </span>
          <h1 className="text-2xl font-extralight text-white lowercase">
            no session detected.
          </h1>
          <p className="text-xs font-mono text-text-muted leading-relaxed lowercase">
            this page requires a valid stripe session id. if you believe this is
            an error, please contact support.
          </p>
          <Link
            id="cta-return-shop-nosession"
            href="/shop"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-black text-[10px] font-mono tracking-[0.25em] lowercase hover:bg-white/90 transition-colors w-fit"
          >
            return to shop
          </Link>
        </div>
      </div>
    );
  }

  // ── Payment confirmed / DB sync failed (non-blocking) ────────────────────
  if (syncError && !order) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-32 md:pt-44 pb-24">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 border-b border-hairline pb-10">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[10px] tracking-[0.3em] text-text-faint lowercase">
                payment / captured
              </span>
              <span className="w-px h-3 bg-white/10 hidden sm:block" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-text-faint lowercase">
                system / sync pending
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extralight text-white tracking-tight lowercase">
              payment confirmed.
            </h1>
            <p className="text-sm text-text-muted lowercase max-w-lg leading-relaxed">
              your stripe payment was captured. our system is processing the
              order record. a confirmation will arrive by email shortly.
            </p>
          </div>

          <div className="border border-hairline p-6 bg-white/[0.02] max-w-xl flex flex-col gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-text-faint lowercase border-b border-hairline pb-3">
              session reference
            </span>
            <p className="font-mono text-xs text-text-muted break-all lowercase">
              {sessionId}
            </p>
            <p className="font-mono text-[10px] text-text-faint leading-relaxed lowercase">
              system note: {syncError}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              id="cta-shop-syncing"
              href="/shop"
              className="px-6 py-3.5 bg-white text-black text-[10px] font-mono tracking-[0.25em] lowercase hover:bg-white/90 transition-colors"
            >
              continue shopping
            </Link>
            <Link
              id="cta-home-syncing"
              href="/"
              className="px-6 py-3.5 border border-hairline text-text-muted text-[10px] font-mono tracking-[0.2em] lowercase hover:text-white hover:border-white/30 transition-colors"
            >
              return home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Full success with order data ─────────────────────────────────────────
  const hasItems = order?.order_items && order.order_items.length > 0;
  const orderRef = order?.id ? order.id.slice(0, 8).toUpperCase() : "—";
  const createdAt = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).toLowerCase()
    : null;

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-32 md:pt-44 pb-24">
      <div className="flex flex-col gap-14">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 border-b border-hairline pb-10">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full  bg-white opacity-60" />
                <span className="relative inline-flex  h-2 w-2 bg-white" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-white/80 lowercase">
                order confirmed
              </span>
            </div>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-text-faint lowercase">
              payment / paid
            </span>
            {createdAt && (
              <>
                <span className="w-px h-3 bg-white/10 hidden sm:block" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-text-faint lowercase">
                  {createdAt}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extralight text-white tracking-tight lowercase">
            thank you.
          </h1>
          <p className="text-sm text-text-muted lowercase max-w-lg leading-relaxed">
            your order has been registered. a confirmation email has been
            dispatched to your address. we will notify you when your system
            ships.
          </p>
        </div>

        {/* ── Two-column grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left: order details */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

            {/* Reference panel */}
            <div className="border border-hairline bg-white/[0.018]">
              <div className="px-6 py-4 border-b border-hairline flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.25em] text-text-faint lowercase">
                  order reference
                </span>
                <span className="font-mono text-xs text-text-muted tracking-widest">
                  #{orderRef}
                </span>
              </div>
              <div className="px-6 py-2">
                <DataRow
                  label="customer"
                  value={order?.customer_email ?? "—"}
                  valueClass="text-white/80"
                />
                {order?.customer_name && (
                  <DataRow
                    label="name"
                    value={order.customer_name}
                    valueClass="text-white/80"
                  />
                )}
                <DataRow
                  label="payment"
                  value="stripe / captured"
                  valueClass="text-white/80"
                />
                <DataRow
                  label="currency"
                  value={order?.currency?.toUpperCase() ?? "EUR"}
                  valueClass="text-text-muted"
                />
              </div>
            </div>

            {/* Shipping address panel */}
            {order?.shipping_details && (
              <div className="border border-hairline bg-white/[0.018]">
                <div className="px-6 py-4 border-b border-hairline">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-text-faint lowercase">
                    shipping address
                  </span>
                </div>
                <div className="px-6 py-5">
                  <p className="font-mono text-xs text-text-muted leading-[1.9] lowercase">
                    {order.shipping_details.name && (
                      <span className="block text-white/80">
                        {order.shipping_details.name}
                      </span>
                    )}
                    {order.shipping_details.address?.line1 && (
                      <span className="block">
                        {order.shipping_details.address.line1}
                        {order.shipping_details.address.line2
                          ? `, ${order.shipping_details.address.line2}`
                          : ""}
                      </span>
                    )}
                    {(order.shipping_details.address?.postal_code ||
                      order.shipping_details.address?.city) && (
                      <span className="block">
                        {order.shipping_details.address.postal_code}{" "}
                        {order.shipping_details.address.city}
                      </span>
                    )}
                    {order.shipping_details.address?.country && (
                      <span className="block">
                        {order.shipping_details.address.country}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Items panel */}
            <div className="border border-hairline bg-white/[0.018]">
              <div className="px-6 py-4 border-b border-hairline">
                <span className="font-mono text-[10px] tracking-[0.25em] text-text-faint lowercase">
                  purchased items
                </span>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {hasItems ? (
                  order!.order_items!.map((item) => {
                    const catalogItem = CATALOG.find(
                      (c) => c.id === item.product_id
                    );
                    // price_at_purchase is stored as unit price per item
                    const unitPrice = item.price_at_purchase;
                    const lineTotal = item.price_at_purchase * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="px-6 py-5 flex items-center justify-between gap-6"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-sm font-light text-white lowercase leading-snug">
                            <span className="font-normal not-lowercase">CORE.</span>{" "}
                            {catalogItem?.name ?? item.product_id}
                          </span>
                          <span className="font-mono text-[10px] text-white/35 lowercase">
                            {catalogItem?.unit && `${catalogItem.unit} / `}
                            qty: {item.quantity} &times; &euro;{unitPrice.toFixed(2)}
                          </span>
                        </div>
                        <span className="font-mono text-sm text-white tabular-nums shrink-0">
                          &euro;{lineTotal.toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-6 py-5 flex items-center justify-between">
                    <span className="text-sm font-light text-white lowercase">
                      <span className="font-normal not-lowercase">CORE.</span>{" "}
                      system order
                    </span>
                    <span className="font-mono text-sm text-white tabular-nums">
                      &euro;{order?.amount_total.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: summary + actions */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">

            {/* Summary card */}
            <div className="border border-hairline bg-white/[0.018]">
              <div className="px-6 py-4 border-b border-hairline">
                <span className="font-mono text-[10px] tracking-[0.25em] text-text-faint lowercase">
                  summary
                </span>
              </div>
              <div className="px-6 py-2">
                <DataRow
                  label="subtotal"
                  value={`€${order?.amount_total.toFixed(2)}`}
                />
                <DataRow
                  label="shipping"
                  value="free"
                  valueClass="text-text-muted"
                />
                <DataRow
                  label="database"
                  value="synced"
                  valueClass="text-white/80"
                />
              </div>
              <div className="px-6 pt-4 pb-6 border-t border-hairline mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-text-faint lowercase">
                    total paid
                  </span>
                  <span className="font-mono text-xl font-light text-white tabular-nums">
                    &euro;{order?.amount_total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Session ID micro-panel */}
            <div className="border border-hairline px-5 py-4 flex flex-col gap-1.5">
              <span className="font-mono text-[9px] tracking-[0.25em] text-text-dim lowercase">
                stripe session
              </span>
              <p className="font-mono text-[9px] text-text-faint break-all leading-relaxed">
                {sessionId}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                id="cta-continue-shopping"
                href="/shop"
                className="w-full py-4 bg-white text-black text-center text-[10px] font-mono tracking-[0.3em] lowercase hover:bg-white/90 active:scale-[0.98] transition-all"
              >
                continue shopping
              </Link>
              <Link
                id="cta-return-home"
                href="/"
                className="w-full py-3.5 border border-hairline text-text-faint text-center text-[10px] font-mono tracking-[0.2em] lowercase hover:text-white/70 hover:border-white/30 transition-colors"
              >
                return home
              </Link>
            </div>

            {/* What happens next */}
            <div className="border border-hairline px-5 py-5 flex flex-col gap-4 mt-2">
              <span className="font-mono text-[10px] tracking-[0.25em] text-text-faint lowercase">
                what happens next
              </span>
              <ol className="flex flex-col gap-3">
                {[
                  "confirmation email dispatched to your address",
                  "order enters fulfillment queue within 1-2 days",
                  "tracking number sent when system ships",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-[9px] text-text-dim pt-0.5 tabular-nums shrink-0">
                      0{i + 1}
                    </span>
                    <span className="font-mono text-[10px] text-text-faint leading-relaxed lowercase">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoaderState />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
