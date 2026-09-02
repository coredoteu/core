"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import CustomCursor from "@/components/layout/CustomCursor";
import CartDrawer from "@/components/cart/CartDrawer";
import MobileStickyCart from "@/components/cart/MobileStickyCart";
import Footer from "@/components/layout/Footer";
import CookieDisclaimer from "@/components/layout/CookieDisclaimer";
import { ChatWidget } from "@/components/ChatWidget";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <CustomCursor />
      <CartDrawer />
      <MobileStickyCart />
      <CookieDisclaimer />
      <ChatWidget />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </>
  );
}
