"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductPageData } from "@/lib/products";

export default function ProductFAQ({ product }: { product: ProductPageData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-hairline py-20 md:py-32 bg-white/[0.015]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="mb-10 md:mb-14">
          <SectionHeader
            index="04"
            title="faq"
            icon="/icons/info-circle.svg"
            variant="compact"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-light lowercase text-white/80 leading-snug">
              common questions
            </h2>
            <p className="text-sm text-text-muted lowercase leading-relaxed">
              direct answers. no filler copy.
            </p>
          </div>

          <div className="flex flex-col gap-0 border border-hairline">
            {product.faqs.map((faq, i) => (
              <div
                key={i}
                className={
                  i < product.faqs.length - 1 ? "border-b border-hairline" : ""
                }
              >
                <button
                  id={`faq-${product.slug}-${i}`}
                  aria-controls={`faq-content-${product.slug}-${i}`}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group hover:bg-white/[0.02] transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/60 focus-visible:outline-offset-2"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      src="/icons/circle-question-mark.svg"
                      size={13}
                      opacity={openIndex === i ? 0.4 : 0.15}
                      className="transition-opacity duration-200"
                    />
                    <span className="text-sm text-text-muted lowercase leading-snug group-hover:text-white transition-colors duration-200">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <Icon
                      src="/icons/chevron-down.svg"
                      size={14}
                      opacity={0.3}
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      id={`faq-content-${product.slug}-${i}`}
                      role="region"
                      aria-labelledby={`faq-${product.slug}-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-3 px-6 pb-5">
                        <Icon
                          src="/icons/check-circle.svg"
                          size={13}
                          opacity={0.25}
                          className="mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-text-muted lowercase leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
