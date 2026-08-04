"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductPageData } from "@/lib/products";

const ACTIVE_ICONS: Record<string, string> = {
  "aloe vera juice":              "/icons/droplet.svg",
  "sea kale extract":             "/icons/waves-horizontal.svg",
  "ginkgo biloba leaf extract":   "/icons/activity.svg",
  "burdock root extract":         "/icons/waterdrops.svg",
  "hydrolyzed wheat protein":     "/icons/wheat.svg",
  "argan oil":                    "/icons/droplets.svg",
};

export default function FormulationSection({ product }: { product: ProductPageData }) {
  return (
    <section className="border-t border-white/10 py-20 md:py-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="mb-10 md:mb-14">
          <SectionHeader index="01" title="formulation" icon="/icons/flask-conical.svg" variant="compact" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Icon src="/icons/test-tube-minimalistic.svg" size={14} opacity={0.25} />
                <h2 className="text-2xl md:text-3xl font-light lowercase text-white/80 leading-snug">
                  key actives
                </h2>
              </div>
              <p className="text-sm text-white/60 lowercase leading-relaxed">
                every active is declared at a functional concentration. no filler
                claims. no proprietary blends hiding a half-percent trace.
              </p>
            </div>

            <div className="flex flex-col gap-0 border border-white/[0.06]">
              {product.claims.map((claim, i) => (
                <div
                  key={claim}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i < product.claims.length - 1 ? "border-b border-white/[0.05]" : ""
                  }`}
                >
                  <Icon src="/icons/check-circle.svg" size={12} opacity={0.2} />
                  <span className="text-xs text-white/60 lowercase">{claim}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-0">
            {product.actives.map((active, i) => {
              const icon = ACTIVE_ICONS[active.name] || "/icons/flask-round.svg";
              return (
                <motion.div
                  key={active.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-8 ${
                    i < product.actives.length - 1 ? "border-b border-white/[0.06]" : ""
                  }`}
                >
                  <div className="flex flex-col items-center pt-1 gap-2">
                    <div className="w-8 h-8 border border-white/[0.08] flex items-center justify-center shrink-0">
                      <Icon src={icon} size={14} opacity={0.35} />
                    </div>
                    {i < product.actives.length - 1 && (
                      <div className="flex-1 w-px bg-white/[0.06] min-h-[24px]" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base md:text-lg font-light text-white/90 lowercase tracking-tight">
                        {active.name}
                      </span>
                      <span className="font-mono text-[10px] text-white/15 tabular-nums shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 lowercase leading-relaxed max-w-sm">
                      {active.benefit}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
