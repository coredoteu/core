"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGallery({
  images,
  name,
}: {
  images: { src: string; alt: string }[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-4 sticky top-28">
      <div className="relative w-full aspect-square bg-white/[0.02] border border-white/[0.06] overflow-hidden group">
        <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20 z-10" />
        <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/20 z-10" />
        <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/20 z-10" />
        <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20 z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Image
              src={images[selected].src}
              alt={images[selected].alt}
              fill
              className="object-contain p-10 transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <span className="absolute bottom-4 right-5 font-mono text-[10px] tracking-[0.2em] text-white/60">
          {String(selected + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`view ${img.alt}`}
              className={`relative flex-1 aspect-square border transition-all duration-300 overflow-hidden ${
                selected === i
                  ? "border-white/40"
                  : "border-white/[0.06] hover:border-white/20"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain p-3"
                sizes="120px"
              />
              {selected === i && (
                <span className="absolute inset-0 bg-white/[0.04]" />
              )}
            </button>
          ))}
        </div>
      )}

      <p className="font-mono text-[10px] tracking-[0.2em] text-white/15 lowercase text-center">
        <span className="uppercase">CORE.</span> — {name}
      </p>
    </div>
  );
}
