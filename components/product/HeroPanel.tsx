import Link from "next/link";
import BatchCartSection from "@/components/product/BatchCartSection";
import { ProductPageData } from "@/lib/products";
import { CATALOG } from "@/lib/catalog";
import { Icon } from "@/components/ui/Icon";

export default function HeroPanel({ product }: { product: ProductPageData }) {
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
          <span className="text-white font-normal uppercase">CORE.</span>
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
        <BatchCartSection productId={product.id} product={catalogProduct} />
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
