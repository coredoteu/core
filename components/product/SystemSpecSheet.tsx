import Image from "next/image";
import BatchCartSection from "@/components/product/BatchCartSection";
import { getCatalogProduct } from "@/lib/catalog";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getActiveBatch, toBatchDisplayProps } from "@/lib/batches";

const badges = [
  { icon: "/icons/vegan.svg", label: "vegan" },
  { icon: "/icons/badge-check.svg", label: "cruelty-free" },
  { icon: "/icons/ban.svg", label: "nut-free" },
  { icon: "/icons/ban.svg", label: "silicone free" },
  { icon: "/icons/leaf.svg", label: "ecocert cosmos natural" },
];

const specs = [
  { icon: "/icons/layers-minimalistic.svg", key: "volume", value: "290ml x 2" },
  { icon: "/icons/flask-conical.svg", key: "ph range", value: "4.5 - 5.5" },
  {
    icon: "/icons/flower.svg",
    key: "scent",
    value: "juicy fruits & warm woods",
  },
  {
    icon: "/icons/map-pin-check.svg",
    key: "origin",
    value: "netherlands / eu",
  },
  {
    icon: "/icons/leaf.svg",
    key: "certification",
    value: "ecocert cosmos, 98-99%",
  },
];

const shampooRitual = ["massage", "cleanse", "rinse"];
const conditionerRitual = ["apply", "nourish", "rinse"];

const shampooActives = [
  {
    code: "sh.01",
    name: "aloe barbadensis leaf juice",
    desc: "hydrates the scalp directly and calms irritation on contact.",
  },
  {
    code: "sh.02",
    name: "lauryl & coco-glucoside cleansing base",
    desc: "mild coconut-derived cleansers that foam without stripping.",
  },
  {
    code: "sh.03",
    name: "crambe maritima (sea kale) leaf extract",
    desc: "marine-derived antioxidant that supports scalp equilibrium.",
  },
  {
    code: "sh.04",
    name: "ginkgo biloba leaf extract",
    desc: "organically farmed, supports micro-circulation at the follicle.",
  },
  {
    code: "sh.05",
    name: "arctium lappa (burdock) root extract",
    desc: "organically farmed, strengthens strand structure from the root.",
  },
];

const conditionerActives = [
  {
    code: "co.01",
    name: "hydrolyzed wheat protein",
    desc: "rebuilds strand structure from the outside in.",
  },
  {
    code: "co.02",
    name: "argania spinosa (argan) kernel oil",
    desc: "organically farmed, deep lipid nourishment without weight.",
  },
  {
    code: "co.03",
    name: "aloe barbadensis leaf juice",
    desc: "core hydration carried through from the shampoo step.",
  },
  {
    code: "co.04",
    name: "crambe maritima & burdock root extract",
    desc: "antioxidant support paired with root-level strength.",
  },
  {
    code: "co.05",
    name: "ginkgo biloba leaf extract",
    desc: "organically farmed, closes the system with circulation support.",
  },
];

function RitualSteps({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-text-muted lowercase">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          <span>
            {String(i + 1).padStart(2, "0")}. {step}
          </span>
          {i < steps.length - 1 && (
            <Icon src="/icons/arrow-right.svg" size={10} opacity={0.4} />
          )}
        </span>
      ))}
    </div>
  );
}

function IngredientList({
  title,
  prefix,
  items,
}: {
  title: string;
  prefix: string;
  items: { code: string; name: string; desc: string }[];
}) {
  return (
    <div className="border border-hairline">
      <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-hairline bg-white/[0.02]">
        <h3 className="text-lg font-light lowercase text-white">{title}</h3>
        <span className="font-mono text-[10px] tracking-[0.2em] text-text-muted lowercase">
          {prefix}
        </span>
      </div>
      <div className="divide-y divide-white/10">
        {items.map((item) => (
          <div
            key={item.code}
            className="flex flex-col gap-1.5 px-6 md:px-8 py-5"
          >
            <div className="flex items-center gap-2">
              <Icon src="/icons/atom.svg" size={14} opacity={0.5} />
              <span className="text-sm text-white lowercase tracking-wider">
                {item.name}
              </span>
              <span className="ml-auto font-mono text-[10px] text-text-muted lowercase shrink-0">
                {item.code}
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed lowercase pl-6">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SystemSpecSheet() {
  const shampoo = getCatalogProduct("shampoo-290");
  const conditioner = getCatalogProduct("conditioner-290");
  const duo = getCatalogProduct("duo-system-001");
  const batch = toBatchDisplayProps(await getActiveBatch());

  return (
    <section
      id="formula"
      data-mobile-sticky-trigger="true"
      className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36 border-b border-hairline"
    >
      <div className="mb-6">
        <SectionHeader index="01" title="system 001" />
      </div>
      <p className="mt-6 text-text-muted text-sm lowercase max-w-xl">
        the current v1 lineup. clinical, ph-balanced, and built from a short
        list of natural actives with nothing hidden behind a blend name.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b.label}
            className="flex items-center gap-2 border border-hairline px-3 py-1.5 text-[11px] font-mono tracking-[0.15em] text-text-muted lowercase"
          >
            <Icon src={b.icon} size={14} opacity={0.7} />
            {b.label}
          </span>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 border-t border-l border-hairline">
        <div className="border-r border-b border-hairline p-8 md:p-12 flex flex-col gap-6 bg-white/[0.02] relative lg:col-span-2">
          <span className="absolute -top-px left-8 -translate-y-1/2 bg-[#0D0D0D] px-3 text-[10px] font-mono tracking-[0.25em] text-text-muted lowercase border border-hairline">
            recommended
          </span>
          <span className="text-xs font-mono tracking-[0.2em] text-text-muted">
            system 001
          </span>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
            {}
            <div className="relative aspect-square w-full max-w-[280px] flex items-center justify-center">
              <div className="relative h-full w-[44%]">
                <Image
                  src="/images/shampoo-front.png"
                  alt="shampoo"
                  fill
                  className="object-contain"
                  sizes="140px"
                />
              </div>
              <div className="flex items-center justify-center w-[12%] shrink-0 z-10">
                <span
                  className="text-white font-extralight select-none leading-none"
                  style={{
                    fontSize: "2rem",
                    textShadow: "0 0 12px rgba(255,255,255,0.35)",
                    letterSpacing: 0,
                  }}
                  aria-hidden="true"
                >
                  +
                </span>
              </div>
              <div className="relative h-full w-[44%]">
                <Image
                  src="/images/conditioner-front.png"
                  alt="conditioner"
                  fill
                  className="object-contain"
                  sizes="140px"
                />
              </div>
            </div>

            {}
            <div className="flex flex-col gap-6 lg:max-w-md w-full">
              <div>
                <h3 className="text-2xl font-light lowercase text-white">
                  the duo bundle
                </h3>
                <p className="mt-2 text-sm text-text-muted lowercase leading-relaxed">
                  shampoo + conditioner. the complete daily system. engineered
                  to work in sequence - cleanse, then seal.
                </p>
              </div>
              <div className="mt-2">
                <BatchCartSection
                  productId={duo.id}
                  product={duo}
                  {...(batch ?? {})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-r border-b border-hairline p-8 flex flex-col gap-6 lg:col-span-1">
          <span className="text-xs font-mono tracking-[0.2em] text-text-muted">
            unit 01
          </span>
          <div className="relative aspect-square w-full max-w-[160px] mx-auto">
            <Image
              src="/images/shampoo-front.png"
              alt="CORE. daily balancing shampoo"
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>
          <div>
            <h3 className="text-xl font-light lowercase text-white">shampoo</h3>
            <p className="mt-2 text-xs text-text-muted lowercase leading-relaxed">
              daily balancing, ph-equilibrated, 290ml.
            </p>
          </div>
          <RitualSteps steps={shampooRitual} />
          <div className="mt-auto pt-2">
            <BatchCartSection
              productId={shampoo.id}
              product={shampoo}
              {...(batch ?? {})}
            />
          </div>
        </div>

        <div className="border-r border-b border-hairline p-8 flex flex-col gap-6 lg:col-span-1">
          <span className="text-xs font-mono tracking-[0.2em] text-text-muted">
            unit 02
          </span>
          <div className="relative aspect-square w-full max-w-[160px] mx-auto">
            <Image
              src="/images/conditioner-front.png"
              alt="CORE. daily nourishing conditioner"
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>
          <div>
            <h3 className="text-xl font-light lowercase text-white">
              conditioner
            </h3>
            <p className="mt-2 text-xs text-text-muted lowercase leading-relaxed">
              daily nourishing, weightless seal, 290ml.
            </p>
          </div>
          <RitualSteps steps={conditionerRitual} />
          <div className="mt-auto pt-2">
            <BatchCartSection
              productId={conditioner.id}
              product={conditioner}
              {...(batch ?? {})}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-5 border-t border-l border-hairline">
        {specs.map((s) => (
          <div
            key={s.key}
            className="border-r border-b border-hairline p-6 flex flex-col gap-3"
          >
            <Icon src={s.icon} size={16} opacity={0.6} />
            <span className="text-[10px] font-mono tracking-[0.15em] text-text-muted lowercase">
              {s.key}
            </span>
            <span className="text-sm text-white/80 lowercase">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IngredientList
          title="shampoo actives"
          prefix="unit 01"
          items={shampooActives}
        />
        <IngredientList
          title="conditioner actives"
          prefix="unit 02"
          items={conditionerActives}
        />
      </div>
    </section>
  );
}
