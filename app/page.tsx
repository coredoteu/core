import Image from "next/image";
import Link from "next/link";

// ─── Data ───────────────────────────────────────────────────────────────────
const navLinks = ["shop", "science", "routine"] as const;

const tickerItems = [
  "refined to the core.",
  "100% natural formula",
  "zero synthetic compromises",
  "ph 4.5 - 5.5 balance",
  "sulfate & silicone free",
  "engineered in europe",
];

const traditionalRows = [
  "synthetic silicones & sulfates",
  "strips your natural scalp barrier",
  "80% water, cheap fillers",
  "harsh chemical fragrance",
];

const coreRows = [
  "100% natural botanical actives",
  "ph-balanced, protects scalp & strand",
  "zero silicones, sulfates or dyes",
  "pure essential oil complex",
];

const systemBadges = ["100% natural", "sulfate free", "silicone free", "vegan"];

const systemSpecs: Array<[string, string]> = [
  ["format", "shampoo + conditioner"],
  ["volume", "250ml x 2"],
  ["ph range", "4.5 - 5.5"],
  ["use", "daily"],
  ["scent", "bergamot / cedarwood / peppermint"],
  ["origin", "engineered in eu"],
];

const shampooActives = [
  {
    code: "sh.01",
    name: "organic aloe vera extract",
    desc: "calms and hydrates the scalp directly without thinning the formulation.",
  },
  {
    code: "sh.02",
    name: "sodium cocoyl isethionate & coco-glucoside",
    desc: "ultra-mild coconut cleansers that create a thick, creamy foam without stripping.",
  },
  {
    code: "sh.03",
    name: "plant keratin (hydrolyzed wheat & oat)",
    desc: "rebuilds strand structure from the outside in to add immediate volume.",
  },
  {
    code: "sh.04",
    name: "lactic acid",
    desc: "natural ph regulator that seals the scalp barrier at exact 4.5 - 5.5 range.",
  },
  {
    code: "sh.05",
    name: "signature essential oil complex",
    desc: "pure bergamot, cedarwood and peppermint blend for root activation.",
  },
];

const conditionerActives = [
  {
    code: "co.01",
    name: "brassica alcohol & esylate",
    desc: "100% plant-derived silicone alternative providing instant slip and rich texture.",
  },
  {
    code: "co.02",
    name: "cold-pressed argan oil",
    desc: "delivers deep lipid nourishment without weight or greasy residue.",
  },
  {
    code: "co.03",
    name: "cold-pressed jojoba seed oil",
    desc: "mimics natural scalp lipids to restore moisture balance.",
  },
  {
    code: "co.04",
    name: "provitamin b5 (panthenol)",
    desc: "increases elasticity and strand density you can feel immediately.",
  },
  {
    code: "co.05",
    name: "signature essential oil complex",
    desc: "completes the system with identical technical spa scent notes.",
  },
];

const standards = [
  { value: "100%", label: "natural formula" },
  { value: "4.5-5.5", label: "ph balanced range" },
  { value: "0", label: "synthetic compromises" },
  { value: "eu", label: "engineered & bottled" },
];

const footerLinks = ["shop", "science", "routine", "cart"];

// ─── Small presentational primitives ───────────────────────────────────────
function SectionEyebrow({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs tracking-[0.2em] text-white/40">
        {index} /
      </span>
      <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
        {title}
      </h2>
    </div>
  );
}

function SpecMarker({
  top,
  left,
  label,
}: {
  top: string;
  left: string;
  label: string;
}) {
  return (
    <div className="absolute flex items-center gap-3" style={{ top, left }}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full bg-white/40 animate-ping" />
        <span className="relative inline-flex h-2 w-2 bg-white" />
      </span>
      <span className="text-[10px] font-mono tracking-[0.15em] text-white/80 border border-white/20 bg-[#0D0D0D]/80 backdrop-blur-sm px-2 py-1 whitespace-nowrap lowercase">
        {label}
      </span>
    </div>
  );
}

function CornerBrackets() {
  return (
    <>
      <span className="absolute top-4 left-4 h-4 w-4 border-t border-l border-white/30" />
      <span className="absolute top-4 right-4 h-4 w-4 border-t border-r border-white/30" />
      <span className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-white/30" />
      <span className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-white/30" />
    </>
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-white lowercase">{item.name}</span>
              <span className="font-mono text-[10px] text-white/30 lowercase">
                {item.code}
              </span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed lowercase">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <style>{`
        @keyframes core-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee { animation: core-marquee 26s linear infinite; }
      `}</style>

      {/* ──────────────────────────────────────────────────────────────────
          HEADER
      ────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0D0D0D]/85 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between relative">
          <nav className="flex items-center gap-8 z-10">
            {navLinks.map((label) => (
              <Link
                key={label}
                href={`/${label}`}
                className="text-sm tracking-widest lowercase text-white/60 hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
          >
            <Image
              src="/CORE_logo_trans.svg"
              alt="CORE."
              width={160}
              height={38}
              className="h-6 md:h-7 lg:h-8 w-auto object-contain"
              priority
            />
            <span className="hidden md:block mt-1 text-[9px] tracking-[0.3em] text-white/35 lowercase">
              refined to the core.
            </span>
          </Link>

          <div className="flex items-center gap-6 z-10">
            <span className="hidden sm:flex items-center gap-2 text-xs font-mono tracking-[0.15em] text-white/40 lowercase">
              <span className="h-1.5 w-1.5 bg-emerald-400" />
              in stock
            </span>
            <span className="text-sm tracking-widest lowercase text-white/60 cursor-default select-none">
              eu&nbsp;/&nbsp;eur&nbsp;(€)
            </span>
            <Link
              href="/cart"
              className="text-sm tracking-widest lowercase text-white/60 hover:text-white transition-colors duration-200"
            >
              cart&nbsp;(0)
            </Link>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────
          HERO
      ────────────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px] pointer-events-none" />

        <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
          <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-white/35 pb-8 md:pb-14 border-b border-white/10">
            <span>core. / system 002</span>
            <span className="hidden sm:inline">refined to the core.</span>
            <span>lat 51.92 / lon 4.47</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 py-14 md:py-24 items-end">
            <h1 className="lg:col-span-8 text-[15vw] sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.86] tracking-tighter font-light lowercase">
              hair care,
              <br />
              engineered right.
            </h1>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <p className="text-white/50 text-base md:text-lg leading-relaxed lowercase">
                a shampoo and conditioner system built from 100% natural
                actives. simple ingredients, real results, zero shortcuts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-8 py-3.5 border border-white text-sm tracking-[0.2em] lowercase text-[#0D0D0D] bg-white hover:bg-transparent hover:text-white transition-colors duration-300"
                >
                  shop the duo
                </Link>
                <Link
                  href="#formula"
                  className="inline-flex items-center justify-center px-8 py-3.5 border border-white/20 text-sm tracking-[0.2em] lowercase text-white/60 hover:text-white hover:border-white/40 transition-colors duration-300"
                >
                  see the ingredients
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] border-t border-white/10">
          <Image
            src="/hero-shot.png"
            alt="core. shampoo and conditioner duo"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/10" />
          <SpecMarker top="28%" left="18%" label="shampoo, 250ml" />
          <SpecMarker top="62%" left="66%" label="conditioner, 250ml" />
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          TICKER
      ────────────────────────────────────────────────────────────────── */}
      <div className="relative border-b border-white/10 bg-[#0D0D0D] overflow-hidden py-4">
        <div className="flex w-max animate-marquee">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-8">
              <span className="text-xs tracking-[0.2em] text-white/40 lowercase whitespace-nowrap">
                {item}
              </span>
              <span className="text-white/15">/</span>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          01 / THE COMPARISON
      ────────────────────────────────────────────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36 border-b border-white/10">
        <SectionEyebrow index="01" title="the comparison" />

        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2">
          <div className="border border-white/10 md:border-r-0 p-8 md:p-14">
            <span className="text-xs font-mono tracking-[0.2em] text-white/30">
              [ baseline ]
            </span>
            <h3 className="mt-4 text-2xl md:text-3xl font-light lowercase text-white/40">
              traditional hair care
            </h3>
            <ul className="mt-10 flex flex-col divide-y divide-white/5">
              {traditionalRows.map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between py-4 text-sm text-white/35 lowercase"
                >
                  <span>{row}</span>
                  <span className="font-mono text-white/20 text-xs">fail</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-white/20 bg-white/[0.02] p-8 md:p-14 relative">
            <span className="absolute -top-px left-8 -translate-y-1/2 bg-[#0D0D0D] px-3 text-[10px] font-mono tracking-[0.25em] text-white lowercase">
              [ core. spec ]
            </span>
            <h3 className="mt-4 text-2xl md:text-3xl font-light lowercase text-white">
              core. engineered
            </h3>
            <ul className="mt-10 flex flex-col divide-y divide-white/10">
              {coreRows.map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between py-4 text-sm text-white lowercase"
                >
                  <span>{row}</span>
                  <span className="font-mono text-white/60 text-xs">pass</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          02 / THE SYSTEM
      ────────────────────────────────────────────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36 border-b border-white/10">
        <SectionEyebrow index="02" title="the system" />

        <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 relative aspect-[4/5] border border-white/10 bg-neutral-950 overflow-hidden">
            <CornerBrackets />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-6">
                <div className="w-24 md:w-32 h-56 md:h-72 border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent" />
                <div className="w-24 md:w-32 h-56 md:h-72 border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent" />
              </div>
            </div>
            <SpecMarker top="20%" left="14%" label="01, shampoo, 250ml" />
            <SpecMarker top="58%" left="58%" label="02, conditioner, 250ml" />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-[0.15em] text-white/25 lowercase whitespace-nowrap">
              [ product render placeholder ]
            </span>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <p className="text-white/50 leading-relaxed lowercase max-w-md">
              one shampoo, one conditioner, built to work together. use them
              daily to reset your scalp and strengthen every strand from
              root to tip.
            </p>

            <div className="flex flex-wrap gap-2">
              {systemBadges.map((b) => (
                <span
                  key={b}
                  className="border border-white/15 px-3 py-1.5 text-[11px] font-mono tracking-[0.15em] text-white/60 lowercase"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="border border-white/10 divide-y divide-white/10 font-mono text-xs">
              {systemSpecs.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-4 py-3">
                  <span className="text-white/40 lowercase">{k}</span>
                  <span className="text-white/80 lowercase">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <span className="text-3xl font-light tracking-tight text-white">
                  €52.00
                </span>
                <span className="text-xs text-white/40 lowercase mt-1">
                  save €4 vs. individual units
                </span>
              </div>
            </div>

            <Link
              href="/shop/duo"
              className="group flex items-center justify-between px-8 py-4 bg-white text-[#0D0D0D] text-sm tracking-[0.2em] lowercase hover:bg-transparent hover:text-white border border-white transition-colors duration-300"
            >
              <span>add the duo to cart</span>
              <span className="font-mono">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          03 / THE INGREDIENTS
      ────────────────────────────────────────────────────────────────── */}
      <section id="formula" className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36 border-b border-white/10">
        <SectionEyebrow index="03" title="the ingredients" />
        <p className="mt-6 text-white/40 text-sm lowercase max-w-xl">
          every active ingredient in the duo, listed in plain terms. no
          hidden blends, no filler names.
        </p>

        <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IngredientList title="shampoo actives" prefix="unit 01" items={shampooActives} />
          <IngredientList title="conditioner actives" prefix="unit 02" items={conditionerActives} />
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          04 / STANDARDS
      ────────────────────────────────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#0D0D0D]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <SectionEyebrow index="04" title="standards" />

          <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10">
            {standards.map((s) => (
              <div
                key={s.label}
                className="border-r border-b border-white/10 p-8 flex flex-col gap-2"
              >
                <span className="text-3xl md:text-4xl font-light tracking-tight text-white">
                  {s.value}
                </span>
                <span className="text-xs tracking-[0.15em] text-white/40 lowercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          FOOTER
      ────────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0D0D0D]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            <h3 className="text-3xl md:text-5xl font-light tracking-tight lowercase max-w-lg">
              get early access to the next system drop.
            </h3>
            <form className="flex items-stretch border border-white/20 max-w-md w-full lg:ml-auto">
              <input
                type="email"
                placeholder="you@domain.com"
                className="flex-1 bg-transparent px-4 py-4 text-sm text-white placeholder:text-white/30 lowercase outline-none"
              />
              <button
                type="submit"
                className="px-6 text-sm tracking-[0.15em] lowercase bg-white text-[#0D0D0D] hover:bg-white/90 transition-colors duration-300"
              >
                notify me
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/30 font-mono tracking-[0.1em] lowercase">
            © {new Date().getFullYear()} core. refined to the core.
          </span>
          <div className="flex items-center gap-6">
            {footerLinks.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className="text-xs tracking-[0.15em] text-white/40 hover:text-white transition-colors duration-300 lowercase"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}