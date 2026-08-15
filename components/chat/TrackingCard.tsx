import React from "react";

const STEPS = [
  { key: "label_created", label: "label created" },
  { key: "picked_up", label: "picked up" },
  { key: "in_transit", label: "in transit" },
  { key: "out_for_delivery", label: "out for delivery" },
  { key: "delivered", label: "delivered" },
] as const;

export function TrackingCard({ data }: { data: any }) {
  if (!data || data.error) return null;
  const stepIndex = STEPS.findIndex((s) => s.key === data.currentStatus);

  return (
    <div className="border border-hairline bg-[#0A0A0A]/80 backdrop-blur-md w-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline bg-white/[0.01]">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 lowercase">
          {data.carrier} / {data.trackingNumber}
        </span>
        <span className="font-mono text-[9px] tracking-[0.15em] text-white/60 lowercase border border-hairline px-2 py-1">
          {STEPS[stepIndex]?.label ?? "processing"}
        </span>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.key} className="flex-1 flex items-center last:flex-none">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <span className={`w-2.5 h-2.5 rounded-full ${i <= stepIndex ? "bg-white" : "bg-white/15"}`} />
                <span className="font-mono text-[8px] tracking-[0.1em] text-white/40 lowercase whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className={`h-px flex-1 mx-1 ${i < stepIndex ? "bg-white/60" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3.5 border-t border-hairline bg-white/[0.01]">
        <span className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">est. delivery</span>
        <span className="text-[12px] text-white tabular-nums">
          {new Date(data.estimatedDeliveryAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
      </div>

      <a
        href={data.trackingUrl}
        target="_blank"
        rel="noreferrer"
        className="block text-center py-3 text-[10px] font-mono tracking-[0.2em] text-white/60 hover:text-white border-t border-hairline lowercase transition-colors"
      >
        view on carrier site →
      </a>
    </div>
  );
}
