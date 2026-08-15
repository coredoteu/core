"use client";
import { Button } from "@/components/ui/Button";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

type StatusTone = "live" | "dev" | "prototype" | "research";

type SpecItem = { code: string; name: string; desc: string };

function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  const styles: Record<
    StatusTone,
    { border: string; text: string; dot: string }
  > = {
    live: { border: "border-white/30", text: "text-white", dot: "bg-white" },
    dev: {
      border: "border-white/20",
      text: "text-text-muted",
      dot: "bg-white/60",
    },
    prototype: {
      border: "border-hairline",
      text: "text-white/55",
      dot: "bg-white/40",
    },
    research: {
      border: "border-hairline",
      text: "text-text-faint",
      dot: "bg-white/20",
    },
  };
  const s = styles[tone];
  return (
    <span
      className={`inline-flex items-center gap-2 border ${s.border} px-3 py-1 font-mono text-[10px] tracking-[0.2em] lowercase ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-[50%] ${s.dot}`} />
      {label}
    </span>
  );
}

function SpecGroup({ label, items }: { label: string; items: SpecItem[] }) {
  return (
    <div className="border border-hairline">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline bg-white/[0.02]">
        <span className="font-mono text-[10px] tracking-[0.2em] text-text-faint lowercase">
          {label}
        </span>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {items.map((item) => (
          <div key={item.code} className="flex flex-col gap-1.5 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-white/80 lowercase">
                {item.name}
              </span>
              <span className="font-mono text-[10px] text-text-dim shrink-0">
                {item.code}
              </span>
            </div>
            <p className="text-xs text-white/35 leading-relaxed lowercase">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PackagingGrid({ items }: { items: SpecItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-hairline">
      {items.map((item) => (
        <div
          key={item.code}
          className="border-r border-b border-hairline p-5 md:p-6 flex flex-col gap-2 hover:bg-white/[0.015] transition-colors duration-300"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-white/80 lowercase">{item.name}</span>
            <span className="font-mono text-[10px] text-text-dim shrink-0">
              {item.code}
            </span>
          </div>
          <p className="text-xs text-white/35 leading-relaxed lowercase">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

function ResearchGrid({ items }: { items: SpecItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.code}
          className="border border-hairline p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-dim">
              {item.code}
            </span>
            <span className="font-mono text-[9px] tracking-[0.15em] text-text-dim border border-hairline px-2 py-0.5 lowercase">
              concept
            </span>
          </div>
          <span className="text-sm text-white/80 lowercase leading-snug">
            {item.name}
          </span>
          <p className="text-xs text-white/35 leading-relaxed lowercase">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

function MetricsRow({
  metrics,
}: {
  metrics: { value: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-l border-hairline">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="border-r border-b border-hairline p-5 flex flex-col gap-1.5"
        >
          <span className="text-2xl font-light tracking-tight text-white">
            {m.value}
          </span>
          <span className="text-[10px] font-mono tracking-[0.15em] text-text-faint lowercase">
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function BottleIcon({ inverted = false }: { inverted?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={`w-6 h-6 transition-transform duration-500 ${inverted ? "rotate-180" : ""}`}
    >
      <rect x="9" y="2.5" width="6" height="3" />
      <path d="M8.5 5.5h7l1 4v11a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11l1-4z" />
      <path d="M8 10h8" />
    </svg>
  );
}

function OrientationCard({
  label,
  sub,
  note,
  inverted = false,
}: {
  label: string;
  sub: string;
  note: string;
  inverted?: boolean;
}) {
  return (
    <div className="border border-hairline p-6 flex flex-col items-center text-center gap-4 hover:bg-white/[0.02] transition-colors duration-300">
      <div className="w-12 h-12 border border-hairline flex items-center justify-center text-text-muted">
        <BottleIcon inverted={inverted} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white/80 lowercase">{label}</span>
        <span className="font-mono text-[10px] text-text-faint lowercase">
          {sub}
        </span>
      </div>
      <p className="text-xs text-white/35 lowercase leading-relaxed max-w-[220px]">
        {note}
      </p>
    </div>
  );
}

function UsageRoutine({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="border border-hairline p-6 flex flex-col gap-4">
      <span className="font-mono text-[10px] tracking-[0.2em] text-text-dim lowercase">
        {title}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {steps.map((step, i) => (
          <span key={step} className="flex items-center gap-3">
            <span className="flex items-center gap-2 border border-hairline px-3 py-1.5 font-mono text-[11px] text-text-muted lowercase">
              <span className="text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step}
            </span>
            {i < steps.length - 1 && (
              <Icon src="/icons/arrow-right.svg" size={12} opacity={0.25} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function TimelineCard({
  index,
  title,
  status,
  statusTone,
  description,
  icon,
  children,
  isLast,
  defaultOpen = false,
}: {
  index: string;
  title: string;
  status: string;
  statusTone: StatusTone;
  description: string;
  icon: string;
  children: ReactNode;
  isLast?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`relative pl-12 md:pl-16 ${isLast ? "" : "pb-14 md:pb-20"}`}
    >
      <div className="absolute left-[13px] md:left-[17px] top-8 -translate-x-1/2 -translate-y-1/2 z-10">
        {statusTone === "live" && (
          <motion.span
            className="absolute inset-0 -m-2 rounded-[50%] bg-white/25 blur-md"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <span
          className={`relative block h-3 w-3 rounded-[50%] border ${statusTone === "live"
              ? "bg-white border-white"
              : "bg-[#0D0D0D] border-white/25"
            }`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border border-hairline hover:border-white/20 transition-colors duration-500"
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex flex-col md:flex-row md:items-center gap-4 md:gap-6 px-5 md:px-8 py-6 text-left group"
        >
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 border border-hairline flex items-center justify-center shrink-0 group-hover:border-white/25 transition-colors duration-300">
              <Icon src={icon} size={16} opacity={0.5} />
            </div>
            <span className="font-mono text-[11px] tracking-[0.25em] text-text-dim lowercase">
              {index}
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl md:text-2xl font-light lowercase text-white">
                {title}
              </h3>
              <StatusBadge label={status} tone={statusTone} />
            </div>
            <p className="text-sm text-text-faint lowercase leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0 self-start md:self-center"
          >
            <Icon src="/icons/chevron-down.svg" size={14} opacity={0.3} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden border-t border-hairline"
            >
              <div className="px-5 md:px-8 py-8">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const v1ShampooActives: SpecItem[] = [
  {
    code: "v1.sh.01",
    name: "aloe vera juice",
    desc: "deep scalp hydration, soothes irritation and conditions at the root.",
  },
  {
    code: "v1.sh.02",
    name: "sea kale extract",
    desc: "marine-derived fortification, strengthens the hair shaft from within.",
  },
  {
    code: "v1.sh.03",
    name: "ginkgo biloba leaf extract",
    desc: "circulatory activator, stimulates scalp microcirculation for density.",
  },
  {
    code: "v1.sh.04",
    name: "burdock root extract",
    desc: "sebum regulation, keeps scalp in clean equilibrium between washes.",
  },
];

const v1ConditionerActives: SpecItem[] = [
  {
    code: "v1.co.01",
    name: "aloe vera juice",
    desc: "hydration delivery system, binds moisture into the cortex layer.",
  },
  {
    code: "v1.co.02",
    name: "hydrolyzed wheat protein",
    desc: "structural repair, fills micro-damage along the hair shaft surface.",
  },
  {
    code: "v1.co.03",
    name: "argan oil",
    desc: "lipid restoration, seals the cuticle for shine without grease.",
  },
  {
    code: "v1.co.04",
    name: "sea kale extract",
    desc: "marine mineral complex, fortifies and thickens each strand.",
  },
];

const v1Metrics = [
  { value: "98-99%", label: "natural origin formula" },
  { value: "eu", label: "certified & bottled" },
  { value: "0", label: "transatlantic shipping overhead" },
];

const v2ShampooActives: SpecItem[] = [
  {
    code: "v2.sh.01",
    name: "salix alba (willow bark) extract",
    desc: "natural exfoliant, clears buildup and supports scalp renewal.",
  },
  {
    code: "v2.sh.02",
    name: "hydrolyzed pea protein",
    desc: "plant-based protein complex, reinforces strand structure without weight.",
  },
  {
    code: "v2.sh.03",
    name: "rosmarinus officinalis extract",
    desc: "circulation-supporting botanical, sharpens the scalp environment.",
  },
  {
    code: "v2.sh.04",
    name: "caffeine",
    desc: "follicle stimulant, engineered for density and vitality at the root.",
  },
];

const v2ConditionerActives: SpecItem[] = [
  {
    code: "v2.co.01",
    name: "baobab protein",
    desc: "cuticle repair and reinforced strand strength.",
  },
  {
    code: "v2.co.02",
    name: "plant squalane",
    desc: "moisture lock with a natural, weightless shine.",
  },
  {
    code: "v2.co.03",
    name: "marshmallow root",
    desc: "instant slip, easier detangling on contact.",
  },
  {
    code: "v2.co.04",
    name: "organic aloe vera",
    desc: "deep core hydration, carried through from the shampoo step.",
  },
];

const packagingItems: SpecItem[] = [
  {
    code: "pkg.01",
    name: "outer box",
    desc: "matte black uncoated cardstock box, providing a minimal stealth unboxing experience.",
  },
  {
    code: "pkg.02",
    name: "the reveal",
    desc: `inner flap featuring the core slogan: "refined to the core."`,
  },
  {
    code: "pkg.03",
    name: "custom inlay",
    desc: "molded black paper pulp designed for asymmetric placement, holding one unit upright and the other inverted.",
  },
  {
    code: "pkg.04",
    name: "insert card",
    desc: "heavyweight off-white a6 card outlining the technical philosophy behind the system.",
  },
];

const researchItems: SpecItem[] = [
  {
    code: "rd.01",
    name: "scalp equilibrium serums",
    desc: "targeted concentrate for optimal ph and sebum balance between washes.",
  },
  {
    code: "rd.02",
    name: "targeted leave-in actives",
    desc: "single-function leave-in treatments providing heat protection and density support.",
  },
  {
    code: "rd.03",
    name: "custom dosage dispensers",
    desc: "precision-metered delivery hardware crafted for the entire system.",
  },
];

const phases: {
  id: string;
  index: string;
  title: string;
  status: string;
  statusTone: StatusTone;
  icon: string;
  description: string;
  content: ReactNode;
}[] = [
    {
      id: "v1",
      index: "phase 01",
      title: "v1 / lab white edition",
      status: "live",
      statusTone: "live",
      icon: "/icons/flask-conical.svg",
      description:
        "clean, minimal white bottles with precision pumps. the current live system.",
      content: (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SpecGroup label="unit 01 / shampoo" items={v1ShampooActives} />
            <SpecGroup
              label="unit 02 / conditioner"
              items={v1ConditionerActives}
            />
          </div>
          <div>
            <span className="block font-mono text-[10px] tracking-[0.2em] text-text-dim lowercase mb-4">
              launch metrics
            </span>
            <MetricsRow metrics={v1Metrics} />
          </div>
        </div>
      ),
    },
    {
      id: "v2v3",
      index: "phase 02",
      title: "v2 & v3 / stealth black edition",
      status: "in development",
      statusTone: "dev",
      icon: "/icons/atom.svg",
      description:
        "transitioning to custom batch matte black bottles, featuring high-contrast crisp white silkscreen printing and matte black disc-top caps.",
      content: (
        <div className="flex flex-col gap-10">
          <div>
            <span className="block font-mono text-[10px] tracking-[0.2em] text-text-dim lowercase mb-4">
              gravity-driven packaging ux
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OrientationCard
                label="shampoo"
                sub="upright / cap on top"
                note="standard dispensing orientation for daily-use viscosity."
              />
              <OrientationCard
                label="conditioner"
                sub="inverted / cap on bottom"
                inverted
                note="gravity-fed dosing for the higher-density formula. form follows function."
              />
            </div>
          </div>
          <div>
            <span className="block font-mono text-[10px] tracking-[0.2em] text-text-dim lowercase mb-4">
              upgraded active compounds
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SpecGroup label="unit 01 / shampoo v2" items={v2ShampooActives} />
              <SpecGroup
                label="unit 02 / conditioner v2"
                items={v2ConditionerActives}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "packaging",
      index: "phase 03",
      title: "unboxing & secondary packaging",
      status: "prototyping",
      statusTone: "prototype",
      icon: "/icons/layers-minimalistic.svg",
      description:
        "the full secondary packaging experience, spec'd to match the stealth black system end to end.",
      content: (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-text-faint lowercase leading-relaxed max-w-2xl">
            every layer of the unboxing sequence is being prototyped alongside the
            v2 bottle tooling.
          </p>
          <PackagingGrid items={packagingItems} />
        </div>
      ),
    },
    {
      id: "future",
      index: "phase 04",
      title: "future system expansions",
      status: "research & development",
      statusTone: "research",
      icon: "/icons/microscope.svg",
      description:
        "early-stage exploration into system extensions beyond the core duo.",
      content: (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-text-faint lowercase leading-relaxed max-w-2xl">
            still bound by the same functional-concentration standard: nothing
            ships until it earns its place on the label.
          </p>
          <ResearchGrid items={researchItems} />
        </div>
      ),
    },
  ];

function FormulaComparator() {
  const [version, setVersion] = useState<"v1" | "v2">("v1");
  const shampoo = version === "v1" ? v1ShampooActives : v2ShampooActives;
  const conditioner =
    version === "v1" ? v1ConditionerActives : v2ConditionerActives;

  return (
    <section
      id="comparator"
      className="border-t border-hairline py-20 md:py-32 scroll-mt-24"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <SectionHeader
          variant="compact"
          index="03"
          title="formula comparator"
        />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <p className="text-sm text-text-faint lowercase leading-relaxed max-w-md">
            toggle between the live v1 launch actives and the v2 custom batch
            stack currently in development.
          </p>

          <div className="flex items-center border border-hairline p-1 w-full sm:w-auto">
            {(["v1", "v2"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                aria-pressed={version === v}
                className={`flex-1 sm:flex-none px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] lowercase transition-all duration-300 whitespace-nowrap focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 ${version === v
                    ? "bg-white text-[#0D0D0D]"
                    : "text-text-faint hover:text-white"
                  }`}
              >
                {v === "v1" ? "v1 launch actives" : "v2 custom batch actives"}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={version}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <SpecGroup label={`unit 01 / shampoo / ${version}`} items={shampoo} />
          <SpecGroup
            label={`unit 02 / conditioner / ${version}`}
            items={conditioner}
          />
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <UsageRoutine
            title="shampoo routine"
            steps={["massage", "cleanse", "rinse"]}
          />
          <UsageRoutine
            title="conditioner routine"
            steps={["apply", "wait", "rinse"]}
          />
        </div>
      </div>
    </section>
  );
}

function RoadmapCta() {
  return (
    <section className="border-t border-hairline">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight lowercase max-w-lg">
            engineered today. refined for what comes next.
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <Button href="/shop" variant="solid" className="group">
              shop the current system
              <img
                src="/icons/arrow-right.svg"
                alt=""
                aria-hidden="true"
                className="h-3.5 w-3.5 brightness-0 group-hover:invert group-hover:translate-x-1 transition-all duration-300"
              />
            </Button>
            <Link
              href="/#waitlist"
              className="flex items-center justify-center px-8 py-4 border border-white/20 text-sm tracking-[0.2em] lowercase text-text-muted hover:text-white hover:border-white/40 transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 focus-visible:outline-offset-2"
            >
              join the v2 waitlist
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RoadmapContent() {
  return (
    <>
      { }
      <section className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-text-muted pb-8 md:pb-14 border-b border-hairline">
            <span>CORE. {"//"} roadmap</span>
            <span className="hidden sm:inline">technical hair care.</span>
            <span>engineered in the netherlands</span>
          </div>

          <div className="pt-12 md:pt-16 flex flex-col gap-6 max-w-3xl">
            <span className="font-mono text-xs tracking-[0.2em] text-text-muted">
              01 {"//"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight lowercase text-white">
              technical progression
              <br />
              &amp; system roadmap.
            </h1>
            <p className="text-text-muted text-sm sm:text-base md:text-lg leading-relaxed normal-case max-w-xl">
              CORE. launched with a precise, minimalist v1 system featuring lab
              white bottles and ecocert cosmos natural actives, compromising
              nothing on formulation. the upcoming v2 and v3 iterations upgrade
              our production to a custom stealth black edition, meticulously
              engineered for gravity-driven dosing alongside an advanced active
              compound stack. beyond our duo, the roadmap targets specialized
              scalp and styling systems, held to the same exacting standards.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button href="#timeline" variant="solid">
              explore the timeline
            </Button>
            <a
              href="#comparator"
              className="flex items-center justify-center px-8 py-4 border border-white/20 text-sm tracking-[0.2em] lowercase text-text-muted hover:text-white hover:border-white/40 active:scale-[0.98] transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 focus-visible:outline-offset-2"
            >
              view formula comparator
            </a>
          </div>
        </div>
      </section>

      { }
      <section
        id="timeline"
        className="border-t border-hairline py-16 md:py-24 bg-white/[0.015] scroll-mt-24"
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <SectionHeader variant="compact" index="02" title="phased pipeline" />
          <p className="text-sm text-text-faint lowercase leading-relaxed max-w-2xl mb-14 md:mb-20">
            four active phases, from the current lab white launch through to
            long-range system expansion. tap any phase for the full spec.
          </p>

          <div className="relative">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
              className="hidden sm:block absolute left-[13px] md:left-[17px] top-2 bottom-2 w-px bg-gradient-to-b from-white/40 via-white/10 to-white/5"
            />

            <div className="flex flex-col">
              {phases.map((phase, i) => (
                <TimelineCard
                  key={phase.id}
                  index={phase.index}
                  title={phase.title}
                  status={phase.status}
                  statusTone={phase.statusTone}
                  description={phase.description}
                  icon={phase.icon}
                  isLast={i === phases.length - 1}
                  defaultOpen={i === 0}
                >
                  {phase.content}
                </TimelineCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FormulaComparator />
      <RoadmapCta />
    </>
  );
}
