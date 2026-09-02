"use client";

import { useState } from "react";
import BatchController from "@/components/admin/BatchController";
import FinancialsPanel from "@/components/admin/FinancialsPanel";
import OrdersTable from "@/components/admin/OrdersTable";
import ChatLogFeed from "@/components/admin/ChatLogFeed";
import type { AdminBatch } from "@/lib/batches";
import type { FinancialSummary, AdminOrderRow } from "@/lib/admin-data";
import type { ChatLogRow } from "@/lib/chat-logs";

const TABS = [
  { key: "overview", label: "overview" },
  { key: "batch", label: "batch control" },
  { key: "financials", label: "financials" },
  { key: "orders", label: "orders" },
  { key: "chat", label: "chat logs" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminDashboard({
  batch,
  financials,
  orders,
  chatLogs,
}: {
  batch: AdminBatch | null;
  financials: FinancialSummary;
  orders: AdminOrderRow[];
  chatLogs: ChatLogRow[];
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 pb-6 border-b border-hairline">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/40 lowercase">
          system / admin console
        </span>
        <h1 className="text-2xl md:text-3xl font-light text-white lowercase tracking-tight">
          control panel.
        </h1>
      </div>

      <div className="flex items-center gap-1 border border-hairline p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 px-4 py-2.5 min-h-[44px] font-mono text-[10px] tracking-[0.2em] lowercase transition-all duration-200 ${
              tab === t.key
                ? "bg-white text-[#0D0D0D]"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="flex flex-col gap-8">
          <FinancialsPanel financials={financials} compact />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-hairline p-6 flex flex-col gap-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 lowercase">
                active batch
              </span>
              {batch ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80 lowercase">
                      batch {String(batch.batchNumber).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] border border-hairline px-2 py-1 text-white/60 lowercase">
                      {batch.phase}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-mono text-[10px] text-white/40 lowercase">
                    <span>closes {batch.closeDateLabel}</span>
                    <span>ships {batch.shipDateLabel}</span>
                    <span>stock: {batch.stockCount ?? "—"}</span>
                  </div>
                  <button
                    onClick={() => setTab("batch")}
                    className="min-h-[44px] self-start px-4 border border-hairline text-[10px] font-mono tracking-[0.15em] text-white/60 hover:text-white hover:border-white/30 lowercase transition-colors"
                  >
                    manage batch →
                  </button>
                </div>
              ) : (
                <p className="font-mono text-xs text-white/40 lowercase">
                  no active batch found.
                </p>
              )}
            </div>

            <div className="border border-hairline p-6 flex flex-col gap-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 lowercase">
                recent orders
              </span>
              <OrdersTable orders={orders.slice(0, 6)} compact />
            </div>
          </div>
        </div>
      )}

      {tab === "batch" && <BatchController batch={batch} />}
      {tab === "financials" && <FinancialsPanel financials={financials} />}
      {tab === "orders" && <OrdersTable orders={orders} />}
      {tab === "chat" && <ChatLogFeed logs={chatLogs} />}
    </div>
  );
}
