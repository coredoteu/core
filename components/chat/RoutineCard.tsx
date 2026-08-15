import { CATALOG } from "@/lib/catalog";

export function RoutineCard({ data }: { data: any }) {
  if (!data) return null;
  const product = (id: string) => CATALOG.find((p) => p.id === id);

  return (
    <div className="border border-hairline bg-[#0A0A0A]/80 backdrop-blur-md w-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline bg-white/[0.01]">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 lowercase">
          routine / {data.hairType} · {data.scalpCondition}
        </span>
        <span className="font-mono text-[9px] text-white/50 lowercase">{data.washesPerWeek}x / week</span>
      </div>

      <div className="divide-y divide-hairline">
        {data.steps.map((step: any) => (
          <div key={step.order} className="flex items-start gap-4 px-5 py-3.5">
            <span className="font-mono text-[9px] text-white/25 tabular-nums pt-0.5 shrink-0">0{step.order}</span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-white/85 lowercase">
                {step.action}{" "}
                <span className="text-white/35 font-mono text-[9px] ml-1">· {product(step.product)?.unit}</span>
              </span>
              <span className="text-[11px] text-white/45 lowercase leading-relaxed">{step.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {data.notes?.length > 0 && (
        <div className="px-5 py-3.5 border-t border-hairline bg-white/[0.015] flex flex-col gap-1.5">
          {data.notes.map((note: string, i: number) => (
            <p key={i} className="text-[10px] text-white/40 lowercase leading-relaxed">· {note}</p>
          ))}
        </div>
      )}
    </div>
  );
}
