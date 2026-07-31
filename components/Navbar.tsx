import Link from "next/link";
import Image from "next/image";

const navLinks = ["shop", "science", "roadmap"] as const;

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0D0D0D]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0D0D0D]/50">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* 1. SVG Logo — replaces plain "CORE." text */}
        <Link href="/" className="shrink-0 flex items-center" aria-label="CORE. home">
          <Image
            src="/CORE_logo_trans.svg"
            alt="CORE."
            width={80}
            height={19}
            priority
            className="h-[18px] w-auto md:h-[22px]"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((label) => (
            <Link
              key={label}
              href={`/${label}`}
              className="text-xs tracking-[0.25em] lowercase text-white/50 hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* 2. Cart icon — white by default via filter */}
        <Link
          href="/cart"
          className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors duration-200"
          aria-label="shopping cart"
        >
          <img
            src="/icons/cart-large-minimalistic.svg"
            alt=""
            aria-hidden="true"
            className="h-5 w-5 opacity-80"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span className="text-xs font-mono tracking-[0.1em] text-white/40">
            (0)
          </span>
        </Link>
      </div>
    </header>
  );
}
