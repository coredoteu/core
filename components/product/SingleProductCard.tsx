import Image from "next/image";
import Link from "next/link";
import BatchCartSection from "@/components/product/BatchCartSection";
import { getCatalogProduct } from "@/lib/catalog";
import { PRODUCTS } from "@/lib/products";

export function ActivesList({ actives }: { actives: { code: string; name: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {actives.map((active, i) => (
        <div key={active.code} className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/60 tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-xs text-white/60 lowercase">{active.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function SingleProductCard({
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
  actives: { code: string; name: string }[];
  productId: string;
  isHighlighted?: boolean;
}) {
  const product = getCatalogProduct(productId);
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
      <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
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
            <span className="text-white font-normal uppercase">CORE.</span> {name}
          </h3>
          <p className="text-xs text-white/60 lowercase font-mono tracking-[0.1em]">
            {size}
          </p>
        </div>

        {/* function tag */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
          <span className="text-xs text-white/60 lowercase tracking-[0.05em]">
            {func}
          </span>
        </div>

        {/* key actives */}
        <div className="mt-3 border border-white/[0.06] p-4">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
            key actives
          </span>
          <div className="mt-3">
            <ActivesList actives={actives} />
          </div>
        </div>
      </div>

      {/* Dynamic Batch Add-to-Cart Section */}
      <div className="mt-auto pt-6 flex flex-col gap-4">
        <BatchCartSection productId={productId} product={product} />
        {productPage && (
          <Link
            href={`/products/${productPage.slug}`}
            className="text-center text-[10px] font-mono tracking-[0.2em] text-white/60 hover:text-white/60 transition-colors duration-200 lowercase py-1"
          >
            view product details
          </Link>
        )}
      </div>
    </div>
  );
}
