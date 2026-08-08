"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductPageData } from "@/lib/products";

const STEP_ICONS: Record<string, { shampoo: string; conditioner: string }> = {
  "01": {
    shampoo: "/icons/soap-dispenser-droplet.svg",
    conditioner: "/icons/dropper-minimalistic.svg",
  },
  "02": { shampoo: "/icons/bubbles.svg", conditioner: "/icons/waterdrop.svg" },
  "03": { shampoo: "/icons/wind.svg", conditioner: "/icons/droplet.svg" },
};

export default function UsageSection({
  product,
}: {
  product: ProductPageData;
}) {
  const isConditioner = product.id === "conditioner-290";

  return (
    <section className="border-t border-hairline py-20 md:py-32 bg-white/[0.015]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="mb-10 md:mb-14">
          <SectionHeader
            index="02"
            title="system usage"
            icon="/icons/layers-minimalistic.svg"
            variant="compact"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {product.usageSteps.map((step, i) => {
            const iconMap = STEP_ICONS[step.index];
            const icon = iconMap
              ? isConditioner
                ? iconMap.conditioner
                : iconMap.shampoo
              : "/icons/flask-conical.svg";

            return (
              <motion.div
                key={step.index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`flex flex-col gap-6 p-8 md:p-10 relative ${
                  i < product.usageSteps.length - 1
                    ? "border-b md:border-b-0 md:border-r border-hairline"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-4xl font-extralight text-white/10 tabular-nums leading-none">
                    {step.index}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <div className="w-9 h-9 border border-hairline flex items-center justify-center shrink-0">
                    <Icon src={icon} size={16} opacity={0.3} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl md:text-3xl font-light lowercase text-white tracking-tight">
                    {step.label}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 border border-hairline p-5 flex items-start gap-4">
          <Icon
            src="/icons/flask-conical.svg"
            size={16}
            opacity={0.2}
            className="mt-0.5"
          />
          <p className="text-xs text-text-muted lowercase leading-relaxed">
            for best results: use as a complete duo system. the shampoo opens
            and cleanses. the conditioner seals and nourishes. engineered to
            work in sequence.
          </p>
        </div>
      </div>
    </section>
  );
}
