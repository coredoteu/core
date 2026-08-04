import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductPageData } from "@/lib/products";

export default function TechnicalSpecsSection({ product }: { product: ProductPageData }) {
  const inciIngredients = product.inci.split(", ");

  const specRows = [
    { icon: "/icons/scan.svg",                key: "INCI STANDARD",  value: "eu cosmetics regulation 1223/2009" },
    { icon: "/icons/layers-minimalistic.svg", key: "VOLUME",         value: product.size },
    { icon: "/icons/activity.svg",            key: "PH RANGE",       value: "4.5 - 5.5" },
    { icon: "/icons/leaf.svg",                key: "NATURAL ORIGIN",  value: product.naturalOrigin },
    { icon: "/icons/map-pin-check.svg",       key: "ORIGIN",         value: "netherlands / eu" },
    { icon: "/icons/medal-star.svg",          key: "CERTIFICATION",  value: "ecocert cosmos natural" },
  ];

  return (
    <section className="border-t border-white/10 py-20 md:py-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="mb-10 md:mb-14">
          <SectionHeader index="03" title="technical specs" icon="/icons/scan.svg" variant="compact" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-0 border border-white/[0.08]">
              {specRows.map((spec, i) => (
                <div
                  key={spec.key}
                  className={`flex items-start gap-4 px-5 py-4 ${
                    i < specRows.length - 1 ? "border-b border-white/[0.06]" : ""
                  }`}
                >
                  <Icon src={spec.icon} size={12} opacity={0.2} className="mt-[3px]" />
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                      {spec.key}
                    </span>
                    <span className="text-sm text-white/60 lowercase">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-white/[0.06] p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon src="/icons/wind.svg" size={12} opacity={0.2} />
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                  SCENT PROFILE
                </span>
              </div>
              <p className="text-sm text-white/60 lowercase">{product.scent}</p>
              <p className="text-xs text-white/60 lowercase leading-relaxed mt-1">
                phthalate-free. 100% natural raw material fragrance composition.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon src="/icons/microscope.svg" size={14} opacity={0.25} />
                <h3 className="text-lg font-light text-white/80 lowercase">
                  inci ingredient declaration
                </h3>
              </div>
              <p className="text-xs text-white/60 lowercase leading-relaxed">
                full transparency. listed highest to lowest concentration per eu
                cosmetics regulation.
              </p>
            </div>

            <div className="border border-white/[0.08]">
              <div className="grid grid-cols-[auto_1fr] border-b border-white/[0.08] px-5 py-3 bg-white/[0.02]">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 w-10">#</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60">INGREDIENT</span>
              </div>

              {inciIngredients.map((ing, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[auto_1fr] items-start gap-4 px-5 py-3 hover:bg-white/[0.015] transition-colors duration-200 ${
                    i < inciIngredients.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  <span className="font-mono text-[10px] text-white/15 tabular-nums w-10 pt-px">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-white/60 leading-relaxed">
                    {ing.trim()}
                  </span>
                </div>
              ))}

              <div className="px-5 py-3 border-t border-white/[0.08] bg-white/[0.02] flex items-center gap-2">
                <Icon src="/icons/info-circle.svg" size={11} opacity={0.2} />
                <p className="font-mono text-[10px] tracking-[0.1em] text-white/60 lowercase">
                  {product.inciNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
