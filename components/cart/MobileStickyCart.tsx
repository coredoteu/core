"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AddToCartButton from "@/components/product/AddToCartButton";
import { CATALOG } from "@/lib/catalog";

const duoProduct = CATALOG.find((p) => p.id === "duo-system-001")!;

export default function MobileStickyCart() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let isVisible = false;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
          }
        });
        setVisible(isVisible);
        window.dispatchEvent(
          new CustomEvent("mobileStickyCartChange", {
            detail: { visible: isVisible },
          }),
        );
      },
      { threshold: 0 },
    );

    const elements = document.querySelectorAll(
      "[data-mobile-sticky-trigger='true']",
    );
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      variants={{
        hidden: { y: "100%", opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-xl border-t border-hairline px-6 py-4 flex items-center justify-between"
    >
      <div className="flex flex-col">
        <span className="text-xs tracking-[0.2em] font-mono text-text-muted lowercase">
          system 001
        </span>
        <span className="text-sm font-light text-white">
          €{duoProduct.price.toFixed(2)}
        </span>
      </div>
      <AddToCartButton
        product={duoProduct}
        label="add the duo"
        className="py-2.5 px-4 text-xs"
      />
    </motion.div>
  );
}
