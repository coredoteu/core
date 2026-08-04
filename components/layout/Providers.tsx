"use client";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
