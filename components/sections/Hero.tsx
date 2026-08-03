import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-16 md:pt-20 overflow-visible">
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px] pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-white/60 pb-8 md:pb-14 border-b border-white/10">
          <span>CORE. // system 001</span>
          <span className="hidden sm:inline">technical hair care.</span>
          <span>lat 51.92 // lon 4.47</span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 py-14 md:py-20 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-[15vw] sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.86] tracking-tighter font-light lowercase text-white">
              refined
              <br />
              to the core.
            </h1>
            <p className="mt-8 text-white/60 text-base md:text-lg leading-relaxed lowercase max-w-sm sm:max-w-md lg:max-w-none">
              technical hair care, engineered right.
              a shampoo and conditioner system
              built from 98-99% natural origin
              actives, zero shortcuts.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link
              href="/shop"
              className="group flex items-center justify-between px-8 py-4 border border-white bg-white text-[#0D0D0D] text-sm tracking-[0.2em] lowercase hover:bg-transparent hover:text-white active:scale-[0.98] transition-all duration-300"
            >
              <span>[ shop the duo ]</span>
              <img
                src="/icons/arrow-right.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
                style={{ filter: "brightness(0)" }}
              />
            </Link>
            <Link
              href="#formula"
              className="flex items-center justify-between px-8 py-4 border border-white/20 text-sm tracking-[0.2em] lowercase text-white/60 hover:text-white hover:border-white/40 active:scale-[0.98] transition-all duration-300"
            >
              <span>[ see the formulation ]</span>
              <span className="font-mono text-white/60">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className="relative z-0 border-t border-white/10 pointer-events-none mb-0 md:mb-4 lg:mb-8"
        style={{
          marginLeft: "calc(-1 * max(0px, (100vw - 1600px) / 2))",
          marginRight: "calc(-1 * max(0px, (100vw - 1600px) / 2))",
        }}
      >
        <div className="relative w-full overflow-hidden aspect-[4/3] lg:aspect-[21/9]">
          <div className="absolute inset-0">
            <Image
              src="/images/v1-hero-duo.png"
              alt="CORE. shampoo and conditioner duo on volcanic rock"
              fill
              className="object-cover object-center lg:object-contain lg:object-center"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 90%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 0%, black 90%, transparent 100%)",
              }}
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/10" />
        </div>
      </div>
    </section>
  );
}
