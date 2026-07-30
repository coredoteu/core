import Image from "next/image";
import Link from "next/link";

// ─── Nav links ────────────────────────────────────────────────────────────────
const navLeft = ["shop", "science", "routine"] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      {/* ──────────────────────────────────────────────────────────────────────
          HEADER
      ────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0D0D0D]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between relative">
          {/* Left — nav links */}
          <nav className="flex items-center gap-8 z-10">
            {navLeft.map((label) => (
              <Link
                key={label}
                href={`/${label}`}
                className="text-sm tracking-widest lowercase text-white/70 hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Centre — logo */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <Image
              src="/CORE_logo_trans.svg"
              alt="CORE."
              width={160}
              height={38}
              className="h-6 md:h-7 lg:h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Right — locale + cart */}
          <div className="flex items-center gap-6 z-10">
            <span className="text-sm tracking-widest lowercase text-white/70 cursor-default select-none">
              eu&nbsp;/&nbsp;eur&nbsp;(€)
            </span>
            <Link
              href="/cart"
              className="text-sm tracking-widest lowercase text-white/70 hover:text-white transition-colors duration-200"
            >
              cart&nbsp;(0)
            </Link>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────
          HERO
      ────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* ── Left column ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* Tagline */}
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 lowercase">
              refined to the core.
            </p>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.08] tracking-tight lowercase text-white">
              technical, high-performance hair care.{" "}
              <span className="text-white/50">
                engineered for scalp and strand perfection.
              </span>
            </h1>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-2">
              {/* Primary */}
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center px-8 py-3 border border-white/90 text-sm tracking-[0.2em] lowercase text-white bg-transparent hover:bg-white hover:text-[#0D0D0D] transition-all duration-300"
              >
                shop the duo
              </Link>

              {/* Secondary */}
              <Link
                href="/science"
                className="inline-flex items-center justify-center px-8 py-3 text-sm tracking-[0.2em] lowercase text-white/50 hover:text-white transition-colors duration-300"
              >
                explore ingredients
              </Link>
            </div>
          </div>

          {/* ── Right column ────────────────────────────────────────────────── */}
          <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-[600px]">
            <Image
              src="/hero-shot.png"
              alt="CORE. hero — high-performance hair care"
              fill
              className="object-cover rounded-lg border border-white/10"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────
          01 / THE COMPARISON
      ────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-4 text-center items-center">
            <span className="text-xs tracking-[0.2em] text-neutral-400 lowercase">
              [ the comparison ]
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
              core vs. traditional
            </h2>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 max-w-5xl mx-auto w-full">
            {/* Traditional Column */}
            <div className="flex flex-col gap-8 p-8 md:p-12 md:rounded-l-2xl border border-white/5 bg-neutral-900/10 text-neutral-500 relative backdrop-blur-sm">
              <h3 className="text-xl tracking-wide lowercase">traditional hair care</h3>
              <ul className="flex flex-col gap-6 text-sm">
                <li className="flex items-start gap-4">
                  <span className="text-neutral-600 mt-0.5">×</span>
                  <span>synthetic silicones & sulfates</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-neutral-600 mt-0.5">×</span>
                  <span>strips natural scalp barrier</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-neutral-600 mt-0.5">×</span>
                  <span>80% water & cheap fillers</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-neutral-600 mt-0.5">×</span>
                  <span>harsh chemical fragrance</span>
                </li>
              </ul>
            </div>

            {/* CORE Column */}
            <div className="flex flex-col gap-8 p-8 md:p-12 md:rounded-r-2xl border border-white/20 bg-neutral-900/60 shadow-[0_0_30px_rgba(255,255,255,0.03)] text-white relative z-10 md:-ml-px md:scale-[1.02] backdrop-blur-md">
              <h3 className="text-xl tracking-wide lowercase">core. engineered</h3>
              <ul className="flex flex-col gap-6 text-sm">
                <li className="flex items-start gap-4">
                  <span className="text-white/70 mt-0.5">+</span>
                  <span>100% natural botanical actives</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-white/70 mt-0.5">+</span>
                  <span>ph-balanced scalp & strand protection</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-white/70 mt-0.5">+</span>
                  <span>zero silicones, sulfates or dyes</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-white/70 mt-0.5">+</span>
                  <span>pure essential oil complex</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────
          02 / THE HERO PRODUCT
      ────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Product Showcase */}
          <div className="relative aspect-square w-full bg-neutral-900/30 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden backdrop-blur-sm">
             {/* Subdued radial gradient for high-end lighting effect */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
             <span className="text-xs tracking-[0.2em] text-neutral-600 lowercase z-10">[ product set showcase ]</span>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs tracking-[0.2em] text-neutral-400 lowercase">
                01 / complete system
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight lowercase text-white">
                the complete duo.
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-neutral-400 lowercase max-w-md">
                shampoo + conditioner engineered to reset your hair routine. 100% natural, maximum performance.
              </p>
            </div>

            {/* Spec Badges */}
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 text-xs tracking-widest text-white border border-white/20 rounded-full bg-white/5 lowercase">
                [ 100% natural ]
              </span>
              <span className="px-4 py-2 text-xs tracking-widest text-neutral-400 border border-white/10 rounded-full bg-transparent lowercase">
                [ 250ml x 2 ]
              </span>
              <span className="px-4 py-2 text-xs tracking-widest text-neutral-400 border border-white/10 rounded-full bg-transparent lowercase">
                [ daily use ]
              </span>
            </div>

            {/* Price & CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-6 pt-8 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-3xl font-light tracking-tight text-white">€52.00</span>
                <span className="text-xs tracking-wide text-neutral-500 lowercase mt-1">save €4 vs individual</span>
              </div>
              
              <Link
                href="/shop/duo"
                className="group flex items-center justify-center px-10 py-4 bg-white text-[#0D0D0D] border border-white text-sm tracking-[0.2em] lowercase hover:bg-transparent hover:text-white transition-all duration-300 w-full sm:w-auto"
              >
                [ add duo to cart ]
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────
          03 / ENGINEERED STANDARDS
      ────────────────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 py-8 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            
            <div className="flex flex-col gap-2 pt-6 sm:pt-0 sm:px-6 first:pt-0 first:px-0 lg:pl-0 lg:pr-6">
              <span className="text-xs tracking-widest text-white lowercase">100% natural formula</span>
              <span className="text-xs tracking-wide text-neutral-500 lowercase">zero synthetic compromises</span>
            </div>
            
            <div className="flex flex-col gap-2 pt-6 sm:pt-0 sm:px-6">
              <span className="text-xs tracking-widest text-white lowercase">ph 4.5 - 5.5</span>
              <span className="text-xs tracking-wide text-neutral-500 lowercase">optimal scalp equilibrium</span>
            </div>
            
            <div className="flex flex-col gap-2 pt-6 sm:pt-0 sm:px-6">
              <span className="text-xs tracking-widest text-white lowercase">cruelty free & vegan</span>
              <span className="text-xs tracking-wide text-neutral-500 lowercase">ethically synthesized</span>
            </div>
            
            <div className="flex flex-col gap-2 pt-6 sm:pt-0 sm:pl-6 sm:pr-0 lg:pr-0">
              <span className="text-xs tracking-widest text-white lowercase">engineered in europe</span>
              <span className="text-xs tracking-wide text-neutral-500 lowercase">swiss-inspired precision</span>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
