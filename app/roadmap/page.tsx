import type { Metadata } from "next";

import RoadmapContent from "@/components/sections/RoadmapContent";

export const metadata: Metadata = {
  title: "roadmap / 03 - CORE.",
  description:
    "the technical progression from the v1 lab white launch system to the v2/v3 stealth black custom batch, and what comes after.",
  openGraph: {
    title: "roadmap / 03 - CORE.",
    description:
      "the technical progression from the v1 lab white launch system to the v2/v3 stealth black custom batch, and what comes after.",
    url: "https://bycore.eu/roadmap",
  },
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans overflow-x-hidden">

      <RoadmapContent />
    </main>
  );
}
