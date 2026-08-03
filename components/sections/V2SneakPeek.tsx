"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import V2IngredientsGrid from "@/components/sections/V2IngredientsGrid";
import { getFundingStats } from "@/app/actions/funding";

const logLines = [
  { id: "L01", text: "project_codename: void", redact: false },
  { id: "L02", text: "edition: stealth black", redact: false },
  { id: "L03", text: "tooling_status: [████████████]", redact: false },
  { id: "L04", text: "formula_lock: pending v1 funding threshold", redact: false },
  { id: "L05", text: "clearance: restricted", redact: true },
  { id: "L06", text: "est. drop: q4 // undisclosed", redact: false },
];

const statusNodes = [
  { key: "classification", value: "top tier" },
  { key: "access", value: "waitlist only" },
  { key: "status", value: "in development" },
];

export default function V2SneakPeek() {
  const [isHovered, setIsHovered] = useState(false);
  const [funding, setFunding] = useState({ unlocked: 105, total: 250, isLoading: true });

  useEffect(() => {
    async function loadStats() {
      const stats = await getFundingStats();
      setFunding({ ...stats, isLoading: false });
    }
    loadStats();
  }, []);

  const percentage = Math.round((funding.unlocked / funding.total) * 100);

  return (
    <section id="roadmap" className="border-b border-white/10 bg-[#0D0D0D] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36">

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.2em] text-white/60">07 //</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
            what comes next
          </h2>
        </div>

        <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-2 border border-white/10">

          <div className="border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-[50%] bg-white/10" />
                  <span className="h-2 w-2 rounded-[50%] bg-white/10" />
                  <span className="h-2 w-2 rounded-[50%] bg-white/10" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-white/60 lowercase">
                  project v2 // stealth black edition
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.15em] text-white/60 lowercase">
                live
              </span>
            </div>

            <div className="flex-1 px-6 md:px-8 py-6 flex flex-col gap-3">
              {logLines.map((line) => (
                <div key={line.id} className="flex items-start gap-4">
                  <span className="font-mono text-[10px] text-white/60 shrink-0 mt-px">
                    {line.id}
                  </span>
                  <span
                    className={`font-mono text-xs leading-relaxed lowercase ${
                      line.redact
                        ? "text-transparent bg-white/20 select-none rounded-sm px-1"
                        : "text-white/60"
                    }`}
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 grid grid-cols-3 divide-x divide-white/10">
              {statusNodes.map((node) => (
                <div key={node.key} className="px-5 py-4 flex flex-col gap-1">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/60 lowercase">
                    {node.key}
                  </span>
                  <span className="font-mono text-[11px] text-white/60 lowercase">
                    {node.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="relative flex-1 min-h-[300px] md:min-h-[360px] flex items-center justify-center overflow-hidden bg-[#080808]">
              <div
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
                }}
              />
              <div
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.95) 100%)",
                }}
              />

              <CrosshairCorners />

              <div
                className="relative z-10 w-40 md:w-52 aspect-[1/2.4] -rotate-12 scale-110 transition-transform duration-[2000ms] hover:-rotate-6 hover:scale-125 ease-out"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                }}
              >
                <Image
                  src="/images/v2-silhouette.png"
                  alt="CORE. v2 stealth black edition silhouette"
                  fill
                  className="object-contain"
                  unoptimized
                  sizes="(max-width: 768px) 160px, 208px"
                />
              </div>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40">
                <span className="font-mono text-[9px] tracking-[0.3em] text-white/60 lowercase px-3 py-1 border border-white/10 bg-[#0D0D0D]/60 backdrop-blur-sm">
                  image redacted
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 md:px-8 py-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-white/60 lowercase">
                  build in public // v2 roadmap
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <p className="text-sm text-white/60 lowercase leading-relaxed max-w-prose">
                we are launching lean. every v1 purchase directly funds the
                custom formulation and matte black tooling of v2.
              </p>

              <div className="flex flex-col gap-2 my-2">
                <div className="flex items-center justify-between font-mono text-[10px] lowercase text-white/60">
                  <span>custom batch funding</span>
                  <span className="text-white">{percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white relative transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}>
                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
                <div className="font-mono text-[9px] tracking-[0.1em] text-white/60 lowercase mt-1">
                  {funding.unlocked} / {funding.total} pre-orders unlocked
                </div>
              </div>

              <button
                id="v2-waitlist-cta"
                aria-label="join the v2 waitlist"
                onClick={() => {
                  document.getElementById("waitlist-section")?.scrollIntoView({ behavior: "smooth" });
                  // Focus the email input after scrolling
                  setTimeout(() => {
                    document.getElementById("waitlist-email")?.focus();
                  }, 500);
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                  group self-start relative font-mono text-xs tracking-[0.25em] lowercase
                  px-6 py-3.5 border transition-all duration-300 ease-out active:scale-[0.98]
                  ${
                    isHovered
                      ? "border-white/50 text-white shadow-[0_0_20px_rgba(255,255,255,0.08),inset_0_0_20px_rgba(255,255,255,0.03)]"
                      : "border-white/15 text-white/60"
                  }
                `}
              >
                <span
                  className="absolute top-0 left-0 h-[1px] bg-white transition-all duration-500 ease-out"
                  style={{ width: isHovered ? "100%" : "0%" }}
                />
                <span
                  className="absolute bottom-0 right-0 h-[1px] bg-white transition-all duration-500 ease-out"
                  style={{ width: isHovered ? "100%" : "0%" }}
                />
                <span className="relative z-10">[ join the v2 waitlist ]</span>
              </button>

              <p className="font-mono text-[9px] tracking-[0.15em] text-white/60 lowercase">
                no spam. one announcement. when it drops, you will know.
              </p>
            </div>
          </div>

        </div>

        <V2IngredientsGrid />
      </div>
    </section>
  );
}

function CrosshairCorners() {
  const corners = [
    "top-3 left-3",
    "top-3 right-3 rotate-90",
    "bottom-3 left-3 -rotate-90",
    "bottom-3 right-3 rotate-180",
  ];
  return (
    <>
      {corners.map((pos, i) => (
        <span key={i} className={`absolute ${pos} z-20 pointer-events-none opacity-20`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M0 6H5M6 0V5M6 7V12M7 6H12" stroke="white" strokeWidth="0.75" />
          </svg>
        </span>
      ))}
    </>
  );
}
