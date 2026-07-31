import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

// 3. Replaced missing custom icons with available equivalents from /icons directory:
// cruelty-free → badge-check.svg | nut-free → ban.svg | silicone-free → ban.svg
// leaf-organic → leaf.svg | ph-level → flask-conical.svg | scent-drop → flower.svg
// origin-pin → map-pin-check.svg
const badges = [
  { icon: "/icons/vegan.svg",        label: "vegan" },
  { icon: "/icons/badge-check.svg",  label: "cruelty-free" },
  { icon: "/icons/ban.svg",          label: "nut-free" },
  { icon: "/icons/ban.svg",          label: "silicone free" },
  { icon: "/icons/leaf.svg",         label: "ecocert cosmos natural" },
];

const specs = [
  { icon: "/icons/cylinder.svg",         key: "volume",        value: "290ml x 2" },
  { icon: "/icons/flask-conical.svg",   key: "ph range",      value: "4.5 - 5.5" },
  { icon: "/icons/flower.svg",          key: "scent",         value: "juicy fruits & warm woods" },
  { icon: "/icons/map-pin-check.svg",   key: "origin",        value: "netherlands / eu" },
  { icon: "/icons/leaf.svg",            key: "certification", value: "ecocert cosmos, 98-99%" },
];

const shampooRitual = ["massage", "cleanse", "rinse"];
const conditionerRitual = ["apply", "nourish", "rinse"];

const shampooActives = [
  { code: "sh.01", name: "aloe barbadensis leaf juice", desc: "hydrates the scalp directly and calms irritation on contact." },
  { code: "sh.02", name: "lauryl & coco-glucoside cleansing base", desc: "mild coconut-derived cleansers that foam without stripping." },
  { code: "sh.03", name: "crambe maritima (sea kale) leaf extract", desc: "marine-derived antioxidant that supports scalp equilibrium." },
  { code: "sh.04", name: "ginkgo biloba leaf extract", desc: "organically farmed, supports micro-circulation at the follicle." },
  { code: "sh.05", name: "arctium lappa (burdock) root extract", desc: "organically farmed, strengthens strand structure from the root." },
];

const conditionerActives = [
  { code: "co.01", name: "hydrolyzed wheat protein", desc: "rebuilds strand structure from the outside in." },
  { code: "co.02", name: "argania spinosa (argan) kernel oil", desc: "organically farmed, deep lipid nourishment without weight." },
  { code: "co.03", name: "aloe barbadensis leaf juice", desc: "core hydration carried through from the shampoo step." },
  { code: "co.04", name: "crambe maritima & burdock root extract", desc: "antioxidant support paired with root-level strength." },
  { code: "co.05", name: "ginkgo biloba leaf extract", desc: "organically farmed, closes the system with circulation support." },
];

function RitualSteps({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-white/50 lowercase">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          <span>
            {String(i + 1).padStart(2, "0")}. {step}
          </span>
          {i < steps.length - 1 && (
            <img src="/icons/arrow-right.svg" alt="" className="h-2.5 w-2.5 opacity-40" style={{ filter: "brightness(0) invert(1)" }} />
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
    <div className="border border-white/10">
      <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/10 bg-white/[0.02]">
        <h3 className="text-lg font-light lowercase text-white">{title}</h3>
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 lowercase">
          {prefix}
        </span>
      </div>
      <div className="divide-y divide-white/10">
        {items.map((item) => (
          <div key={item.code} className="flex flex-col gap-1.5 px-6 md:px-8 py-5">
            <div className="flex items-center gap-2">
              {/* 3. molecule.svg missing → replaced with atom.svg; white filter applied */}
              <img src="/icons/atom.svg" alt="" className="h-3.5 w-3.5 opacity-50 shrink-0" style={{ filter: "brightness(0) invert(1)" }} />
              <span className="text-sm text-white lowercase">{item.name}</span>
              <span className="ml-auto font-mono text-[10px] text-white/30 lowercase shrink-0">
                {item.code}
              </span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed lowercase pl-6">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SystemSpecSheet() {
  return (
    <section id="formula" className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36 border-b border-white/10">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.2em] text-white/40">01 //</span>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
          system 001
        </h2>
      </div>
      <p className="mt-6 text-white/40 text-sm lowercase max-w-xl">
        the current v1 lineup. clinical, ph-balanced, and built from a short
        list of natural actives with nothing hidden behind a blend name.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b.label}
            className="flex items-center gap-2 border border-white/15 px-3 py-1.5 text-[11px] font-mono tracking-[0.15em] text-white/60 lowercase"
          >
            {/* 3. White filter on all badge icons */}
            <img src={b.icon} alt="" className="h-3.5 w-3.5 opacity-70" style={{ filter: "brightness(0) invert(1)" }} />
            {b.label}
          </span>
        ))}
      </div>

      {/* product grid: shampoo / conditioner / duo bundle */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 border-t border-l border-white/10">
        <div className="border-r border-b border-white/10 p-8 flex flex-col gap-6">
          <span className="text-xs font-mono tracking-[0.2em] text-white/30">unit 01</span>
          <div className="relative aspect-square w-full max-w-[160px] mx-auto">
            <Image
              src="/images/shampoo-front.png"
              alt="core. daily balancing shampoo"
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>
          <div>
            <h3 className="text-xl font-light lowercase text-white">shampoo</h3>
            <p className="mt-2 text-xs text-white/40 lowercase leading-relaxed">
              daily balancing, ph-equilibrated, 290ml.
            </p>
          </div>
          <RitualSteps steps={shampooRitual} />
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-2xl font-light text-white">€28.00</span>
          </div>
          <AddToCartButton />
        </div>

        <div className="border-r border-b border-white/10 p-8 flex flex-col gap-6">
          <span className="text-xs font-mono tracking-[0.2em] text-white/30">unit 02</span>
          <div className="relative aspect-square w-full max-w-[160px] mx-auto">
            <Image
              src="/images/conditioner-front.png"
              alt="core. daily nourishing conditioner"
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>
          <div>
            <h3 className="text-xl font-light lowercase text-white">conditioner</h3>
            <p className="mt-2 text-xs text-white/40 lowercase leading-relaxed">
              daily nourishing, weightless seal, 290ml.
            </p>
          </div>
          <RitualSteps steps={conditionerRitual} />
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-2xl font-light text-white">€28.00</span>
          </div>
          <AddToCartButton />
        </div>

        <div className="border-r border-b border-white/10 p-8 flex flex-col gap-6 bg-white/[0.02] relative">
          <span className="absolute -top-px left-8 -translate-y-1/2 bg-[#0D0D0D] px-3 text-[10px] font-mono tracking-[0.25em] text-white lowercase">
            recommended
          </span>
          <span className="text-xs font-mono tracking-[0.2em] text-white/30">system 001</span>
          {/* 5. Duo bundle graphic: styled white + between the two bottles */}
          <div className="relative aspect-square w-full max-w-[220px] mx-auto flex items-center justify-center">
            <div className="relative h-full w-[44%]">
              <Image
                src="/images/shampoo-front.png"
                alt="shampoo"
                fill
                className="object-contain"
                sizes="100px"
              />
            </div>
            {/* Plus sign — white, positioned centrally between the bottles */}
            <div className="flex items-center justify-center w-[12%] shrink-0 z-10">
              <span
                className="text-white font-extralight select-none leading-none"
                style={{
                  fontSize: "1.4rem",
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
                sizes="100px"
              />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-light lowercase text-white">the duo bundle</h3>
            <p className="mt-2 text-xs text-white/40 lowercase leading-relaxed">
              shampoo + conditioner, the full daily system.
            </p>
          </div>
          <div className="mt-auto flex items-baseline gap-3 pt-2">
            <span className="text-2xl font-light text-white">€52.00</span>
            <span className="text-xs text-white/30 line-through">€56.00</span>
            <span className="text-[10px] font-mono text-white/40 lowercase">save €4</span>
          </div>
          <AddToCartButton label="add the duo" className="border-white" />
        </div>
      </div>

      {/* spec grid */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-5 border-t border-l border-white/10">
        {specs.map((s) => (
          <div key={s.key} className="border-r border-b border-white/10 p-6 flex flex-col gap-3">
            {/* 3. White filter on all spec icons */}
          <img src={s.icon} alt="" className="h-4 w-4 opacity-60" style={{ filter: "brightness(0) invert(1)" }} />
            <span className="text-[10px] font-mono tracking-[0.15em] text-white/30 lowercase">
              {s.key}
            </span>
            <span className="text-sm text-white/80 lowercase">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IngredientList title="shampoo actives" prefix="unit 01" items={shampooActives} />
        <IngredientList title="conditioner actives" prefix="unit 02" items={conditionerActives} />
      </div>
    </section>
  );
}
