import Link from "next/link";
import Image from "next/image";

import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import ProductHoverSection from "@/components/product/ProductHoverSection";
import ThreeStepSystem from "@/components/sections/ThreeStepSystem";
import dynamic from "next/dynamic";
import SystemSpecSheet from "@/components/product/SystemSpecSheet";

const V2SneakPeek = dynamic(() => import("@/components/sections/V2SneakPeek"));
const FaqSection = dynamic(() => import("@/components/sections/FaqSection"));
const WaitlistForm = dynamic(
  () => import("@/components/sections/WaitlistForm"),
);
import { SectionHeader } from "@/components/ui/SectionHeader";

const traditionalRows = [
  "synthetic silicones & sulfates",
  "strips your natural scalp barrier",
  "80% water, cheap fillers",
  "harsh chemical fragrance",
];

const coreRows = [
  "98-99% natural origin actives",
  "ph-balanced, protects scalp & strand",
  "zero silicones, sulfates or dyes",
  "pure essential oil complex",
];

const standards = [
  { value: "98-99%", label: "natural origin formula" },
  { value: "4.5-5.5", label: "ph balanced equilibrium" },
  { value: "0", label: "synthetic compromises" },
  { value: "eu", label: "engineered & bottled" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <Hero />

      <Ticker />
      <SystemSpecSheet />
      <ThreeStepSystem />
      <ProductHoverSection />

      {}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36 border-b border-hairline">
        <SectionHeader index="04" title="the comparison" />

        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2">
          <div className="border border-hairline md:border-r-0 p-8 md:p-14">
            <span className="text-xs font-mono tracking-[0.2em] text-text-muted">
              baseline
            </span>
            <h3 className="mt-4 text-2xl md:text-3xl font-light lowercase text-text-muted">
              traditional hair care
            </h3>
            <ul className="mt-10 flex flex-col divide-y divide-white/5">
              {traditionalRows.map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between py-4 text-sm text-text-muted lowercase"
                >
                  <span>{row}</span>
                  <span className="font-mono text-text-muted text-xs">
                    fail
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-white/20 bg-white/[0.02] p-8 md:p-14 relative">
            <span className="absolute -top-px left-8 -translate-y-1/2 bg-[#0D0D0D] px-3 flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-white">
              CORE. spec
            </span>
            <h3 className="mt-4 text-2xl md:text-3xl font-light text-white flex items-center gap-3">
              <Image
                src="/CORE_logo_trans.svg"
                alt="CORE."
                width={110}
                height={26}
                className="h-5 md:h-7 w-auto"
              />{" "}
              engineered
            </h3>
            <ul className="mt-10 flex flex-col divide-y divide-white/10">
              {coreRows.map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between py-4 text-sm text-white lowercase"
                >
                  <span>{row}</span>
                  <span className="font-mono text-text-muted text-xs">
                    pass
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {}
      <section className="border-b border-hairline bg-[#0D0D0D]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <SectionHeader index="05" title="standards" />

          <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-hairline">
            {standards.map((s) => (
              <div
                key={s.label}
                className="border-r border-b border-hairline p-8 flex flex-col gap-2"
              >
                <span className="text-3xl md:text-4xl font-light tracking-tight text-white">
                  {s.value}
                </span>
                <span className="text-xs tracking-[0.15em] text-text-muted lowercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
      <V2SneakPeek />

      {}
      <section id="waitlist" className="bg-[#0D0D0D]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28 border-b border-hairline">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            <h3 className="text-3xl md:text-5xl font-light tracking-tight lowercase max-w-lg">
              get early access to the next system drop.
            </h3>
            <WaitlistForm />
          </div>
        </div>
      </section>
    </main>
  );
}
