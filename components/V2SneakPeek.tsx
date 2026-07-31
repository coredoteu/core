"use client";

import Image from "next/image";
import { useState } from "react";

// ─── Static data ──────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function V2SneakPeek() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="roadmap"
      className="border-b border-white/10 bg-[#0D0D0D] overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36">

        {/* ── Eyebrow / section label ───────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.2em] text-white/40">
            04 //
          </span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
            what comes next
          </h2>
        </div>

        {/* ── Main grid ─────────────────────────────────────────────────── */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-2 border border-white/10">

          {/* ── LEFT: classified log ────────────────────────────────────── */}
          <div className="border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">

            {/* Folder header */}
            <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                {/* Traffic-light dots */}
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-white/30 lowercase">
                  project v2 // stealth black edition
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.15em] text-white/20 lowercase">
                live
              </span>
            </div>

            {/* System log lines */}
            <div className="flex-1 px-6 md:px-8 py-6 flex flex-col gap-3">
              {logLines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-start gap-4"
                >
                  <span className="font-mono text-[10px] text-white/20 shrink-0 mt-px">
                    {line.id}
                  </span>
                  <span
                    className={`font-mono text-xs leading-relaxed lowercase ${
                      line.redact
                        ? "text-transparent bg-white/20 select-none rounded-sm px-1"
                        : "text-white/50"
                    }`}
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Status nodes at the bottom */}
            <div className="border-t border-white/10 grid grid-cols-3 divide-x divide-white/10">
              {statusNodes.map((node) => (
                <div key={node.key} className="px-5 py-4 flex flex-col gap-1">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/25 lowercase">
                    {node.key}
                  </span>
                  <span className="font-mono text-[11px] text-white/60 lowercase">
                    {node.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: silhouette + narrative + CTA ─────────────────────── */}
          <div className="flex flex-col">

            {/* Image panel */}
            <div className="relative flex-1 min-h-[300px] md:min-h-[360px] flex items-center justify-center overflow-hidden bg-[#080808]">

              {/* Scan-line overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
                }}
              />

              {/* Radial vignette */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.85) 100%)",
                }}
              />

              {/* Corner crosshairs */}
              <CrosshairCorners />

              {/* Product silhouette */}
              <div className="relative z-20 w-40 md:w-52 aspect-[1/2.4]">
                <Image
                  src="/images/v2-silhouette.png"
                  alt="core. v2 stealth black edition silhouette"
                  fill
                  className="object-contain brightness-[0.06] contrast-150 blur-[1.5px] saturate-0"
                  sizes="(max-width: 768px) 160px, 208px"
                />
                {/* Glow behind the silhouette */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-white/5 blur-3xl rounded-full" />
              </div>

              {/* Redacted label floating over image */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
                <span className="font-mono text-[9px] tracking-[0.3em] text-white/20 lowercase px-3 py-1 border border-white/10 bg-[#0D0D0D]/60 backdrop-blur-sm">
                  [ image redacted ]
                </span>
              </div>
            </div>

            {/* Narrative + CTA panel */}
            <div className="border-t border-white/10 px-6 md:px-8 py-8 flex flex-col gap-6">

              {/* Classification tag */}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-white/25 lowercase">
                  build in public // v2 roadmap
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* Narrative copy */}
              <p className="text-sm text-white/50 lowercase leading-relaxed max-w-prose">
                we are launching lean. every v1 purchase directly funds the
                custom formulation and matte black tooling of v2.
              </p>

              {/* CTA */}
              <button
                id="v2-waitlist-cta"
                aria-label="join the v2 waitlist"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                  group self-start relative font-mono text-xs tracking-[0.25em] lowercase
                  px-6 py-3.5 border transition-all duration-300 ease-out
                  ${
                    isHovered
                      ? "border-white/50 text-white shadow-[0_0_20px_rgba(255,255,255,0.08),inset_0_0_20px_rgba(255,255,255,0.03)]"
                      : "border-white/15 text-white/50"
                  }
                `}
              >
                {/* Animated sweep line top-left to right */}
                <span
                  className="absolute top-0 left-0 h-[1px] bg-white transition-all duration-500 ease-out"
                  style={{ width: isHovered ? "100%" : "0%" }}
                />
                {/* Animated sweep line bottom-right to left */}
                <span
                  className="absolute bottom-0 right-0 h-[1px] bg-white transition-all duration-500 ease-out"
                  style={{ width: isHovered ? "100%" : "0%" }}
                />

                <span className="relative z-10">[ join the v2 waitlist ]</span>
              </button>

              {/* Small disclaimer */}
              <p className="font-mono text-[9px] tracking-[0.15em] text-white/20 lowercase">
                no spam. one announcement. when it drops, you will know.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Sub-component: corner crosshair decorators ───────────────────────────────

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
        <span
          key={i}
          className={`absolute ${pos} z-20 pointer-events-none opacity-20`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M0 6H5M6 0V5M6 7V12M7 6H12" stroke="white" strokeWidth="0.75" />
          </svg>
        </span>
      ))}
    </>
  );
}
