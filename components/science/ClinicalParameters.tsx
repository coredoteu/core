"use client";

import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CLINICAL_SPECS, CORE_BADGES } from "@/lib/content";

export default function ClinicalParameters() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="mb-12 md:mb-16">
          <SectionHeader index="03" title="clinical parameters" variant="compact" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
          <div>
            <p className="text-sm text-white/70 lowercase leading-relaxed max-w-sm mb-10">
              our products are built within strict clinical parameters. this
              is the technical foundation of the v1 system. no compromises,
              no exceptions.
            </p>

            <div className="flex flex-col gap-4">
              {CLINICAL_SPECS.map((spec) => (
                <div
                  key={spec.key}
                  className="flex items-center justify-between pb-4 border-b border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Icon src={spec.icon} size={15} opacity={0.4} />
                    <span className="text-[11px] font-mono tracking-[0.1em] text-white/50 lowercase pt-0.5">
                      {spec.key}
                    </span>
                  </div>
                  <span className="text-sm text-white/90 lowercase">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-[#121212] border border-white/10 p-8 md:p-12 relative overflow-hidden h-full">
              <div className="relative z-10 flex flex-col gap-8">
                <span className="font-mono text-xs tracking-[0.2em] text-white/50 lowercase">
                  certifications & standards
                </span>
                
                <div className="grid grid-cols-2 gap-6">
                  {CORE_BADGES.map((badge) => (
                    <div key={badge.label} className="flex flex-col gap-3">
                      <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-black/20">
                        <Icon src={badge.icon} size={18} opacity={0.7} />
                      </div>
                      <span className="text-xs text-white/60 lowercase max-w-[100px]">
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
