"use client";

import Image from "next/image";
import BatchCartSection from "@/components/product/BatchCartSection";
import { getCatalogProduct } from "@/lib/catalog";

export default function DuoCard({
  isHighlighted = false,
}: {
  isHighlighted?: boolean;
}) {
  const duoProduct = getCatalogProduct("duo-system-001");

  return (
    <div
      className={`border border-white/20 p-8 md:p-10 relative flex flex-col lg:flex-row gap-10 group transition-colors duration-500 ${isHighlighted ? "bg-white/[0.04]" : "bg-white/[0.02]"}`}
    >
      {isHighlighted && (
        <span className="absolute -top-px right-8 -translate-y-1/2 bg-[#0D0D0D] px-3 text-[10px] font-mono tracking-[0.25em] text-text-muted lowercase z-10 border border-hairline">
          recommended
        </span>
      )}
      <span className="absolute -top-px left-8 -translate-y-1/2 bg-[#0D0D0D] px-3 text-[10px] font-mono tracking-[0.25em] text-white lowercase z-10">
        system 001 / bundle
      </span>

      {}
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
              className="text-text-muted font-extralight leading-none"
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

      {}
      <div className="flex flex-col flex-1 gap-6 justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] text-text-muted lowercase">
              system 001
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-light text-white lowercase leading-snug">
            <span className="font-normal uppercase">CORE.</span> the duo
          </h3>
          <p className="text-sm text-text-muted lowercase leading-relaxed">
            shampoo + conditioner. the complete daily system. engineered to work
            in sequence - cleanse, then seal.
          </p>

          {}
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              "2 × 290 ml",
              "ph 4.5 - 5.5",
              "ecocert cosmos natural",
              "eu engineered",
            ].map((tag) => (
              <span
                key={tag}
                className="border border-hairline px-3 py-1 text-[10px] font-mono tracking-[0.15em] text-text-muted lowercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {}
        <div className="flex flex-col gap-0 border border-hairline">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-text-muted lowercase">
                daily balancing shampoo
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                unit 01 / 290ml
              </span>
            </div>
            <span className="text-xs text-text-muted font-mono">€28.00</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-text-muted lowercase">
                daily nourishing conditioner
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                unit 02 / 290ml
              </span>
            </div>
            <span className="text-xs text-text-muted font-mono">€28.00</span>
          </div>
        </div>

        {}
        <BatchCartSection productId={duoProduct.id} product={duoProduct} />
      </div>
    </div>
  );
}
