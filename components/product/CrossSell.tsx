import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function CrossSell({ currentSlug }: { currentSlug: string }) {
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
              <span className="uppercase">CORE.</span> {link.name}
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
