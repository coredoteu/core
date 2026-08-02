"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "what makes CORE. different from salon brands?",
    a: "born from the frustration of high import costs and slow shipping of top-tier us brands to europe. CORE. is the uncompromising european alternative. we engineer our formulas with 98-99% natural actives, zero shortcuts.",
  },
  {
    q: "is the brand sustainable?",
    a: "yes. we formulate according to ecocert cosmos standards. our packaging is 100% recyclable, and our core actives are organically farmed without gmos or animal testing.",
  },
  {
    q: "why 'build in public'?",
    a: "transparency is part of our dna. we share our roadmap, formulations, and manufacturing constraints openly. your v1 purchases directly fund the custom matte black tooling for our v2 stealth edition.",
  },
  {
    q: "where are CORE. products manufactured?",
    a: "v1 formulas are developed and produced by our partners at selfnamed in latvia. as we scale, all v2 custom batches will be engineered and bottled directly in the netherlands.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const renderWithLogo = (text: string) => {
    const parts = text.split(/(CORE\.)/i);
    return parts.map((part, i) =>
      part.toUpperCase() === "CORE." ? (
        <Image
          key={i}
          src="/CORE_logo_trans.svg"
          alt="CORE."
          width={60}
          height={14}
          className="h-3 w-auto inline-block -translate-y-0.5"
        />
      ) : (
        part
      )
    );
  };

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36 border-b border-white/10">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.2em] text-white/40">06 //</span>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
          technical faq
        </h2>
      </div>

      <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
        <div className="lg:col-span-5">
          <p className="text-white/50 text-sm lowercase leading-relaxed max-w-sm">
            {renderWithLogo(
              "frequently asked questions regarding our brand philosophy, sustainability standards, and the CORE. roadmap."
            )}
          </p>
        </div>

        <div className="lg:col-span-7 flex flex-col border-t border-white/10">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/10">
              <button
                onClick={() => toggle(i)}
                className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
              >
                <span className="text-sm md:text-base text-white/80 lowercase group-hover:text-white transition-colors duration-300">
                  {renderWithLogo(faq.q)}
                </span>
                <span className="ml-4 shrink-0 text-white/30 font-mono text-lg font-light">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-sm text-white/50 lowercase leading-relaxed max-w-prose">
                      {renderWithLogo(faq.a)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
