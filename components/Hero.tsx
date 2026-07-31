import Image from "next/image";
import Link from "next/link";
import ProductHoverViewer from "./ProductHoverViewer";

const shampooMarkers = [
  { icon: "/icons/volume.svg", label: "vol: 290ml", top: "8%", left: "-10%" },
  { icon: "/icons/ph-level.svg", label: "ph 4.5 - 5.5", top: "46%", left: "80%" },
  { icon: "/icons/dropper-precision.svg", label: "precise dosage", top: "86%", left: "-10%" },
];

const conditionerMarkers = [
  { icon: "/icons/volume.svg", label: "vol: 290ml", top: "8%", left: "82%" },
  { icon: "/icons/ph-level.svg", label: "ph 4.5 - 5.5", top: "46%", left: "-14%" },
  { icon: "/icons/dropper-precision.svg", label: "precise dosage", top: "86%", left: "82%" },
];

export default function Hero() {
  return (
    <section className="relative pt-16 md:pt-20 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px] pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-white/35 pb-8 md:pb-14 border-b border-white/10">
          <span>core. / system 001</span>
          <span className="hidden sm:inline">technical hair care.</span>
          <span>lat 51.92 / lon 4.47</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 py-14 md:py-20 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-[15vw] sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.86] tracking-tighter font-light lowercase text-white">
              refined
              <br />
              to the core.
            </h1>
            <p className="mt-8 max-w-md text-white/50 text-base md:text-lg leading-relaxed lowercase">
              technical hair care, engineered right. a shampoo and
              conditioner system built from 98-99% natural origin actives,
              zero shortcuts.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link
              href="/shop/duo"
              className="group flex items-center justify-between px-8 py-4 border border-white bg-white text-[#0D0D0D] text-sm tracking-[0.2em] lowercase hover:bg-transparent hover:text-white transition-colors duration-300"
            >
              <span>[ shop the duo ]</span>
              <img
                src="/icons/arrow-right.svg"
                alt=""
                className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300 invert group-hover:invert-0"
              />
            </Link>
            <Link
              href="#formula"
              className="flex items-center justify-between px-8 py-4 border border-white/20 text-sm tracking-[0.2em] lowercase text-white/60 hover:text-white hover:border-white/40 transition-colors duration-300"
            >
              <span>[ see the formulation ]</span>
              <span className="font-mono text-white/30">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] border-t border-white/10">
        <Image
          src="/images/v1-hero-duo.png"
          alt="core. shampoo and conditioner duo on volcanic rock"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/10" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28 border-b border-white/10">
        <div className="flex items-center gap-4 mb-14">
          <span className="font-mono text-xs tracking-[0.2em] text-white/30">
            inspect /
          </span>
          <h2 className="text-2xl md:text-3xl font-light lowercase text-white">
            every angle, every active.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-10">
          <div>
            <span className="block text-center text-[10px] font-mono tracking-[0.2em] text-white/30 lowercase mb-8">
              unit 01 / shampoo
            </span>
            <ProductHoverViewer
              frontSrc="/images/shampoo-front.png"
              backSrc="/images/shampoo-back.png"
              alt="core. daily balancing shampoo"
              markers={shampooMarkers}
            />
          </div>
          <div>
            <span className="block text-center text-[10px] font-mono tracking-[0.2em] text-white/30 lowercase mb-8">
              unit 02 / conditioner
            </span>
            <ProductHoverViewer
              frontSrc="/images/conditioner-front.png"
              backSrc="/images/conditioner-back.png"
              alt="core. daily nourishing conditioner"
              markers={conditionerMarkers}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
