"use client";
import { Button } from "@/components/ui/Button";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import ActiveCompoundIndex from "@/components/science/ActiveCompoundIndex";
import ClinicalParameters from "@/components/science/ClinicalParameters";
import ScienceFAQ from "@/components/science/ScienceFAQ";

export default function ScienceContent() {
  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-text-muted pb-8 md:pb-14 border-b border-hairline">
            <span>CORE. {"//"} formulation index</span>
            <span className="hidden sm:inline">technical hair care.</span>
            <span>ph 4.5 {"//"} 5.5</span>
          </div>

          <div className="pt-12 md:pt-16 flex flex-col gap-6 max-w-3xl">
            <span className="font-mono text-xs tracking-[0.2em] text-text-muted">
              01 {"//"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight lowercase text-white">
              the science behind
              <br />
              the system.
            </h1>
            <p className="text-text-muted text-sm sm:text-base md:text-lg leading-relaxed lowercase max-w-xl">
              every active declared at a functional concentration. no
              proprietary blends. no filler claims. this is the formulation
              index for the CORE. system.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button href="/shop" variant="solid">
              shop the duo
            </Button>
            <a
              href="#actives"
              className="flex items-center justify-center px-8 py-4 border border-white/20 text-sm tracking-[0.2em] lowercase text-text-muted hover:text-white hover:border-white/40 active:scale-[0.98] transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 focus-visible:outline-offset-2"
            >
              view the compound index
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="mb-10 md:mb-14">
            <SectionHeader
              index="02"
              title="formulation philosophy"
              variant="compact"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10 border border-hairline">
            {[
              {
                icon: "/icons/test-tube-minimalistic.svg",
                title: "functional concentration",
                desc: "every active sits in the formula at a level that actually does something. nothing is there for the label.",
              },
              {
                icon: "/icons/scan.svg",
                title: "no proprietary blends",
                desc: "no hidden fragrance houses or catch-all blend names. every ingredient is declared on its own line.",
              },
              {
                icon: "/icons/activity.svg",
                title: "ph equilibrium",
                desc: "formulated inside the scalp's natural 4.5 to 5.5 range, so the barrier is supported, not stripped.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-[#0D0D0D] p-8 md:p-10 flex flex-col gap-5"
              >
                <div className="w-9 h-9 border border-white/[0.1] flex items-center justify-center">
                  <Icon src={card.icon} size={15} opacity={0.5} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-light lowercase text-white/90">
                    {card.title}
                  </h3>
                  <p className="text-sm text-text-muted lowercase leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <ActiveCompoundIndex />

      {}
      <ClinicalParameters />

      {}
      <ScienceFAQ />

      <section className="border-t border-hairline">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight lowercase max-w-lg">
              formulation you can read start to finish.
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Button href="/shop" variant="solid">
                shop the system
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
