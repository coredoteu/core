import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import SystemSpecSheet from "@/components/SystemSpecSheet";
import V2SneakPeek from "@/components/V2SneakPeek";

// ─── Data ───────────────────────────────────────────────────────────────────
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

const footerLinks = ["shop", "science", "roadmap", "cart"];

// ─── Small presentational primitives ───────────────────────────────────────
function SectionEyebrow({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs tracking-[0.2em] text-white/40">
        {index} /
      </span>
      <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
        {title}
      </h2>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      {/* ──────────────────────────────────────────────────────────────────
          HEADER & NAVBAR
      ────────────────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ──────────────────────────────────────────────────────────────────
          HERO & PRODUCT HOVER INSPECTOR
      ────────────────────────────────────────────────────────────────── */}
      <Hero />

      {/* ──────────────────────────────────────────────────────────────────
          MARQUEE TICKER
      ────────────────────────────────────────────────────────────────── */}
      <Ticker />

      {/* ──────────────────────────────────────────────────────────────────
          02 / THE COMPARISON
      ────────────────────────────────────────────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36 border-b border-white/10">
        <SectionEyebrow index="02" title="the comparison" />

        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2">
          <div className="border border-white/10 md:border-r-0 p-8 md:p-14">
            <span className="text-xs font-mono tracking-[0.2em] text-white/30">
              [ baseline ]
            </span>
            <h3 className="mt-4 text-2xl md:text-3xl font-light lowercase text-white/40">
              traditional hair care
            </h3>
            <ul className="mt-10 flex flex-col divide-y divide-white/5">
              {traditionalRows.map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between py-4 text-sm text-white/35 lowercase"
                >
                  <span>{row}</span>
                  <span className="font-mono text-white/20 text-xs">fail</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-white/20 bg-white/[0.02] p-8 md:p-14 relative">
            <span className="absolute -top-px left-8 -translate-y-1/2 bg-[#0D0D0D] px-3 text-[10px] font-mono tracking-[0.25em] text-white lowercase">
              [ core. spec ]
            </span>
            <h3 className="mt-4 text-2xl md:text-3xl font-light lowercase text-white">
              core. engineered
            </h3>
            <ul className="mt-10 flex flex-col divide-y divide-white/10">
              {coreRows.map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between py-4 text-sm text-white lowercase"
                >
                  <span>{row}</span>
                  <span className="font-mono text-white/60 text-xs">pass</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          SYSTEM SPEC SHEET (PRODUCTS, ADD TO CART, ACTIVES)
      ────────────────────────────────────────────────────────────────── */}
      <SystemSpecSheet />

      {/* ──────────────────────────────────────────────────────────────────
          03 / STANDARDS
      ────────────────────────────────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#0D0D0D]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <SectionEyebrow index="03" title="standards" />

          <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10">
            {standards.map((s) => (
              <div
                key={s.label}
                className="border-r border-b border-white/10 p-8 flex flex-col gap-2"
              >
                <span className="text-3xl md:text-4xl font-light tracking-tight text-white">
                  {s.value}
                </span>
                <span className="text-xs tracking-[0.15em] text-white/40 lowercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          04 / WHAT COMES NEXT
      ────────────────────────────────────────────────────────────────── */}
      <V2SneakPeek />

      {/* ──────────────────────────────────────────────────────────────────
          FOOTER
      ────────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0D0D0D]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            <h3 className="text-3xl md:text-5xl font-light tracking-tight lowercase max-w-lg">
              get early access to the next system drop.
            </h3>
            <form className="flex items-stretch border border-white/20 max-w-md w-full lg:ml-auto">
              <input
                type="email"
                placeholder="you@domain.com"
                className="flex-1 bg-transparent px-4 py-4 text-sm text-white placeholder:text-white/30 lowercase outline-none"
              />
              <button
                type="submit"
                className="px-6 text-sm tracking-[0.15em] lowercase bg-white text-[#0D0D0D] hover:bg-white/90 transition-colors duration-300"
              >
                notify me
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/30 font-mono tracking-[0.1em] lowercase">
            © {new Date().getFullYear()} core. refined to the core.
          </span>
          <div className="flex items-center gap-6">
            {footerLinks.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className="text-xs tracking-[0.15em] text-white/40 hover:text-white transition-colors duration-300 lowercase"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}