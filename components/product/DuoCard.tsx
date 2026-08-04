import Image from "next/image";
import ShopAddToCart from "@/components/product/ShopAddToCart";
import { getCatalogProduct } from "@/lib/catalog";

export default function DuoCard() {
  const duoProduct = getCatalogProduct("duo-system-001");

  return (
    <div className="border border-white/20 bg-white/[0.02] p-8 md:p-10 relative flex flex-col lg:flex-row gap-10 group">
      <span className="absolute -top-px left-8 -translate-y-1/2 bg-[#0D0D0D] px-3 text-[10px] font-mono tracking-[0.25em] text-white lowercase">
        system 001 / bundle
      </span>

      {/* Duo image group */}
      <div className="flex items-center justify-center lg:w-[280px] shrink-0">
        <div className="relative flex items-end justify-center gap-4 h-[260px] w-full max-w-[260px]">
          <div className="relative w-[45%] h-full">
            <Image
              src="/images/shampoo-front.png"
              alt="CORE. daily balancing shampoo"
              fill
              className="object-contain transition-transform duration-700 group-hover:translate-y-[-4px]"
              sizes="130px"
            />
          </div>
          <div className="flex items-center self-center mb-4">
            <span
              className="text-white/60 font-extralight leading-none"
              style={{ fontSize: "1.2rem" }}
              aria-hidden="true"
            >
              +
            </span>
          </div>
          <div className="relative w-[45%] h-full">
            <Image
              src="/images/conditioner-front.png"
              alt="CORE. daily nourishing conditioner"
              fill
              className="object-contain transition-transform duration-700 group-hover:translate-y-[4px]"
              sizes="130px"
            />
          </div>
        </div>
      </div>

      {/* Duo info */}
      <div className="flex flex-col flex-1 gap-6 justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
            system 001
          </span>
          <h3 className="text-2xl md:text-3xl font-light text-white lowercase leading-snug">
            <span className="font-normal uppercase">CORE.</span> the duo
          </h3>
          <p className="text-sm text-white/60 lowercase leading-relaxed">
            shampoo + conditioner. the complete daily system.
            engineered to work in sequence - cleanse, then seal.
          </p>

          {/* spec pills */}
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              "2 × 290 ml",
              "ph 4.5 - 5.5",
              "ecocert cosmos natural",
              "eu engineered",
            ].map((tag) => (
              <span
                key={tag}
                className="border border-white/10 px-3 py-1 text-[10px] font-mono tracking-[0.15em] text-white/60 lowercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Included items list */}
        <div className="flex flex-col gap-0 border border-white/[0.07]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-white/70 lowercase">daily balancing shampoo</span>
              <span className="text-[10px] font-mono text-white/60">unit 01 / 290ml</span>
            </div>
            <span className="text-xs text-white/60 font-mono">€28.00</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-white/70 lowercase">daily nourishing conditioner</span>
              <span className="text-[10px] font-mono text-white/60">unit 02 / 290ml</span>
            </div>
            <span className="text-xs text-white/60 font-mono">€28.00</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-light text-white">€44.95</span>
            <span className="text-sm text-white/60 line-through">€56.00</span>
            <span className="text-xs font-mono text-white/60 lowercase border border-white/10 px-2 py-0.5">
              save €11.05
            </span>
          </div>
          <ShopAddToCart product={duoProduct} label="add the duo" />
        </div>
      </div>
    </div>
  );
}
