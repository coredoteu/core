"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { CATALOG } from "@/lib/catalog";
import { QuantityControl } from "@/components/cart/QuantityControl";
import { FREE_SHIPPING_THRESHOLD_EUR } from "@/lib/constants";

// ─── Quantity Control ─────────────────────────────────────────────────────────



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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr_auto_auto] items-start gap-6 py-8 border-b border-white/[0.07] last:border-b-0"
    >
      <div className="relative aspect-[3/4] w-full bg-white/[0.025] border border-white/[0.05] overflow-hidden flex items-center justify-center">
        {isDuo ? (
          <div className="flex items-center justify-center w-full h-full gap-0.5 px-1 py-2">
            <div className="relative flex-1 h-full">
              <Image src="/images/shampoo-front.png" alt="shampoo" fill className="object-contain" sizes="50px" />
            </div>
            <div className="relative flex-1 h-full">
              <Image src="/images/conditioner-front.png" alt="conditioner" fill className="object-contain" sizes="50px" />
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image src={product.image} alt={product.name} fill className="object-contain" sizes="100px" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
            {product.unit}
          </span>
          <h3 className="text-base md:text-lg font-light text-white lowercase leading-snug">
            <span className="font-normal uppercase">CORE.</span> {product.name}
          </h3>
          <span className="text-xs text-white/60 lowercase">{product.size}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-1 h-1 rounded-[50%] bg-white/15 shrink-0" />
          <span className="text-[11px] text-white/60 lowercase">{product.function}</span>
        </div>

        <div className="flex items-center gap-4 mt-3 md:hidden">
          <QuantityControl
            quantity={quantity}
            onDecrement={() => updateQuantity(product.id, quantity - 1)}
            onIncrement={() => updateQuantity(product.id, quantity + 1)}
          />
          <button
            onClick={() => removeItem(product.id)}
            className="text-[10px] font-mono tracking-[0.1em] text-white/60 hover:text-white/60 transition-colors duration-200 lowercase"
          >
            [ remove ]
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <QuantityControl
          quantity={quantity}
          onDecrement={() => updateQuantity(product.id, quantity - 1)}
          onIncrement={() => updateQuantity(product.id, quantity + 1)}
        />
      </div>

      <div className="hidden md:flex flex-col items-end gap-3">
        <span className="text-base font-light text-white tabular-nums">
          €{(product.price * quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeItem(product.id)}
          className="text-[10px] font-mono tracking-[0.12em] text-white/60 hover:text-white/60 transition-colors duration-200 lowercase"
        >
          [ remove ]
        </button>
      </div>
    </motion.div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-32 px-6 text-center">
      <div className="w-16 h-16 opacity-10">
        <img
          src="/icons/cart-large-minimalistic.svg"
          alt=""
          className="w-full h-full"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-lg font-light text-white/60 lowercase">
          your system is empty.
        </p>
        <p className="text-sm text-white/60 lowercase font-mono tracking-[0.1em]">
          no products added yet.
        </p>
      </div>
      <Link
        href="/shop"
        className="mt-2 border border-white/20 px-8 py-4 text-xs font-mono tracking-[0.2em] text-white/60 hover:text-white hover:border-white/40 transition-colors duration-300 lowercase"
      >
        [ explore the shop ]
      </Link>
    </div>
  );
}

// ─── Suggested Products ──────────────────────────────────────────────────────

function SuggestedProducts({ currentIds }: { currentIds: string[] }) {
  const suggestions = CATALOG.filter((p) => !currentIds.includes(p.id)).slice(0, 2);
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 mb-8">
        <span className="font-mono text-xs tracking-[0.2em] text-white/60">
          also //
        </span>
        <span className="text-sm text-white/60 lowercase">you may want</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {suggestions.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-5 border border-white/[0.07] p-5 hover:border-white/15 transition-colors duration-300"
          >
            <div className="relative w-14 h-16 shrink-0">
              <Image src={p.image} alt={p.name} fill className="object-contain" sizes="56px" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-[10px] font-mono text-white/60 lowercase">{p.unit}</span>
              <span className="text-sm text-white/70 lowercase leading-snug truncate">
                <span className="uppercase">CORE.</span> {p.name}
              </span>
              <span className="text-xs text-white/60">€{p.price.toFixed(2)}</span>
            </div>
            <Link
              href="/shop"
              className="text-[10px] font-mono tracking-[0.1em] text-white/60 hover:text-white/70 transition-colors duration-200 lowercase shrink-0"
            >
              [ add ]
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CartPageClient() {
  const { items, subtotal, clearCart } = useCart();
  const isEmpty = items.length === 0;

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD_EUR - subtotal);
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_EUR;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-24">

      <div className="flex items-start justify-between gap-4 mb-12 md:mb-16 pb-8 border-b border-white/10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.2em] text-white/60">02 //</span>
            <h1 className="text-3xl md:text-4xl font-light text-white lowercase tracking-tight">
              your system
            </h1>
          </div>
          {!isEmpty && (
            <p className="text-xs text-white/60 lowercase font-mono tracking-[0.1em] pl-[3.5rem]">
              {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
            </p>
          )}
        </div>
        {!isEmpty && (
          <button
            onClick={clearCart}
            className="text-[10px] font-mono tracking-[0.12em] text-white/60 hover:text-white/60 transition-colors duration-200 lowercase mt-1"
          >
            [ clear all ]
          </button>
        )}
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-24 items-start">

          <div className="flex-1 min-w-0">
            <div className="mb-8 border border-white/[0.06] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-[0.15em] text-white/60 lowercase">
                  {qualifiesForFreeShipping
                    ? "free shipping unlocked"
                    : `add €${freeShippingRemaining.toFixed(2)} for free shipping`}
                </span>
                <span className={`text-[10px] font-mono lowercase ${qualifiesForFreeShipping ? "text-white/60" : "text-white/60"}`}>
                  {qualifiesForFreeShipping ? "pass" : "pending"}
                </span>
              </div>
              <div className="h-px bg-white/[0.06] relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white/30"
                  initial={false}
                  animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_EUR) * 100)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="hidden md:grid grid-cols-[100px_1fr_auto_auto] gap-6 mb-2 pb-3 border-b border-white/[0.06]">
              {["product", "", "qty", "total"].map((h, i) => (
                <span key={i} className="text-[10px] font-mono tracking-[0.2em] text-white/60 lowercase">
                  {h}
                </span>
              ))}
            </div>

            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemRow key={item.product.id} item={item} />
              ))}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <Link
                href="/shop"
                className="flex items-center gap-2 text-xs font-mono tracking-[0.15em] text-white/60 hover:text-white/60 transition-colors duration-200 lowercase group"
              >
                <img
                  src="/icons/arrow-left.svg"
                  alt=""
                  className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200"
                  style={{ filter: "brightness(0) invert(1)", opacity: 0.35 }}
                />
                [ continue shopping ]
              </Link>
            </div>

            <SuggestedProducts currentIds={items.map((i) => i.product.id)} />
          </div>

          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 sticky top-28">
            <div className="border border-white/10">
              <div className="px-7 py-5 border-b border-white/[0.07] bg-white/[0.015]">
                <span className="text-xs font-mono tracking-[0.2em] text-white/60 lowercase">
                  order summary
                </span>
              </div>

              <div className="px-7 py-6 flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-white/60 lowercase">
                        <span className="uppercase">CORE.</span> {item.product.name}
                      </span>
                      <span className="text-[10px] font-mono text-white/60">
                        × {item.quantity}
                      </span>
                    </div>
                    <span className="text-xs text-white/60 tabular-nums shrink-0">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/[0.07] mx-7" />

              <div className="px-7 py-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60 lowercase font-mono tracking-[0.1em]">
                    subtotal
                  </span>
                  <span className="text-sm text-white tabular-nums">
                    €{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60 lowercase font-mono tracking-[0.1em]">
                    shipping
                  </span>
                  <span className="text-xs text-white/60 lowercase font-mono">
                    {qualifiesForFreeShipping ? "free" : "calculated at checkout"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60 lowercase font-mono tracking-[0.1em]">
                    tax
                  </span>
                  <span className="text-xs text-white/60 lowercase font-mono">
                    included
                  </span>
                </div>
              </div>

              <div className="h-px bg-white/10 mx-7" />

              <div className="px-7 py-5 flex items-center justify-between">
                <span className="text-xs font-mono tracking-[0.15em] text-white/60 lowercase">
                  total
                </span>
                <span className="text-xl font-light text-white tabular-nums">
                  €{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="px-7 pb-7 flex flex-col gap-3">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items }),
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        console.error(data.error);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="w-full py-4 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 active:bg-white/80 transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/60 focus-visible:outline-offset-2"
                >
                  [ proceed to checkout ]
                </button>
                <Link
                  href="/shop"
                  className="w-full py-3 border border-white/15 text-white/60 text-xs font-mono tracking-[0.15em] lowercase hover:border-white/30 hover:text-white/60 transition-colors duration-300 text-center"
                >
                  [ continue shopping ]
                </Link>
              </div>

              <div className="px-7 pb-6 flex flex-col gap-2.5">
                <div className="h-px bg-white/[0.06] mb-1" />
                {[
                  { icon: "/icons/lock.svg", text: "secure checkout" },
                  { icon: "/icons/truck.svg", text: `free shipping over €${FREE_SHIPPING_THRESHOLD_EUR}` },
                  { icon: "/icons/leaf.svg", text: "natural origin / eu certified" },
                ].map((trust) => (
                  <div key={trust.text} className="flex items-center gap-2.5">
                    <img
                      src={trust.icon}
                      alt=""
                      className="w-3.5 h-3.5 opacity-20"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
                    <span className="text-[10px] font-mono tracking-[0.12em] text-white/60 lowercase">
                      {trust.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
