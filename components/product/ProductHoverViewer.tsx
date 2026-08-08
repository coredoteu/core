"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Marker = {
  icon: string;
  label: string;
  top: string;
  left: string;
};

export default function ProductHoverViewer({
  frontSrc,
  backSrc,
  alt,
  markers,
}: {
  frontSrc: string;
  backSrc: string;
  alt: string;
  markers: Marker[];
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group relative aspect-[3/4] w-full max-w-xs mx-auto focus-within:outline-none"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-6 border border-hairline" />

      <div
        className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] md:group-hover:[transform:rotateY(180deg)] md:group-focus-within:[transform:rotateY(180deg)] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={frontSrc}
            alt={`${alt}, front label`}
            fill
            className="object-contain p-10"
            sizes="(min-width: 768px) 320px, 70vw"
          />
        </div>

        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Image
            src={backSrc}
            alt={`${alt}, ingredient panel`}
            fill
            className="object-contain p-10"
            sizes="(min-width: 768px) 320px, 70vw"
          />

          {markers.map((m) => (
            <div
              key={m.label}
              className="absolute flex items-center gap-2"
              style={{ top: m.top, left: m.left }}
            >
              <span className="h-px w-4 bg-white/40" />
              <span className="flex items-center gap-1.5 border border-white/20 bg-background/90 backdrop-blur-sm px-2 py-1">
                <Icon src={m.icon} size={12} opacity={0.7} />
                <span className="text-[10px] font-mono tracking-[0.1em] text-white/80 lowercase whitespace-nowrap">
                  [ {m.label} ]
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={
          flipped ? `show ${alt} front label` : `show ${alt} ingredient panel`
        }
        className="absolute inset-0 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      />

      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-[0.2em] text-text-muted lowercase whitespace-nowrap">
        [ tap or hover to inspect ]
      </span>
    </div>
  );
}
