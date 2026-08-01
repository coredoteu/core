import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ShopAddToCart from "@/components/ShopAddToCart";
import { CATALOG } from "@/lib/catalog";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "shop / 01 — CORE.",
  description:
    "the v1 system. clinical, ph-balanced formulations engineered for scalp and strand precision. shop the CORE. daily lineup.",
};

// ─── Key Actives data ─────────────────────────────────────────────────────────

const shampooActives = [
  "aloe vera juice",
  "sea kale extract",
  "ginkgo biloba leaf extract",
  "burdock root extract",
];

const conditionerActives = [
  "aloe vera juice",
  "hydrolyzed wheat protein",
  "argan oil",
  "sea kale extract",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionEyebrow({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs tracking-[0.2em] text-white/40">
        {index} {"//"}
      </span>
      <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
        {title}
      </h2>
    </div>
  );
}

function ActivesList({ actives }: { actives: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      {actives.map((active, i) => (
        <div key={active} className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/20 tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-xs text-white/50 lowercase">{active}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Product Cards ────────────────────────────────────────────────────────────

function SingleProductCard({
  unit,
  name,
  size,
  func,
  price,
  image,
  actives,
  productId,
  isHighlighted,
}: {
  unit: string;
  name: string;
  size: string;
  func: string;
  price: number;
  image: string;
  actives: string[];
  productId: string;
  isHighlighted?: boolean;
}) {
  const product = CATALOG.find((p) => p.id === productId)!;
  const productPage = PRODUCTS.find((p) => p.id === productId);

  return (
    <div
      className={`flex flex-col border border-white/10 p-8 md:p-10 relative group transition-colors duration-500 ${isHighlighted ? "bg-white/[0.025]" : "hover:bg-white/[0.015]"
        }`}
    >
      {isHighlighted && (
        <span className="absolute -top-px left-8 -translate-y-1/2 bg-[#0D0D0D] px-3 text-[10px] font-mono tracking-[0.25em] text-white/60 lowercase">
          recommended
        </span>
      )}

      {/* unit label */}
      <span className="text-[10px] font-mono tracking-[0.2em] text-white/25 lowercase">
        {unit}
      </span>

      {/* image */}
      <div className="relative w-full aspect-[3/4] max-w-[180px] mx-auto mt-6 mb-8">
        <Image
          src={image}
          alt={`CORE. ${name}`}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 180px, 200px"
        />
      </div>

      {/* product name */}
      <div className="border-t border-white/[0.06] pt-6 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl md:text-2xl font-light lowercase text-white leading-snug">
            <span className="text-white font-normal">CORE.</span> {name}
          </h3>
          <p className="text-xs text-white/30 lowercase font-mono tracking-[0.1em]">
            {size}
          </p>
        </div>

        {/* function tag */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
          <span className="text-xs text-white/40 lowercase tracking-[0.05em]">
            {func}
          </span>
        </div>

        {/* key actives */}
        <div className="mt-3 border border-white/[0.06] p-4">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/25 lowercase">
            key actives
          </span>
          <div className="mt-3">
            <ActivesList actives={actives} />
          </div>
        </div>
      </div>

      {/* price + CTA */}
      <div className="mt-auto pt-6 flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl md:text-3xl font-light text-white">
            €{price.toFixed(2)}
          </span>
          <span className="text-xs text-white/25 font-mono lowercase">eur</span>
        </div>
        <ShopAddToCart product={product} />
        {productPage && (
          <Link
            href={`/products/${productPage.slug}`}
            className="text-center text-[10px] font-mono tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors duration-200 lowercase py-1"
          >
            view product details
          </Link>
        )}
      </div>
    </div>
  );
}

function DuoCard() {
  const duoProduct = CATALOG.find((p) => p.id === "duo-system-001")!;

  return (
    <div className="border border-white/20 bg-white/[0.02] p-8 md:p-10 relative flex flex-col lg:flex-row gap-10 group">
      <span className="absolute -top-px left-8 -translate-y-1/2 bg-[#0D0D0D] px-3 text-[10px] font-mono tracking-[0.25em] text-white lowercase">
        system 001 / bundle
      </span>

      {/* Duo image group */}
      <div className="flex items-center justify-center lg:w-[280px] shrink-0">
        <div className="relative flex items-end justify-center gap-4 h-[260px] w-full max-w-[260px]">
          <div className="relative w-[45%] h-full">
            <Image
              src="/images/shampoo-front.png"
              alt="CORE. daily balancing shampoo"
              fill
              className="object-contain transition-transform duration-700 group-hover:translate-y-[-4px]"
              sizes="130px"
            />
          </div>
          <div className="flex items-center self-center mb-4">
            <span
              className="text-white/40 font-extralight leading-none"
              style={{ fontSize: "1.2rem" }}
              aria-hidden="true"
            >
              +
            </span>
          </div>
          <div className="relative w-[45%] h-full">
            <Image
              src="/images/conditioner-front.png"
              alt="CORE. daily nourishing conditioner"
              fill
              className="object-contain transition-transform duration-700 group-hover:translate-y-[4px]"
              sizes="130px"
            />
          </div>
        </div>
      </div>

      {/* Duo info */}
      <div className="flex flex-col flex-1 gap-6 justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/30 lowercase">
            system 001
          </span>
          <h3 className="text-2xl md:text-3xl font-light text-white lowercase leading-snug">
            <span className="font-normal">CORE.</span> the duo
          </h3>
          <p className="text-sm text-white/40 lowercase leading-relaxed">
            shampoo + conditioner. the complete daily system.
            engineered to work in sequence - cleanse, then seal.
          </p>

          {/* spec pills */}
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              "2 × 290 ml",
              "ph 4.5 - 5.5",
              "ecocert cosmos natural",
              "eu engineered",
            ].map((tag) => (
              <span
                key={tag}
                className="border border-white/10 px-3 py-1 text-[10px] font-mono tracking-[0.15em] text-white/40 lowercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Included items list */}
        <div className="flex flex-col gap-0 border border-white/[0.07]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-white/70 lowercase">daily balancing shampoo</span>
              <span className="text-[10px] font-mono text-white/25">unit 01 / 290ml</span>
            </div>
            <span className="text-xs text-white/30 font-mono">€28.00</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-white/70 lowercase">daily nourishing conditioner</span>
              <span className="text-[10px] font-mono text-white/25">unit 02 / 290ml</span>
            </div>
            <span className="text-xs text-white/30 font-mono">€28.00</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-light text-white">€44.95</span>
            <span className="text-sm text-white/30 line-through">€56.00</span>
            <span className="text-xs font-mono text-white/40 lowercase border border-white/10 px-2 py-0.5">
              save €11.05
            </span>
          </div>
          <ShopAddToCart product={duoProduct} label="add the duo" />
        </div>
      </div>
    </div>
  );
}

// ─── Spec Grid ────────────────────────────────────────────────────────────────

const specs = [
  { key: "volume", value: "290ml × 2" },
  { key: "ph range", value: "4.5 - 5.5" },
  { key: "scent", value: "juicy fruits / warm woods" },
  { key: "origin", value: "netherlands / eu" },
  { key: "certification", value: "ecocert cosmos" },
  { key: "natural origin", value: "98 - 99%" },
  { key: "silicones", value: "0" },
  { key: "sulfates", value: "0" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <Navbar />

      {/* ── Hero band ── */}
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex flex-col gap-6 max-w-3xl">
            <SectionEyebrow index="01" title="shop" />
            <p className="text-sm text-white/35 lowercase max-w-lg leading-relaxed">
              the v1 system. clinical, ph-balanced formulations built from a short
              list of natural actives. nothing hidden behind a blend name. engineered
              in the netherlands.
            </p>
            {/* certification badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { icon: "/icons/vegan.svg", label: "vegan" },
                { icon: "/icons/badge-check.svg", label: "cruelty-free" },
                { icon: "/icons/ban.svg", label: "silicone-free" },
                { icon: "/icons/leaf.svg", label: "ecocert cosmos natural" },
                { icon: "/icons/ban.svg", label: "sulfate-free" },
              ].map((b) => (
                <span
                  key={b.label}
                  className="flex items-center gap-2 border border-white/10 px-3 py-1.5 text-[10px] font-mono tracking-[0.15em] text-white/50 lowercase"
                >
                  <img
                    src={b.icon}
                    alt=""
                    className="h-3 w-3 opacity-60"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Product grid ── */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-32 border-b border-white/10">
        <div className="flex items-center justify-between mb-12">
          <span className="text-xs font-mono tracking-[0.2em] text-white/30 lowercase">
            v1 lineup / 3 products
          </span>
          <span className="text-xs font-mono tracking-[0.15em] text-white/20 lowercase">
            290ml formulation
          </span>
        </div>

        {/* Singles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10 mb-8">
          <SingleProductCard
            unit="unit 01"
            name="daily balancing shampoo"
            size="290 ml / 9.81 fl oz"
            func="cleanse & scalp equilibrium"
            price={28.00}
            image="/images/shampoo-front.png"
            actives={shampooActives}
            productId="shampoo-290"
          />
          <SingleProductCard
            unit="unit 02"
            name="daily nourishing conditioner"
            size="290 ml / 9.81 fl oz"
            func="repair, lipids & weightless seal"
            price={28.00}
            image="/images/conditioner-front.png"
            actives={conditionerActives}
            productId="conditioner-290"
            isHighlighted
          />
        </div>

        {/* Duo bundle */}
        <DuoCard />
      </section>

      {/* ── Technical spec grid ── */}
      <section className="border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-xs tracking-[0.2em] text-white/40">
              02 //
            </span>
            <h2 className="text-xl font-light lowercase text-white">
              formulation specs
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/10">
            {specs.map((s) => (
              <div
                key={s.key}
                className="border-r border-b border-white/10 p-6 flex flex-col gap-2 hover:bg-white/[0.015] transition-colors duration-300"
              >
                <span className="text-[10px] font-mono tracking-[0.2em] text-white/25 lowercase">
                  {s.key}
                </span>
                <span className="text-sm text-white/70 lowercase">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shipping & trust block ── */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-14 md:py-20 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/[0.06]">
          {[
            {
              icon: "/icons/truck.svg",
              title: "free shipping",
              desc: "on all orders over €50. tracked delivery.",
            },
            {
              icon: "/icons/leaf.svg",
              title: "natural origin",
              desc: "98-99% natural origin actives. ecocert cosmos certified.",
            },
            {
              icon: "/icons/flask-conical.svg",
              title: "engineered in the eu",
              desc: "formulated and bottled in latvia.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`flex flex-col gap-4 p-8 ${i < 2 ? "md:border-r border-b md:border-b-0 border-white/[0.06]" : ""
                }`}
            >
              <img
                src={item.icon}
                alt=""
                className="w-5 h-5 opacity-30"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-white/70 lowercase">{item.title}</span>
                <p className="text-xs text-white/30 lowercase leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
