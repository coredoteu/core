"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CORE_ACTIVES, Unit } from "@/lib/content";

export default function ActiveCompoundIndex() {
  const [filter, setFilter] = useState<"all" | Unit>("all");

  const visibleActives = CORE_ACTIVES.filter(
    (a) => filter === "all" || a.units.includes(filter),
  );

  return (
    <section
      id="actives"
      className="border-t border-hairline py-16 md:py-24 bg-white/[0.015] scroll-mt-24"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="mb-10 md:mb-14">
          <SectionHeader
            index="03"
            title="active compound index"
            variant="compact"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <p className="text-sm text-text-muted lowercase leading-relaxed max-w-md">
            six core actives, shared and split across the duo system. filter by
            unit to see exactly what is in each formula.
          </p>

          <div className="flex items-center border border-hairline p-1 w-full sm:w-auto overflow-x-auto">
            {(["all", "shampoo", "conditioner"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                aria-pressed={filter === tab}
                className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] lowercase transition-all duration-300 whitespace-nowrap focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 ${
                  filter === tab
                    ? "bg-white text-background"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {tab === "all" ? "all actives" : `unit / ${tab}`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-hairline">
          <AnimatePresence mode="popLayout">
            {visibleActives.map((active) => (
              <motion.div
                key={active.code}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-background p-6 md:p-8 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-8 h-8 border border-hairline flex items-center justify-center shrink-0">
                    <Icon src={active.icon} size={13} opacity={0.4} />
                  </div>
                  <span className="font-mono text-[10px] text-text-muted lowercase pt-1.5">
                    {active.code}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-sm text-white/90 lowercase tracking-wide leading-snug">
                    {active.name}
                  </h3>
                  <p className="text-xs text-text-muted lowercase leading-relaxed">
                    {active.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-1">
                  {active.organic && (
                    <span className="text-[9px] font-mono tracking-[0.1em] text-text-muted border border-hairline px-2 py-1 lowercase">
                      organically farmed
                    </span>
                  )}
                  {active.units.map((u) => (
                    <span
                      key={u}
                      className="text-[9px] font-mono tracking-[0.1em] text-text-muted border border-hairline px-2 py-1 lowercase"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
