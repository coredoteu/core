"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function Icon({
  src,
  size = 16,
  opacity = 0.4,
  className = "",
}: {
  src: string;
  size?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        opacity,
        filter: "brightness(0) invert(1)",
        flexShrink: 0,
      }}
    />
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 md:gap-4 mb-10 md:mb-14">
      <span className="font-mono text-[11px] md:text-xs tracking-[0.25em] text-white/60 shrink-0">
        {index} {"//"}
      </span>
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-[11px] font-mono tracking-[0.25em] text-white/60 lowercase shrink-0">
        {title}
      </span>
    </div>
  );
}

type Unit = "shampoo" | "conditioner";

type Active = {
  code: string;
  name: string;
  desc: string;
  icon: string;
  organic: boolean;
  units: Unit[];
};

const actives: Active[] = [
  {
    code: "act.01",
    name: "aloe barbadensis leaf juice",
    desc: "hydration delivery system. binds moisture into the scalp and cortex layer.",
    icon: "/icons/droplet.svg",
    organic: true,
    units: ["shampoo", "conditioner"],
  },
  {
    code: "act.02",
    name: "crambe maritima (sea kale) leaf extract",
    desc: "marine mineral fortification. supports scalp equilibrium and strand structure.",
    icon: "/icons/waves-horizontal.svg",
    organic: false,
    units: ["shampoo", "conditioner"],
  },
  {
    code: "act.03",
    name: "ginkgo biloba leaf extract",
    desc: "circulatory activator. antioxidant defense at the follicle.",
    icon: "/icons/activity.svg",
    organic: true,
    units: ["shampoo", "conditioner"],
  },
  {
    code: "act.04",
    name: "arctium lappa (burdock) root extract",
    desc: "sebum regulation. root-level strength between washes.",
    icon: "/icons/waterdrops.svg",
    organic: true,
    units: ["shampoo", "conditioner"],
  },
  {
    code: "act.05",
    name: "hydrolyzed wheat protein",
    desc: "structural repair. fills micro-damage along the strand surface.",
    icon: "/icons/wheat.svg",
    organic: false,
    units: ["conditioner"],
  },
  {
    code: "act.06",
    name: "argania spinosa (argan) kernel oil",
    desc: "lipid restoration. seals the cuticle for shine without weight.",
    icon: "/icons/droplets.svg",
    organic: true,
    units: ["conditioner"],
  },
];

const clinicalSpecs = [
  { icon: "/icons/flask-conical.svg",   key: "ph range",            value: "4.5 - 5.5" },
  { icon: "/icons/leaf.svg",            key: "natural origin",      value: "98 - 99%" },
  { icon: "/icons/ban.svg",             key: "silicones",           value: "0" },
  { icon: "/icons/ban.svg",             key: "sulfates (sls)",      value: "0" },
  { icon: "/icons/medal-star.svg",      key: "organic-farmed actives", value: "4 / 6" },
  { icon: "/icons/map-pin-check.svg",   key: "formulated",          value: "netherlands / eu" },
  { icon: "/icons/scan.svg",            key: "inci standard",       value: "eu 1223/2009" },
  { icon: "/icons/microscope.svg",      key: "batch validation",    value: "per production run" },
];

const badges = [
  { icon: "/icons/vegan.svg",        label: "vegan" },
  { icon: "/icons/badge-check.svg",  label: "cruelty-free" },
  { icon: "/icons/ban.svg",          label: "nut-free" },
  { icon: "/icons/ban.svg",          label: "gluten-free" },
  { icon: "/icons/ban.svg",          label: "silicone-free" },
  { icon: "/icons/leaf.svg",         label: "ecocert cosmos natural" },
];

const faqs = [
  {
    q: "why declare an exact ph range?",
    a: "hair and scalp sit naturally around ph 4.5 to 5.5. we formulate inside that range so the system supports the barrier instead of stripping it. most mainstream shampoos sit closer to ph 7 or higher.",
  },
  {
    q: "what does 'organically farmed' mean on the label?",
    a: "four of our six core actives, aloe, ginkgo biloba, burdock root and argan oil, are sourced from certified organic farming. it is marked on every inci list with a dedicated symbol.",
  },
  {
    q: "how is each batch validated?",
    a: "every production run is checked for ph, viscosity and raw material traceability before it clears for bottling. nothing ships without a pass.",
  },
  {
    q: "why only six core actives?",
    a: "each one is declared at a functional concentration. we do not pad the formula with filler actives at trace percentages just to lengthen a label.",
  },
];

export default function ScienceContent() {
  const [filter, setFilter] = useState<"all" | Unit>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const visibleActives = actives.filter(
    (a) => filter === "all" || a.units.includes(filter)
  );

  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-white/60 pb-8 md:pb-14 border-b border-white/10">
            <span>CORE. {"//"}  formulation index</span>
            <span className="hidden sm:inline">technical hair care.</span>
            <span>ph 4.5 {"//"}  5.5</span>
          </div>

          <div className="pt-12 md:pt-16 flex flex-col gap-6 max-w-3xl">
            <span className="font-mono text-xs tracking-[0.2em] text-white/60">
              01 {"//"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight lowercase text-white">
              the science behind
              <br />
              the system.
            </h1>
            <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed lowercase max-w-xl">
              every active declared at a functional concentration. no
              proprietary blends. no filler claims. this is the formulation
              index for the CORE. system.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/shop"
              className="flex items-center justify-center px-8 py-4 border border-white bg-white text-[#0D0D0D] text-sm tracking-[0.2em] lowercase hover:bg-transparent hover:text-white active:scale-[0.98] transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              [ shop the duo ]
            </Link>
            <a
              href="#actives"
              className="flex items-center justify-center px-8 py-4 border border-white/20 text-sm tracking-[0.2em] lowercase text-white/60 hover:text-white hover:border-white/40 active:scale-[0.98] transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 focus-visible:outline-offset-2"
            >
              [ view the compound index ]
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <SectionLabel index="01" title="formulation philosophy" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
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
              <div key={card.title} className="bg-[#0D0D0D] p-8 md:p-10 flex flex-col gap-5">
                <div className="w-9 h-9 border border-white/[0.1] flex items-center justify-center">
                  <Icon src={card.icon} size={15} opacity={0.5} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-light lowercase text-white/90">{card.title}</h3>
                  <p className="text-sm text-white/60 lowercase leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="actives" className="border-t border-white/10 py-16 md:py-24 bg-white/[0.015] scroll-mt-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <SectionLabel index="02" title="active compound index" />

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <p className="text-sm text-white/60 lowercase leading-relaxed max-w-md">
              six core actives, shared and split across the duo system. filter
              by unit to see exactly what is in each formula.
            </p>

            <div className="flex items-center border border-white/10 p-1 w-full sm:w-auto overflow-x-auto">
              {(["all", "shampoo", "conditioner"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  aria-pressed={filter === tab}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] lowercase transition-all duration-300 whitespace-nowrap focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 ${
                    filter === tab
                      ? "bg-white text-[#0D0D0D]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab === "all" ? "all actives" : `unit / ${tab}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
            <AnimatePresence mode="popLayout">
              {visibleActives.map((active) => (
                <motion.div
                  key={active.code}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#0D0D0D] p-6 md:p-8 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-8 h-8 border border-white/[0.08] flex items-center justify-center shrink-0">
                      <Icon src={active.icon} size={13} opacity={0.4} />
                    </div>
                    <span className="font-mono text-[10px] text-white/60 lowercase pt-1.5">
                      {active.code}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm text-white/90 uppercase tracking-wide leading-snug">
                      {active.name}
                    </h3>
                    <p className="text-xs text-white/60 lowercase leading-relaxed">
                      {active.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {active.organic && (
                      <span className="text-[9px] font-mono tracking-[0.1em] text-white/60 border border-white/10 px-2 py-1 lowercase">
                        organically farmed
                      </span>
                    )}
                    {active.units.map((u) => (
                      <span
                        key={u}
                        className="text-[9px] font-mono tracking-[0.1em] text-white/60 border border-white/[0.06] px-2 py-1 lowercase"
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

      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <SectionLabel index="03" title="clinical parameters" />

          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/10">
            {clinicalSpecs.map((s) => (
              <div key={s.key} className="border-r border-b border-white/10 p-5 md:p-6 flex flex-col gap-3">
                <Icon src={s.icon} size={15} opacity={0.5} />
                <span className="text-[10px] font-mono tracking-[0.15em] text-white/60 lowercase">{s.key}</span>
                <span className="text-sm text-white/80 lowercase">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 lowercase">
              certifications & claims
            </span>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className="flex items-center gap-2 border border-white/15 px-3 py-1.5 text-[11px] font-mono tracking-[0.15em] text-white/60 lowercase"
                >
                  <Icon src={b.icon} size={13} opacity={0.6} />
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 md:py-24 bg-white/[0.015]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <SectionLabel index="04" title="faq" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-24 items-start">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-light lowercase text-white/80 leading-snug">
                formulation questions
              </h2>
              <p className="text-sm text-white/60 lowercase leading-relaxed">
                direct answers. no filler copy.
              </p>
            </div>

            <div className="flex flex-col border border-white/[0.06]">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={i < faqs.length - 1 ? "border-b border-white/[0.06]" : ""}
                >
                  <button
                    id={`science-faq-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left group hover:bg-white/[0.02] transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/30 focus-visible:outline-offset-[-2px]"
                  >
                    <span className="text-sm text-white/70 lowercase leading-snug group-hover:text-white transition-colors duration-200 pr-4">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
                    >
                      <Icon src="/icons/chevron-down.svg" size={14} opacity={0.3} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 md:px-6 pb-5 text-sm text-white/60 lowercase leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight lowercase max-w-lg">
              formulation you can read start to finish.
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Link
                href="/shop"
                className="flex items-center justify-center px-8 py-4 border border-white bg-white text-[#0D0D0D] text-sm tracking-[0.2em] lowercase hover:bg-transparent hover:text-white transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                [ shop the system ]
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
