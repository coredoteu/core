"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const shampooSteps = [
  {
    id: "01",
    title: "massage",
    description: "dispense 1-2 pumps. massage vigorously into wet scalp using fingertips.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="w-8 h-8"
      >
        <path d="M12 2C7.02944 2 3 6.02944 3 11C3 15.9706 7.02944 20 12 20C16.9706 20 21 15.9706 21 11" />
        <path d="M12 22V20" />
        <path d="M15 2L15 4" />
        <path d="M9 2L9 4" />
        <path d="M12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14C13.6569 14 15 12.6569 15 11" />
        <path d="M9 11H3" />
        <path d="M21 11H15" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "cleanse",
    description: "build a rich lather. ensure complete coverage from root to tip.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="w-8 h-8"
      >
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="6" cy="9" r="3" />
        <circle cx="16" cy="17" r="3" />
        <circle cx="8" cy="16" r="2" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "rinse",
    description: "rinse thoroughly with lukewarm water until water runs clear.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="w-8 h-8"
      >
        <path d="M12 4V16" />
        <path d="M8 12L12 16L16 12" />
        <path d="M7 8V12" />
        <path d="M4 10L7 13L10 10" />
        <path d="M17 8V12" />
        <path d="M14 10L17 13L20 10" />
      </svg>
    ),
  },
];

const conditionerSteps = [
  {
    id: "01",
    title: "apply",
    description: "dispense 1-2 pumps. distribute evenly through mid-lengths and ends.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="w-8 h-8"
      >
        <path d="M12 2L12 12" />
        <path d="M12 12L8 8" />
        <path d="M12 12L16 8" />
        <path d="M5 22H19" />
        <path d="M5 18H19" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "wait",
    description: "leave in for 2-3 minutes to allow actives to penetrate the cuticle.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="w-8 h-8"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4" />
        <path d="M10 10h4" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "rinse",
    description: "rinse thoroughly with cool water to seal the hair cuticle.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="w-8 h-8"
      >
        <path d="M12 4V16" />
        <path d="M8 12L12 16L16 12" />
        <path d="M7 8V12" />
        <path d="M4 10L7 13L10 10" />
        <path d="M17 8V12" />
        <path d="M14 10L17 13L20 10" />
      </svg>
    ),
  },
];

export default function ThreeStepSystem() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [activeUnit, setActiveUnit] = useState<"shampoo" | "conditioner">("shampoo");

  const currentSteps = activeUnit === "shampoo" ? shampooSteps : conditionerSteps;

  return (
    <section className="border-b border-white/10 bg-[#0D0D0D]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-[0.2em] text-white/40">
              02 //
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
              usage protocol
            </h2>
          </div>
          
          <div className="flex items-center border border-white/10 p-1">
            <button
              onClick={() => setActiveUnit("shampoo")}
              className={`px-6 py-2 font-mono text-[10px] tracking-[0.2em] lowercase transition-all duration-300 ${
                activeUnit === "shampoo" 
                  ? "bg-white text-[#0D0D0D]" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              unit 01 / shampoo
            </button>
            <button
              onClick={() => setActiveUnit("conditioner")}
              className={`px-6 py-2 font-mono text-[10px] tracking-[0.2em] lowercase transition-all duration-300 ${
                activeUnit === "conditioner" 
                  ? "bg-white text-[#0D0D0D]" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              unit 02 / conditioner
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 border-t border-l border-white/10">
          {currentSteps.map((step) => (
            <motion.div
              key={step.id}
              className="border-r border-b border-white/10 p-10 md:p-14 flex flex-col items-start relative group cursor-crosshair bg-white/[0.01]"
              onHoverStart={() => setActiveStep(step.id)}
              onHoverEnd={() => setActiveStep(null)}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-white/40 group-hover:text-white transition-colors duration-300">
                {step.icon}
              </div>
              <div className="mt-12 w-full">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-xs tracking-[0.2em] text-white/30">
                    {step.id}.
                  </span>
                  <h3 className="text-2xl font-light text-white tracking-tight lowercase">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-white/50 lowercase leading-relaxed max-w-[250px]">
                  {step.description}
                </p>
              </div>

              {/* Technical active state indicator */}
              <motion.div
                className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeStep === step.id ? 1 : 0.1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
