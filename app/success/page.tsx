"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { CATALOG } from "@/lib/catalog";

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

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear cart once user reaches success page
    clearCart();

    if (!sessionId) {
      setLoading(false);
      setError("No session ID provided in request.");
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/confirm?session_id=${encodeURIComponent(sessionId!)}`);
        const data = await res.json();

        if (res.ok && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || "Could not retrieve order details.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load order confirmation.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [sessionId, clearCart]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-32 md:pt-44 pb-24">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="font-mono text-xs text-white/60 lowercase tracking-[0.2em]">
            confirming order & syncing system...
          </p>
        </div>
      ) : error && !order ? (
        <div className="border border-white/10 p-8 md:p-12 flex flex-col gap-6 max-w-xl mx-auto bg-white/[0.02]">
          <div className="flex items-center gap-3 text-red-400 font-mono text-xs tracking-[0.2em] lowercase">
            <span>00 // order status warning</span>
          </div>
          <h1 className="text-2xl font-light text-white lowercase">order payment confirmed</h1>
          <p className="text-xs text-white/60 font-mono lowercase leading-relaxed">
            your payment was processed successfully with stripe (session: {sessionId?.slice(0, 16)}...).
            <br />
            note: {error}
          </p>
          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
            <Link
              href="/shop"
              className="px-6 py-3 border border-white text-black bg-white text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 transition-colors"
            >
              [ return to shop ]
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.2em] bg-white/10 px-2.5 py-1 text-white/80 lowercase">
                order confirmed
              </span>
              <span className="font-mono text-xs tracking-[0.15em] text-white/60 lowercase">
                status: paid
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extralight text-white tracking-tight lowercase">
              thank you for your order.
            </h1>
            <p className="text-sm text-white/60 lowercase max-w-xl leading-relaxed">
              your system pre-order has been registered into our database. a confirmation summary has been logged.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Order Details */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Order Reference Card */}
              <div className="border border-white/10 p-6 md:p-8 bg-white/[0.02] flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-mono text-xs tracking-[0.2em] text-white/60 lowercase">
                    order reference
                  </span>
                  <span className="font-mono text-xs text-white/60 tracking-wider">
                    #{order?.id ? order.id.slice(0, 8) : "N/A"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
                      customer email
                    </span>
                    <span className="text-sm text-white font-mono lowercase">
                      {order?.customer_email}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
                      payment method
                    </span>
                    <span className="text-sm text-white font-mono lowercase">
                      stripe test card (succeeded)
                    </span>
                  </div>
                </div>

                {order?.shipping_details && (
                  <div className="border-t border-white/10 pt-4 flex flex-col gap-1">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
                      shipping address
                    </span>
                    <p className="text-xs text-white/80 font-mono leading-relaxed lowercase">
                      {order.shipping_details.name}
                      <br />
                      {order.shipping_details.address?.line1} {order.shipping_details.address?.line2}
                      <br />
                      {order.shipping_details.address?.postal_code} {order.shipping_details.address?.city},{" "}
                      {order.shipping_details.address?.country}
                    </p>
                  </div>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="border border-white/10 p-6 md:p-8 bg-white/[0.015]">
                <span className="block text-xs font-mono tracking-[0.2em] text-white/60 lowercase mb-6">
                  purchased items
                </span>

                <div className="flex flex-col divide-y divide-white/10">
                  {order?.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item) => {
                      const catalogItem = CATALOG.find((c) => c.id === item.product_id);
                      return (
                        <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-white font-light lowercase">
                              <span className="uppercase font-normal">CORE.</span> {catalogItem?.name || item.product_id}
                            </span>
                            <span className="text-[10px] font-mono text-white/60">
                              qty: {item.quantity} × €{item.price_at_purchase.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-sm font-mono text-white tabular-nums">
                            €{(item.price_at_purchase * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-4 flex items-center justify-between">
                      <span className="text-sm text-white font-light lowercase">
                        <span className="uppercase font-normal">CORE.</span> system order
                      </span>
                      <span className="text-sm font-mono text-white tabular-nums">
                        €{order?.amount_total.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary & Actions Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="border border-white/10 p-6 bg-white/[0.02] flex flex-col gap-4">
                <span className="text-xs font-mono tracking-[0.2em] text-white/60 lowercase border-b border-white/10 pb-3">
                  summary
                </span>

                <div className="flex items-center justify-between text-xs font-mono text-white/60 lowercase">
                  <span>subtotal</span>
                  <span className="text-white">€{order?.amount_total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-white/60 lowercase">
                  <span>shipping</span>
                  <span className="text-white">free</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-white/60 lowercase">
                  <span>supabase database</span>
                  <span className="text-emerald-400">synced</span>
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between font-mono text-sm text-white">
                  <span>total paid</span>
                  <span className="text-base font-light">€{order?.amount_total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/shop"
                  className="w-full py-4 bg-white text-black text-center text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 transition-colors"
                >
                  [ continue shopping ]
                </Link>
                <Link
                  href="/"
                  className="w-full py-3.5 border border-white/20 text-white/60 text-center text-xs font-mono tracking-[0.15em] lowercase hover:text-white hover:border-white/40 transition-colors"
                >
                  [ return home ]
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="font-mono text-xs text-white/60 lowercase tracking-[0.2em]">
              loading order details...
            </p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
