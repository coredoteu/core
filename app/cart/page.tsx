import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "02 // your system — CORE.",
  description:
    "review and manage your CORE. system. add, adjust, remove. proceed to checkout when ready.",
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <Navbar />
      <CartPageClient />
    </main>
  );
}
