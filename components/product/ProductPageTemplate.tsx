"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import AddToCartButton from "@/components/product/AddToCartButton";
import { ProductPageData } from "@/lib/products";
import { CATALOG } from "@/lib/catalog";

// ─── Icon helper ──────────────────────────────────────────────────────────────

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

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({
  index,
  title,
  icon,
}: {
  index: string;
  title: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-10 md:mb-14">
      <span className="font-mono text-[11px] tracking-[0.25em] text-white/60">
        {index} {"//"}
      </span>
      <Icon src={icon} size={13} opacity={0.2} />
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-[11px] font-mono tracking-[0.25em] text-white/60 lowercase">
        {title}
      </span>
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ProductGallery({
  images,
  name,
}: {
  images: { src: string; alt: string }[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-4 sticky top-28">
      <div className="relative w-full aspect-square bg-white/[0.02] border border-white/[0.06] overflow-hidden group">
        <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20 z-10" />
        <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/20 z-10" />
        <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/20 z-10" />
        <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20 z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Image
              src={images[selected].src}
              alt={images[selected].alt}
              fill
              className="object-contain p-10 transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <span className="absolute bottom-4 right-5 font-mono text-[10px] tracking-[0.2em] text-white/60">
          {String(selected + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`view ${img.alt}`}
              className={`relative flex-1 aspect-square border transition-all duration-300 overflow-hidden ${
                selected === i
                  ? "border-white/40"
                  : "border-white/[0.06] hover:border-white/20"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain p-3"
                sizes="120px"
              />
              {selected === i && (
                <span className="absolute inset-0 bg-white/[0.04]" />
              )}
            </button>
          ))}
        </div>
      )}

      <p className="font-mono text-[10px] tracking-[0.2em] text-white/15 lowercase text-center">
        CORE. — {name}
      </p>
    </div>
  );
}

// ─── Hero Panel ───────────────────────────────────────────────────────────────

function HeroPanel({ product }: { product: ProductPageData }) {
  const catalogProduct = CATALOG.find((p) => p.id === product.id)!;

  return (
    <div className="flex flex-col gap-8">
      <nav className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-white/60">
        <Link href="/" className="hover:text-white/60 transition-colors duration-200">
          home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white/60 transition-colors duration-200">
          shop
        </Link>
        <span>/</span>
        <span className="text-white/60">{product.name}</span>
      </nav>

      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/60 border border-white/10 px-3 py-1.5">
          {product.unit}
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/60">
          v1 catalog
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight leading-[1.05] tracking-tight lowercase">
          <span className="text-white font-normal">CORE.</span>
          <br />
          <span className="text-white/80">{product.name}</span>
        </h1>
        <p className="text-sm text-white/60 lowercase leading-relaxed max-w-sm mt-2">
          {product.tagline}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px border border-white/[0.06]">
        {[
          { icon: "/icons/layers-minimalistic.svg", label: "volume",       value: product.size },
          { icon: "/icons/wind.svg",                label: "scent profile", value: product.scent },
          { icon: "/icons/leaf.svg",                label: "natural origin",value: product.naturalOrigin },
          { icon: "/icons/atom.svg",                label: "system",        value: product.function },
        ].map((spec, i) => (
          <div
            key={spec.label}
            className={`p-4 flex flex-col gap-1.5 ${
              i % 2 === 1 ? "border-l border-white/[0.06]" : ""
            } ${i >= 2 ? "border-t border-white/[0.06]" : ""}`}
          >
            <div className="flex items-center gap-1.5">
              <Icon src={spec.icon} size={11} opacity={0.2} />
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 lowercase">
                {spec.label}
              </span>
            </div>
            <span className="text-sm text-white/60 lowercase">{spec.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {product.certifications.map((cert) => (
          <span
            key={cert.label}
            className="flex items-center gap-2 border border-white/[0.08] px-3 py-1.5 text-[10px] font-mono tracking-[0.15em] text-white/60 lowercase"
          >
            <Icon src="/icons/shield-check.svg" size={11} opacity={0.35} />
            {cert.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-white/[0.06]">
        <div className="flex items-baseline justify-between">
          <span className="text-4xl font-extralight text-white tracking-tight">
            €{product.price.toFixed(2)}
          </span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-mono text-white/60 lowercase">incl. vat</span>
            <span className="text-[10px] font-mono text-white/60 lowercase">free shipping over €50</span>
          </div>
        </div>
        <AddToCartButton
          product={catalogProduct}
          className="w-full py-4 text-sm tracking-[0.2em]"
        />
        <p className="text-[10px] font-mono text-white/60 lowercase text-center">
          secure checkout. free returns.
        </p>
      </div>

      <div className="border border-white/[0.06] p-4 flex items-start gap-3">
        <Icon src="/icons/target.svg" size={14} opacity={0.2} className="mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 lowercase">
            designed for
          </span>
          <p className="text-xs text-white/45 lowercase leading-relaxed">
            {product.targetAudience}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Formulation Section ──────────────────────────────────────────────────────

const ACTIVE_ICONS: Record<string, string> = {
  "aloe vera juice":              "/icons/droplet.svg",
  "sea kale extract":             "/icons/waves-horizontal.svg",
  "ginkgo biloba leaf extract":   "/icons/activity.svg",
  "burdock root extract":         "/icons/waterdrops.svg",
  "hydrolyzed wheat protein":     "/icons/wheat.svg",
  "argan oil":                    "/icons/droplets.svg",
};

function FormulationSection({ product }: { product: ProductPageData }) {
  return (
    <section className="border-t border-white/10 py-20 md:py-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <SectionLabel index="01" title="formulation" icon="/icons/flask-conical.svg" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Icon src="/icons/test-tube-minimalistic.svg" size={14} opacity={0.25} />
                <h2 className="text-2xl md:text-3xl font-light lowercase text-white/80 leading-snug">
                  key actives
                </h2>
              </div>
              <p className="text-sm text-white/60 lowercase leading-relaxed">
                every active is declared at a functional concentration. no filler
                claims. no proprietary blends hiding a half-percent trace.
              </p>
            </div>

            <div className="flex flex-col gap-0 border border-white/[0.06]">
              {product.claims.map((claim, i) => (
                <div
                  key={claim}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i < product.claims.length - 1 ? "border-b border-white/[0.05]" : ""
                  }`}
                >
                  <Icon src="/icons/check-circle.svg" size={12} opacity={0.2} />
                  <span className="text-xs text-white/60 lowercase">{claim}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-0">
            {product.actives.map((active, i) => {
              const icon = ACTIVE_ICONS[active.name] || "/icons/flask-round.svg";
              return (
                <motion.div
                  key={active.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-8 ${
                    i < product.actives.length - 1 ? "border-b border-white/[0.06]" : ""
                  }`}
                >
                  <div className="flex flex-col items-center pt-1 gap-2">
                    <div className="w-8 h-8 border border-white/[0.08] flex items-center justify-center shrink-0">
                      <Icon src={icon} size={14} opacity={0.35} />
                    </div>
                    {i < product.actives.length - 1 && (
                      <div className="flex-1 w-px bg-white/[0.06] min-h-[24px]" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base md:text-lg font-light text-white/90 lowercase tracking-tight">
                        {active.name}
                      </span>
                      <span className="font-mono text-[10px] text-white/15 tabular-nums shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 lowercase leading-relaxed max-w-sm">
                      {active.benefit}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Usage Section ────────────────────────────────────────────────────────────

const STEP_ICONS: Record<string, { shampoo: string; conditioner: string }> = {
  "01": { shampoo: "/icons/soap-dispenser-droplet.svg", conditioner: "/icons/dropper-minimalistic.svg" },
  "02": { shampoo: "/icons/bubbles.svg",                conditioner: "/icons/waterdrop.svg" },
  "03": { shampoo: "/icons/wind.svg",                   conditioner: "/icons/droplet.svg" },
};

function UsageSection({ product }: { product: ProductPageData }) {
  const isConditioner = product.id === "conditioner-290";

  return (
    <section className="border-t border-white/10 py-20 md:py-32 bg-white/[0.015]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <SectionLabel index="02" title="system usage" icon="/icons/layers-minimalistic.svg" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {product.usageSteps.map((step, i) => {
            const iconMap = STEP_ICONS[step.index];
            const icon = iconMap
              ? isConditioner ? iconMap.conditioner : iconMap.shampoo
              : "/icons/flask-conical.svg";

            return (
              <motion.div
                key={step.index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`flex flex-col gap-6 p-8 md:p-10 relative ${
                  i < product.usageSteps.length - 1
                    ? "border-b md:border-b-0 md:border-r border-white/[0.06]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-4xl font-extralight text-white/10 tabular-nums leading-none">
                    {step.index}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <div className="w-9 h-9 border border-white/[0.08] flex items-center justify-center shrink-0">
                    <Icon src={icon} size={16} opacity={0.3} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl md:text-3xl font-light lowercase text-white tracking-tight">
                    {step.label}
                  </h3>
                  <p className="text-sm text-white/60 lowercase leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 border border-white/[0.06] p-5 flex items-start gap-4">
          <Icon src="/icons/flask-conical.svg" size={16} opacity={0.2} className="mt-0.5" />
          <p className="text-xs text-white/60 lowercase leading-relaxed">
            for best results: use as a complete duo system. the shampoo opens
            and cleanses. the conditioner seals and nourishes. engineered to
            work in sequence.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Technical Specs / INCI ───────────────────────────────────────────────────

function TechnicalSpecsSection({ product }: { product: ProductPageData }) {
  const inciIngredients = product.inci.split(", ");

  const specRows = [
    { icon: "/icons/scan.svg",                key: "INCI STANDARD",  value: "eu cosmetics regulation 1223/2009" },
    { icon: "/icons/layers-minimalistic.svg", key: "VOLUME",         value: product.size },
    { icon: "/icons/activity.svg",            key: "PH RANGE",       value: "4.5 - 5.5" },
    { icon: "/icons/leaf.svg",                key: "NATURAL ORIGIN",  value: product.naturalOrigin },
    { icon: "/icons/map-pin-check.svg",       key: "ORIGIN",         value: "netherlands / eu" },
    { icon: "/icons/medal-star.svg",          key: "CERTIFICATION",  value: "ecocert cosmos natural" },
  ];

  return (
    <section className="border-t border-white/10 py-20 md:py-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <SectionLabel index="03" title="technical specs" icon="/icons/scan.svg" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-0 border border-white/[0.08]">
              {specRows.map((spec, i) => (
                <div
                  key={spec.key}
                  className={`flex items-start gap-4 px-5 py-4 ${
                    i < specRows.length - 1 ? "border-b border-white/[0.06]" : ""
                  }`}
                >
                  <Icon src={spec.icon} size={12} opacity={0.2} className="mt-[3px]" />
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                      {spec.key}
                    </span>
                    <span className="text-sm text-white/60 lowercase">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-white/[0.06] p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon src="/icons/wind.svg" size={12} opacity={0.2} />
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                  SCENT PROFILE
                </span>
              </div>
              <p className="text-sm text-white/60 lowercase">{product.scent}</p>
              <p className="text-xs text-white/60 lowercase leading-relaxed mt-1">
                phthalate-free. 100% natural raw material fragrance composition.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon src="/icons/microscope.svg" size={14} opacity={0.25} />
                <h3 className="text-lg font-light text-white/80 lowercase">
                  inci ingredient declaration
                </h3>
              </div>
              <p className="text-xs text-white/60 lowercase leading-relaxed">
                full transparency. listed highest to lowest concentration per eu
                cosmetics regulation.
              </p>
            </div>

            <div className="border border-white/[0.08]">
              <div className="grid grid-cols-[auto_1fr] border-b border-white/[0.08] px-5 py-3 bg-white/[0.02]">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 w-10">#</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60">INGREDIENT</span>
              </div>

              {inciIngredients.map((ing, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[auto_1fr] items-start gap-4 px-5 py-3 hover:bg-white/[0.015] transition-colors duration-200 ${
                    i < inciIngredients.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  <span className="font-mono text-[10px] text-white/15 tabular-nums w-10 pt-px">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-white/60 leading-relaxed">
                    {ing.trim()}
                  </span>
                </div>
              ))}

              <div className="px-5 py-3 border-t border-white/[0.08] bg-white/[0.02] flex items-center gap-2">
                <Icon src="/icons/info-circle.svg" size={11} opacity={0.2} />
                <p className="font-mono text-[10px] tracking-[0.1em] text-white/60 lowercase">
                  {product.inciNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────

function FAQSection({ product }: { product: ProductPageData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-white/10 py-20 md:py-32 bg-white/[0.015]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <SectionLabel index="04" title="faq" icon="/icons/info-circle.svg" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-light lowercase text-white/80 leading-snug">
              common questions
            </h2>
            <p className="text-sm text-white/60 lowercase leading-relaxed">
              direct answers. no filler copy.
            </p>
          </div>

          <div className="flex flex-col gap-0 border border-white/[0.06]">
            {product.faqs.map((faq, i) => (
              <div
                key={i}
                className={i < product.faqs.length - 1 ? "border-b border-white/[0.06]" : ""}
              >
                <button
                  id={`faq-${product.slug}-${i}`}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group hover:bg-white/[0.02] transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      src="/icons/circle-question-mark.svg"
                      size={13}
                      opacity={openIndex === i ? 0.4 : 0.15}
                      className="transition-opacity duration-200"
                    />
                    <span className="text-sm text-white/70 lowercase leading-snug group-hover:text-white transition-colors duration-200">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <Icon src="/icons/chevron-down.svg" size={14} opacity={0.3} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-3 px-6 pb-5">
                        <Icon
                          src="/icons/check-circle.svg"
                          size={13}
                          opacity={0.25}
                          className="mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-white/60 lowercase leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Cross-sell strip ─────────────────────────────────────────────────────────

function CrossSell({ currentSlug }: { currentSlug: string }) {
  const link =
    currentSlug === "daily-balancing-shampoo"
      ? {
          href: "/products/daily-nourishing-conditioner",
          unit: "unit 02",
          name: "daily nourishing conditioner",
          size: "290 ml / 9.81 fl oz",
          label: "pair it with the conditioner",
          image: "/images/conditioner-front.png",
        }
      : {
          href: "/products/daily-balancing-shampoo",
          unit: "unit 01",
          name: "daily balancing shampoo",
          size: "290 ml / 9.81 fl oz",
          label: "start with the shampoo",
          image: "/images/shampoo-front.png",
        };

  return (
    <section className="border-t border-white/10 py-16 md:py-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="flex items-center gap-3 mb-8">
          <Icon src="/icons/layers-minimalistic.svg" size={12} opacity={0.2} />
          <span className="font-mono text-[11px] tracking-[0.25em] text-white/60 lowercase">
            complete the system
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <Link
          href={link.href}
          className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-white/[0.06] p-6 md:p-8 hover:bg-white/[0.02] hover:border-white/20 transition-all duration-300"
        >
          <div className="relative w-20 h-20 shrink-0">
            <Image
              src={link.image}
              alt={link.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              sizes="80px"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 lowercase">
              {link.unit}
            </span>
            <span className="text-sm text-white/70 lowercase group-hover:text-white transition-colors duration-200">
              CORE. {link.name}
            </span>
            <span className="text-xs font-mono text-white/60 lowercase">
              {link.size}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.2em] text-white/60 group-hover:text-white/70 transition-colors duration-300 lowercase shrink-0">
            {link.label}
            <Icon
              src="/icons/arrow-right.svg"
              size={14}
              opacity={0.4}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}

// ─── Main Template ────────────────────────────────────────────────────────────

export default function ProductPageTemplate({
  product,
}: {
  product: ProductPageData;
}) {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `CORE. ${product.name}`,
            image: product.images.map((img) => `https://bycore.eu${img.src}`),
            description: product.tagline,
            sku: product.id,
            brand: {
              "@type": "Brand",
              name: "CORE."
            },
            offers: {
              "@type": "Offer",
              url: `https://bycore.eu/products/${product.slug}`,
              priceCurrency: "EUR",
              price: product.price,
              itemCondition: "https://schema.org/NewCondition",
              availability: "https://schema.org/InStock",
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: 0,
                  currency: "EUR"
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: {
                    "@type": "QuantitativeValue",
                    minValue: 0,
                    maxValue: 1,
                    unitCode: "d"
                  },
                  transitTime: {
                    "@type": "QuantitativeValue",
                    minValue: 1,
                    maxValue: 5,
                    unitCode: "d"
                  }
                }
              }
            }
          })
        }}
      />
      <Navbar />

      <section data-mobile-sticky-trigger="true" className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 items-start">
            <ProductGallery images={product.images} name={product.name} />
            <HeroPanel product={product} />
          </div>
        </div>
      </section>

      <FormulationSection product={product} />
      <UsageSection product={product} />
      <TechnicalSpecsSection product={product} />
      <FAQSection product={product} />
      <CrossSell currentSlug={product.slug} />
    </main>
  );
}
