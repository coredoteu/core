import Link from "next/link";
import { CATALOG } from "@/lib/catalog";

export function ReturnEligibilityCard({ data }: { data: any }) {
  if (!data || data.error) return null;
  const progress = Math.min(100, (data.daysSince / 30) * 100);

  const statusLabel = !data.isDelivered
    ? "not delivered yet"
    : data.withinWindow
    ? `${data.daysRemaining}d remaining`
    : "window closed";

  return (
    <div className="border border-hairline bg-[#0A0A0A]/80 backdrop-blur-md w-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline bg-white/[0.01]">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 lowercase">
          order / #{data.orderRef}
        </span>
        <span className={`font-mono text-[9px] tracking-[0.2em] px-2 py-1 border lowercase ${
          data.eligible ? "border-white/30 text-white" : "border-white/10 text-white/30"
        }`}>
          {statusLabel}
        </span>
      </div>

      <div className="px-5 py-4">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white/60" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="divide-y divide-hairline">
        {data.items.map((item: any, i: number) => {
          const product = CATALOG.find((p) => p.id === item.productId);
          const eligible = data.isDelivered && data.withinWindow && !item.alreadyClaimed;
          return (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <span className="text-xs text-white/80 lowercase">{product?.name ?? item.productId}</span>
              <span className={`font-mono text-[9px] tracking-[0.1em] lowercase ${eligible ? "text-white/70" : "text-white/25"}`}>
                {eligible ? "eligible" : !data.isDelivered ? "pending delivery" : item.alreadyClaimed ? "already claimed" : "expired"}
              </span>
            </div>
          );
        })}
      </div>

      {data.eligible ? (
        <Link
          href={`/refunds?order=${data.orderRef}`}
          className="block text-center py-3.5 bg-white text-black text-[10px] font-mono tracking-[0.2em] lowercase hover:bg-white/90 transition-colors"
        >
          start return
        </Link>
      ) : (
        <div className="px-5 py-3.5 text-center text-[10px] font-mono text-white/30 lowercase">
          {!data.isDelivered
            ? "returns open upon package delivery"
            : "no eligible items on this order"}
        </div>
      )}
    </div>
  );
}
