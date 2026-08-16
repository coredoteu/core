"use client";

import { useCallback, useEffect, useState } from "react";
import { getBackerLedger, BackerLedgerEntry } from "@/app/actions/backers";

const REFRESH_MS = 25000;

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function LedgerRow({
  entry,
  isNew,
}: {
  entry: BackerLedgerEntry;
  isNew: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 px-4 sm:px-6 py-2.5 border-b border-hairline last:border-b-0 font-mono text-[10px] sm:text-[11px] text-text-muted transition-colors duration-700 ${
        isNew ? "bg-white/[0.04]" : ""
      }`}
    >
      <span className="text-white/30">▸</span>
      <span className="text-text-dim">[{formatTime(entry.createdAt)}]</span>
      <span className="text-text-dim">//</span>
      <span className="text-white/80">
        founder #{String(entry.founderNumber).padStart(3, "0")}
      </span>
      <span className="text-text-dim">·</span>
      <span className="text-white/60">{entry.country.toUpperCase()}</span>
      <span className="text-text-dim">·</span>
      <span className="text-white/60 lowercase">
        backed {entry.productLabel}
      </span>
      <span className="text-text-dim">·</span>
      <span className="text-white/80 tabular-nums lowercase">
        +€{entry.v2FundedAmount.toFixed(2)} to v2 tooling
      </span>
    </div>
  );
}

export default function BackerLedger() {
  const [entries, setEntries] = useState<BackerLedgerEntry[]>([]);
  const [latestKey, setLatestKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getBackerLedger(10);
    setEntries((prev) => {
      const prevTop = prev[0]
        ? `${prev[0].createdAt}-${prev[0].founderNumber}`
        : null;
      const nextTop = data[0]
        ? `${data[0].createdAt}-${data[0].founderNumber}`
        : null;
      if (nextTop && nextTop !== prevTop) setLatestKey(nextTop);
      return data;
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  if (!loading && entries.length === 0) return null;

  return (
    <div className="mt-6 border border-hairline bg-[#0D0D0D]">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-hairline bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-text-muted lowercase">
            live backer registry
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.15em] text-text-dim lowercase hidden sm:inline">
          anonymized / country only
        </span>
      </div>

      {loading ? (
        <div className="px-4 sm:px-6 py-6 flex flex-col gap-2.5 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 bg-white/[0.04] w-3/4" />
          ))}
        </div>
      ) : (
        <div className="max-h-[280px] overflow-y-auto overscroll-contain">
          {entries.map((entry) => {
            const key = `${entry.createdAt}-${entry.founderNumber}`;
            return (
              <LedgerRow key={key} entry={entry} isNew={key === latestKey} />
            );
          })}
        </div>
      )}
    </div>
  );
}
