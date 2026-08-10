"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { QuantityControl } from "@/components/cart/QuantityControl";
import { FREE_SHIPPING_THRESHOLD_EUR } from "@/lib/constants";

function Backdrop({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

function CartItemRow({
  item,
}: {
  item: ReturnType<typeof useCart>["items"][number];
}) {
  const { removeItem, updateQuantity } = useCart();
  const { product, quantity } = item;
  const isDuo = product.id === "duo-system-001";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex gap-4 py-6 border-b border-hairline last:border-b-0"
    >
      <div className="relative shrink-0 w-16 h-20 bg-white/[0.03] border border-hairline overflow-hidden flex items-center justify-center">
        {isDuo ? (
          <div className="flex items-center justify-center w-full h-full gap-0.5 px-1">
            <div className="relative flex-1 h-full">
              <Image
                src="/images/shampoo-front.png"
                alt="shampoo"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <div className="relative flex-1 h-full">
              <Image
                src="/images/conditioner-front.png"
                alt="conditioner"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] font-mono tracking-[0.2em] text-text-muted lowercase">
              {product.unit}
            </span>
            <span className="text-sm font-light text-white lowercase leading-snug">
              <span className="text-white uppercase">CORE.</span> {product.name}
            </span>
            <span className="text-[10px] text-text-muted lowercase mt-0.5">
              {product.size}
            </span>
          </div>
          <span className="text-sm font-light text-white tabular-nums shrink-0">
            €{(product.price * quantity).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <QuantityControl
            quantity={quantity}
            onDecrement={() => updateQuantity(product.id, quantity - 1)}
            onIncrement={() => updateQuantity(product.id, quantity + 1)}
            size="sm"
          />
          <button
            onClick={() => removeItem(product.id)}
            className="text-[10px] font-mono tracking-[0.15em] text-text-muted hover:text-white/60 transition-colors duration-200 lowercase"
          >
            remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-16">
      <div className="relative w-16 h-20 opacity-10">
        <img
          src="/icons/cart-large-minimalistic.svg"
          alt=""
          className="w-full h-full"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>
      <div className="text-center flex flex-col gap-2">
        <p className="text-sm text-text-muted lowercase font-light">
          your system is empty.
        </p>
        <p className="text-xs text-text-muted lowercase font-mono tracking-[0.1em]">
          add products to begin.
        </p>
      </div>
      <Link
        href="/shop"
        onClick={onClose}
        className="mt-2 border border-white/20 px-6 py-3 text-xs font-mono tracking-[0.2em] text-text-muted hover:text-white hover:border-white/40 transition-colors duration-300 lowercase"
      >
        explore shop
      </Link>
    </div>
  );
}

export default function CartDrawer() {
  const { items, subtotal, isDrawerOpen, closeDrawer } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isEmpty = items.length === 0;
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isDrawerOpen) {
      if (previousFocusRef.current) previousFocusRef.current.focus();
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement;

    if (!drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable[0]) focusable[0].focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }
      if (e.key === "Tab" && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const freeShippingRemaining = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_EUR - subtotal,
  );
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_EUR;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <Backdrop onClose={closeDrawer} />

          <motion.div
            key="drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="02 // your system"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.32, 0, 0.08, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[440px] bg-[#0D0D0D] border-l border-hairline flex flex-col shadow-[-40px_0_80px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-hairline shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.25em] text-text-muted">
                  02
                </span>
                <h2 className="text-sm tracking-[0.15em] text-white lowercase">
                  your system
                </h2>
                {!isEmpty && (
                  <span className="font-mono text-[10px] text-text-muted tabular-nums">
                    ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                aria-label="close cart"
                className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white transition-colors duration-200"
              >
                <img
                  src="/icons/alt-arrow-right.svg"
                  alt=""
                  className="w-4 h-4"
                  style={{ filter: "brightness(0) invert(1)", opacity: 0.5 }}
                />
              </button>
            </div>

            {!isEmpty && (
              <div className="px-7 py-3 border-b border-hairline shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono tracking-[0.15em] text-text-muted lowercase">
                    {qualifiesForFreeShipping
                      ? "free shipping unlocked"
                      : `€${freeShippingRemaining.toFixed(2)} away from free shipping`}
                  </span>
                  {qualifiesForFreeShipping && (
                    <span className="text-[10px] font-mono text-text-muted lowercase">
                      pass
                    </span>
                  )}
                </div>
                <div className="h-px bg-white/[0.08] relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white/40"
                    initial={false}
                    animate={{
                      width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_EUR) * 100)}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-7">
              {isEmpty ? (
                <EmptyState onClose={closeDrawer} />
              ) : (
                <motion.div layout className="divide-y divide-white/[0.07]">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItemRow key={item.product.id} item={item} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {!isEmpty && (
              <div className="shrink-0 border-t border-hairline px-7 py-6 flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted lowercase font-mono tracking-[0.1em]">
                      subtotal
                    </span>
                    <span className="text-sm text-white tabular-nums font-light">
                      €{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted lowercase font-mono tracking-[0.1em]">
                      shipping
                    </span>
                    <span className="text-xs text-text-muted lowercase font-mono tracking-[0.05em]">
                      {qualifiesForFreeShipping
                        ? "free"
                        : "calculated at checkout"}
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted lowercase font-mono tracking-[0.1em]">
                      total
                    </span>
                    <span className="text-base text-white tabular-nums font-light">
                      €{subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {checkoutError && (
                  <p className="text-xs text-white font-mono text-center lowercase">
                    {checkoutError}
                  </p>
                )}

                <button
                  disabled={isLoading}
                  onClick={() => {
                    setIsLoading(true);
                    closeDrawer();
                    router.push("/checkout");
                  }}
                  className="group w-full flex items-center justify-center gap-3 py-4 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 disabled:opacity-50 transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/60 focus-visible:outline-offset-2"
                >
                  {isLoading ? "loading..." : "proceed to checkout"}
                </button>

                <div className="flex items-center justify-center gap-6">
                  <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.1em] text-text-muted lowercase">
                    <img
                      src="/icons/lock.svg"
                      alt=""
                      className="w-3 h-3"
                      style={{
                        filter: "brightness(0) invert(1)",
                        opacity: 0.4,
                      }}
                    />
                    secure checkout
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.1em] text-text-muted lowercase">
                    <img
                      src="/icons/truck.svg"
                      alt=""
                      className="w-3 h-3"
                      style={{
                        filter: "brightness(0) invert(1)",
                        opacity: 0.4,
                      }}
                    />
                    free shipping over €{FREE_SHIPPING_THRESHOLD_EUR}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
