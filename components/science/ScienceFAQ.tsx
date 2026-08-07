"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SCIENCE_FAQS } from "@/lib/content";

export default function ScienceFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-32 border-t border-hairline bg-[#0D0D0D]">
      <div className="max-w-[900px] mx-auto px-6 md:px-10">
        <div className="mb-12 md:mb-16">
          <SectionHeader index="04" title="frequently asked questions" variant="compact" />
        </div>

        <div className="flex flex-col border-t border-hairline">
          {SCIENCE_FAQS.map((faq, i) => (
            <div key={i} className="border-b border-hairline">
              <button
                onClick={() => toggleFaq(i)}
                aria-expanded={openFaq === i}
                aria-controls={`faq-content-${i}`}
                className="w-full py-6 flex items-center justify-between text-left group focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
              >
                <span className="text-sm md:text-base text-white/90 lowercase group-hover:text-white transition-colors duration-200">
                  {faq.q}
                </span>
                <span className="text-text-faint font-mono text-xl leading-none ml-6 group-hover:text-white transition-colors duration-200">
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    id={`faq-content-${i}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-text-muted lowercase leading-relaxed pb-8 max-w-2xl">
                      {faq.a}
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
