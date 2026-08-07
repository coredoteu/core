const tickerItems = [
  "refined to the core.",
  "98-99% natural origin",
  "zero synthetic compromises",
  "ph 4.5 - 5.5 equilibrium",
  "vegan / cruelty-free / nut-free",
  "engineered in the netherlands",
];

export default function Ticker() {
  return (
    <div className="relative border-b border-hairline bg-[#0D0D0D] overflow-hidden py-4">
      <style>{`
        @keyframes core-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee { animation: core-marquee 26s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
      <div className="flex w-max animate-marquee">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-8">
            <span className="text-xs tracking-[0.2em] text-text-muted lowercase whitespace-nowrap">
              {item}
            </span>
            <span className="text-text-dim">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
