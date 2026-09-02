import type { FinancialSummary } from "@/lib/admin-data";

function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="border border-hairline p-5 flex flex-col gap-2">
      <span className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">
        {label}
      </span>
      <span className="text-2xl font-light text-white tabular-nums">
        {value}
      </span>
      {sub && (
        <span className="font-mono text-[10px] text-white/30 lowercase">
          {sub}
        </span>
      )}
    </div>
  );
}

export default function FinancialsPanel({
  financials,
  compact = false,
}: {
  financials: FinancialSummary;
  compact?: boolean;
}) {
  const f = financials;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="gross revenue"
          value={`€${f.grossRevenue.toFixed(2)}`}
          sub={`${f.orderCount} paid orders`}
        />
        <KpiCard label="net profit" value={`€${f.netProfit.toFixed(2)}`} />
        <KpiCard
          label="v2 funding"
          value={`€${f.v2Funded.toFixed(2)}`}
          sub={`${f.v2Percentage.toFixed(1)}% of €${f.v2Target.toLocaleString()}`}
        />
        <KpiCard
          label="manufacturing tier"
          value={`tier ${f.activeTierIndex} / 5`}
          sub={`${f.totalDuoCount} duo units produced`}
        />
      </div>

      {!compact && (
        <div className="border border-hairline">
          <div className="px-6 py-4 border-b border-hairline bg-white/[0.02]">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 lowercase">
              cogs breakdown / paid, non-refunded orders
            </span>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {[
              { label: "selfnamed manufacturing cogs (total)", value: f.productCogs },
              { label: "packaging cogs (€2.62 / order)", value: f.packagingCogs },
              { label: "sendcloud shipping cogs (total)", value: f.totalShippingCogs },
              { label: "stripe processing fees (total)", value: f.stripeFees },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-6 py-4"
              >
                <span className="text-xs text-white/60 lowercase">
                  {row.label}
                </span>
                <span className="font-mono text-sm text-white tabular-nums">
                  €{row.value.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02]">
              <span className="text-xs text-white/80 lowercase">
                avg. shipping cogs / order
              </span>
              <span className="font-mono text-sm text-white tabular-nums">
                €{f.avgShippingCogs.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
