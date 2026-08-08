import type { Metadata } from "next";

import ScienceContent from "@/components/sections/ScienceContent";

export const metadata: Metadata = {
  title: "science / 02 - CORE.",
  description:
    "the formulation philosophy, active compound index, and clinical parameters behind the CORE. system.",
  openGraph: {
    title: "science / 02 - CORE.",
    description:
      "the formulation philosophy, active compound index, and clinical parameters behind the CORE. system.",
    url: "https://bycore.eu/science",
  },
};

export default function SciencePage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans overflow-x-hidden">

      <ScienceContent />
    </main>
  );
}
