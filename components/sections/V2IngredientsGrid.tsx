"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const ingredients = [
  { name: "baobab protein",   function: "cuticle repair & strength",  id: "v2-01" },
  { name: "plant squalane",   function: "moisture lock & shine",      id: "v2-02" },
  { name: "marshmallow root", function: "instant slip & detangle",    id: "v2-03" },
  { name: "organic aloe vera",function: "deep core hydration",        id: "v2-04" },
];

export default function V2IngredientsGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="border-t border-white/10 mt-12 md:mt-0 pt-12 md:pt-0">
      <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/10 bg-white/[0.02]">
        <span className="font-mono text-[10px] tracking-[0.25em] text-white/30 lowercase">
          v2 active ingredients grid
        </span>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border-b border-white/10">
        {ingredients.map((ing, idx) => (
          <motion.div
            key={ing.id}
            className="p-6 md:p-8 flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[160px] relative cursor-crosshair overflow-hidden group bg-[#0D0D0D]"
            onHoverStart={() => setHoveredIdx(idx)}
            onHoverEnd={() => setHoveredIdx(null)}
          >
            <motion.div
              className="absolute inset-0 bg-white/5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIdx === idx ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />

            <span className="font-mono text-[9px] tracking-[0.2em] text-white/20 lowercase z-10 group-hover:text-white/40 transition-colors">
              id: {ing.id}
            </span>

            <div className="z-10 mt-auto">
              <h4 className="text-sm md:text-base font-medium text-white/90 lowercase mb-1 group-hover:text-white transition-colors">
                {ing.name}
              </h4>
              <p className="font-mono text-[10px] text-white/40 lowercase group-hover:text-white/70 transition-colors">
                {ing.function}
              </p>
            </div>

            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/30 group-hover:border-white/70 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
