"use client";

import { useActionState, useState } from "react";
import { updateBatchAction, type BatchUpdateResult } from "@/app/actions/admin";
import type { AdminBatch } from "@/lib/batches";
import type { BatchPhase } from "@/components/product/BatchCartSection";

const PHASES: { value: BatchPhase; label: string }[] = [
  { value: "preorder", label: "pre-order" },
  { value: "buffer", label: "buffer stock" },
  { value: "soldout", label: "sold out" },
];

const initialState: BatchUpdateResult = { success: false, error: "" };

export default function BatchController({ batch }: { batch: AdminBatch | null }) {
  const [state, formAction, isPending] = useActionState(
    updateBatchAction,
    initialState,
  );
  const [phase, setPhase] = useState<BatchPhase>(batch?.phase ?? "preorder");

  if (!batch) {
    return (
      <div className="border border-hairline p-6">
        <p className="font-mono text-xs text-white/50 lowercase">
          no active batch found. seed the `batches` table (see
          supabase/migrations/003_concierge_features.sql) to enable live
          control.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-hairline">
      <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-white/[0.02]">
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 lowercase">
          batch {String(batch.batchNumber).padStart(2, "0")} / live controller
        </span>
        <span className="font-mono text-[9px] tracking-[0.15em] text-white/30 lowercase">
          {isPending ? "saving..." : "synced"}
        </span>
      </div>

      <form action={formAction} className="p-6 flex flex-col gap-6">
        <input type="hidden" name="batchId" value={batch.id} />

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 lowercase">
            phase
          </span>
          <div className="grid grid-cols-3 gap-2">
            {PHASES.map((p) => (
              <label
                key={p.value}
                className={`min-h-[44px] flex items-center justify-center px-3 border text-[10px] font-mono tracking-[0.15em] lowercase cursor-pointer transition-colors ${
                  phase === p.value
                    ? "bg-white text-[#0D0D0D] border-white"
                    : "border-hairline text-white/50 hover:border-white/30"
                }`}
              >
                <input
                  type="radio"
                  name="phase"
                  value={p.value}
                  checked={phase === p.value}
                  onChange={() => setPhase(p.value)}
                  className="sr-only"
                />
                {p.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">
              pre-order close date
            </label>
            <input
              type="date"
              name="preorderCloseDate"
              defaultValue={batch.preorderCloseDate}
              required
              className="bg-white/[0.03] border border-hairline px-3 py-3 text-sm text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">
              close date label (shown to customers)
            </label>
            <input
              type="text"
              name="closeDateLabel"
              defaultValue={batch.closeDateLabel}
              placeholder="aug 31"
              required
              maxLength={40}
              className="bg-white/[0.03] border border-hairline px-3 py-3 text-sm text-white lowercase focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">
              ship window start
            </label>
            <input
              type="date"
              name="shipWindowStart"
              defaultValue={batch.shipWindowStart}
              required
              className="bg-white/[0.03] border border-hairline px-3 py-3 text-sm text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">
              ship window end
            </label>
            <input
              type="date"
              name="shipWindowEnd"
              defaultValue={batch.shipWindowEnd}
              required
              className="bg-white/[0.03] border border-hairline px-3 py-3 text-sm text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">
              ship date label (shown to customers)
            </label>
            <input
              type="text"
              name="shipDateLabel"
              defaultValue={batch.shipDateLabel}
              placeholder="by sept 15"
              required
              maxLength={40}
              className="bg-white/[0.03] border border-hairline px-3 py-3 text-sm text-white lowercase focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">
              countdown target (iso timestamp — drives the homepage live
              countdown)
            </label>
            <input
              type="text"
              name="closeDateISO"
              defaultValue={batch.closeDateISO}
              placeholder="2026-08-31T23:59:59+02:00"
              required
              className="bg-white/[0.03] border border-hairline px-3 py-3 text-sm text-white font-mono focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">
              buffer stock units remaining
            </label>
            <input
              type="number"
              name="stockCount"
              min={0}
              defaultValue={batch.stockCount ?? 0}
              className="bg-white/[0.03] border border-hairline px-3 py-3 text-sm text-white tabular-nums focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {state.success === false && state.error && (
          <p className="font-mono text-[11px] text-white bg-white/[0.03] border border-white/20 px-3 py-2 lowercase">
            {state.error}
          </p>
        )}
        {state.success === true && (
          <p className="font-mono text-[11px] text-white/70 lowercase">
            batch updated. sitewide countdown and buy buttons are synced.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="min-h-[44px] w-full sm:w-auto self-start px-6 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 disabled:opacity-50 transition-colors"
        >
          {isPending ? "saving..." : "save & sync sitewide"}
        </button>
      </form>
    </div>
  );
}
