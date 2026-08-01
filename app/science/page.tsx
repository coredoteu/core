import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "science / coming soon — CORE.",
  description: "the formulation methodology and clinical data behind CORE.",
};

export default function SciencePage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24 pb-32">
        <span className="text-[10px] font-mono tracking-[0.25em] text-white/30 lowercase mb-8 border border-white/10 px-3 py-1">
          in development
        </span>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight lowercase text-white">
          science
        </h1>
        <div className="w-10 h-px bg-white/20 my-8 mx-auto"></div>
        <p className="text-sm text-white/40 max-w-md lowercase leading-relaxed mx-auto">
          we are refining our clinical data and formulation index. the complete science behind our v1 system will be published here shortly.
        </p>
      </div>
    </main>
  );
}
