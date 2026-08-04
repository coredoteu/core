import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FREE_SHIPPING_THRESHOLD_EUR } from "@/lib/constants";
import SingleProductCard from "@/components/product/SingleProductCard";
import DuoCard from "@/components/product/DuoCard";
import { SHAMPOO_INGREDIENT_LIST, CONDITIONER_INGREDIENT_LIST } from "@/lib/content";

export const metadata: Metadata = {
  title: "shop / 01 — CORE.",
  description:
    "the v1 system. clinical, ph-balanced formulations engineered for scalp and strand precision. shop the CORE. daily lineup.",
};

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
            <SectionHeader index="01" title="shop" />
            <p className="text-sm text-white/60 lowercase max-w-lg leading-relaxed">
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
                  className="flex items-center gap-2 border border-white/10 px-3 py-1.5 text-[10px] font-mono tracking-[0.15em] text-white/60 lowercase"
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
          <span className="text-xs font-mono tracking-[0.2em] text-white/60 lowercase">
            v1 lineup / 3 products
          </span>
          <span className="text-xs font-mono tracking-[0.15em] text-white/60 lowercase">
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
            actives={SHAMPOO_INGREDIENT_LIST}
            productId="shampoo-290"
          />
          <SingleProductCard
            unit="unit 02"
            name="daily nourishing conditioner"
            size="290 ml / 9.81 fl oz"
            func="repair, lipids & weightless seal"
            price={28.00}
            image="/images/conditioner-front.png"
            actives={CONDITIONER_INGREDIENT_LIST}
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
            <span className="font-mono text-xs tracking-[0.2em] text-white/60">
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
                <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
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
              desc: `on all orders over €${FREE_SHIPPING_THRESHOLD_EUR}. tracked delivery.`,
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
                <p className="text-xs text-white/60 lowercase leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
