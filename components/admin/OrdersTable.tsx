"use client";

import { useMemo, useState } from "react";
import type { AdminOrderRow } from "@/lib/admin-data";

const FILTERS = ["all", "paid", "refunded", "pending"] as const;
type Filter = (typeof FILTERS)[number];

function StatusPill({ status }: { status: string }) {
  const isActive = status === "paid" || status === "succeeded";
  return (
    <span
      className={`font-mono text-[9px] tracking-[0.15em] px-2 py-1 border lowercase whitespace-nowrap ${
        isActive ? "border-white/30 text-white" : "border-hairline text-white/40"
      }`}
    >
      {status}
    </span>
  );
}

export default function OrdersTable({
  orders,
  compact = false,
}: {
  orders: AdminOrderRow[];
  compact?: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "refunded") return orders.filter((o) => o.status === "refunded");
    if (filter === "pending")
      return orders.filter(
        (o) => o.paymentStatus !== "paid" && o.status !== "refunded",
      );
    return orders.filter(
      (o) => o.paymentStatus === "paid" && o.status !== "refunded",
    );
  }, [orders, filter]);

  return (
    <div className="flex flex-col gap-4">
      {!compact && (
        <div className="flex items-center gap-1 border border-hairline p-1 w-fit overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 min-h-[36px] font-mono text-[9px] tracking-[0.15em] lowercase transition-colors ${
                filter === f
                  ? "bg-white text-[#0D0D0D]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="border border-hairline overflow-x-auto">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-white/[0.02]">
              {[
                "ref",
                "customer",
                "country",
                "items",
                "total",
                "status",
                "net profit",
                "shipping",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-mono text-[9px] tracking-[0.15em] text-white/40 lowercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center font-mono text-[11px] text-white/30 lowercase"
                >
                  no orders match this filter.
                </td>
              </tr>
            )}
            {filtered.map((o) => (
              <tr
                key={o.id}
                className="border-b border-hairline last:border-0 hover:bg-white/[0.015]"
              >
                <td className="px-4 py-3 font-mono text-[10px] text-white/70 whitespace-nowrap">
                  #{o.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-xs text-white/70 lowercase max-w-[180px] truncate">
                  {o.customerEmail}
                </td>
                <td className="px-4 py-3 text-xs text-white/50 lowercase whitespace-nowrap">
                  {o.country}
                </td>
                <td className="px-4 py-3 text-[10px] text-white/50 lowercase max-w-[200px]">
                  {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ") ||
                    "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white tabular-nums whitespace-nowrap">
                  €{o.amountTotal.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <StatusPill
                    status={o.status === "refunded" ? "refunded" : o.paymentStatus}
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white/60 tabular-nums whitespace-nowrap">
                  {o.netProfit !== null ? `€${o.netProfit.toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {o.trackingUrl ? (
                    <a
                      href={o.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[10px] text-white/60 hover:text-white underline underline-offset-2 lowercase"
                    >
                      {o.carrier ?? "track"} →
                    </a>
                  ) : (
                    <span className="font-mono text-[10px] text-white/25 lowercase">
                      {o.shippingStatus ?? "pending"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
