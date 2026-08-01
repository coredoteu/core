"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// ─── Backdrop ────────────────────────────────────────────────────────────────

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

// ─── Quantity Control ─────────────────────────────────────────────────────────

function QuantityControl({
  quantity,
  onDecrement,
  onIncrement,
}: {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex items-center gap-0 border border-white/15">
      <button
        onClick={onDecrement}
        aria-label="decrease quantity"
        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200 text-xs font-mono"
      >
        −
      </button>
      <span className="w-8 text-center text-xs font-mono text-white tabular-nums">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        aria-label="increase quantity"
        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-200 text-xs font-mono"
      >
        +
      </button>
    </div>
  );
}

// ─── Cart Item Row ────────────────────────────────────────────────────────────

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
      className="flex gap-4 py-6 border-b border-white/[0.07] last:border-b-0"
    >
      {/* product image */}
      <div className="relative shrink-0 w-16 h-20 bg-white/[0.03] border border-white/[0.06] overflow-hidden flex items-center justify-center">
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

      {/* product info */}
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] font-mono tracking-[0.2em] text-white/30 lowercase">
              {product.unit}
            </span>
            <span className="text-sm font-light text-white lowercase leading-snug">
              <span className="text-white">CORE.</span>{" "}
              {product.name}
            </span>
            <span className="text-[10px] text-white/30 lowercase mt-0.5">
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
          />
          <button
            onClick={() => removeItem(product.id)}
            className="text-[10px] font-mono tracking-[0.15em] text-white/25 hover:text-white/60 transition-colors duration-200 lowercase"
          >
            [ remove ]
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

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
        <p className="text-sm text-white/30 lowercase font-light">
          your system is empty.
        </p>
        <p className="text-xs text-white/20 lowercase font-mono tracking-[0.1em]">
          add products to begin.
        </p>
      </div>
      <Link
        href="/shop"
        onClick={onClose}
        className="mt-2 border border-white/20 px-6 py-3 text-xs font-mono tracking-[0.2em] text-white/60 hover:text-white hover:border-white/40 transition-colors duration-300 lowercase"
      >
        [ explore shop ]
      </Link>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

export default function CartDrawer() {
  const { items, subtotal, isDrawerOpen, closeDrawer } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const isEmpty = items.length === 0;

  // close on escape key
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen, closeDrawer]);

  // lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  const freeShippingRemaining = Math.max(0, 50 - subtotal);
  const qualifiesForFreeShipping = subtotal >= 50;

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
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[440px] bg-[#0D0D0D] border-l border-white/10 flex flex-col shadow-[−40px_0_80px_rgba(0,0,0,0.6)]"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.25em] text-white/30">
                  02 //
                </span>
                <h2 className="text-sm tracking-[0.15em] text-white lowercase">
                  your system
                </h2>
                {!isEmpty && (
                  <span className="font-mono text-[10px] text-white/30 tabular-nums">
                    ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                aria-label="close cart"
                className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors duration-200"
              >
                <img
                  src="/icons/alt-arrow-right.svg"
                  alt=""
                  className="w-4 h-4"
                  style={{ filter: "brightness(0) invert(1)", opacity: 0.5 }}
                />
              </button>
            </div>

            {/* ── Free shipping progress ── */}
            {!isEmpty && (
              <div className="px-7 py-3 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono tracking-[0.15em] text-white/30 lowercase">
                    {qualifiesForFreeShipping
                      ? "free shipping unlocked"
                      : `€${freeShippingRemaining.toFixed(2)} away from free shipping`}
                  </span>
                  {qualifiesForFreeShipping && (
                    <span className="text-[10px] font-mono text-white/50 lowercase">pass</span>
                  )}
                </div>
                <div className="h-px bg-white/[0.08] relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white/40"
                    initial={false}
                    animate={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* ── Items ── */}
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

            {/* ── Order Summary + Actions ── */}
            {!isEmpty && (
              <div className="shrink-0 border-t border-white/10 px-7 py-6 flex flex-col gap-5">
                {/* summary lines */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 lowercase font-mono tracking-[0.1em]">
                      subtotal
                    </span>
                    <span className="text-sm text-white tabular-nums font-light">
                      €{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 lowercase font-mono tracking-[0.1em]">
                      shipping
                    </span>
                    <span className="text-xs text-white/40 lowercase font-mono tracking-[0.05em]">
                      {qualifiesForFreeShipping ? "free" : "calculated at checkout"}
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60 lowercase font-mono tracking-[0.1em]">
                      total
                    </span>
                    <span className="text-base text-white tabular-nums font-light">
                      €{subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="group w-full flex items-center justify-center gap-3 py-4 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 transition-colors duration-300"
                >
                  [ proceed to checkout ]
                </Link>

                {/* trust indicators */}
                <div className="flex items-center justify-center gap-6">
                  <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.1em] text-white/25 lowercase">
                    <img
                      src="/icons/lock.svg"
                      alt=""
                      className="w-3 h-3"
                      style={{ filter: "brightness(0) invert(1)", opacity: 0.4 }}
                    />
                    secure checkout
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.1em] text-white/25 lowercase">
                    <img
                      src="/icons/truck.svg"
                      alt=""
                      className="w-3 h-3"
                      style={{ filter: "brightness(0) invert(1)", opacity: 0.4 }}
                    />
                    free shipping over €50
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
