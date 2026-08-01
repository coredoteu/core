"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { CATALOG } from "@/lib/catalog";

const duoProduct = CATALOG.find((p) => p.id === "duo-system-001")!;

export default function MobileStickyCart() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 600) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      variants={{
        hidden: { y: "100%", opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center justify-between"
    >
      <div className="flex flex-col">
        <span className="text-xs tracking-[0.2em] font-mono text-white/40 lowercase">system 001</span>
        <span className="text-sm font-light text-white">€44.95</span>
      </div>
      <AddToCartButton product={duoProduct} label="add the duo" className="py-2.5 px-4 text-xs" />
    </motion.div>
  );
}
