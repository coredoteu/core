export function BatchStatusCard({ data }: { data: any }) {
  if (!data || data.error) return null;
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return (
    <div className="border border-hairline bg-[#0A0A0A]/80 backdrop-blur-md w-full px-5 py-4 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 lowercase">
          batch {String(data.batchNumber).padStart(2, "0")} / {data.phase}
        </span>
        <span className="text-xs text-white/70 lowercase">
          ships {fmt(data.shipWindowStart)} – {fmt(data.shipWindowEnd)}
        </span>
      </div>
      {data.phase === "preorder" && (
        <span className="font-mono text-[9px] text-white/40 lowercase">closes {fmt(data.preorderCloseDate)}</span>
      )}
    </div>
  );
}
