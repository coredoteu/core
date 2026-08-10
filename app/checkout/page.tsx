import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "checkout — CORE.",
  description: "complete your CORE. order securely.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <CheckoutClient />
    </main>
  );
}
