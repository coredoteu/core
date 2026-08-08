"use client";

import { useState, useEffect, useRef } from "react";
import { useCart, CartProduct } from "@/context/CartContext";
import { Icon } from "@/components/ui/Icon";
import { STORE_CONFIG, PRICING } from "@/lib/storeConfig";

export type BatchPhase = "preorder" | "buffer" | "soldout";

export interface BatchCartSectionProps {
  productId: string;

  phase?: BatchPhase;

  product?: CartProduct;

  stockCount?: number;

  closeDate?: string;

  shipDate?: string;

  className?: string;
}

type ButtonStatus = "idle" | "adding" | "success";

function PriceDisplay({
  phase,
  productId,
}: {
  phase: BatchPhase;
  productId: string;
}) {
  const pricing = PRICING[productId];
  if (!pricing) return null;

  if (phase === "buffer") {
    const savings = pricing.valuePrice
      ? (pricing.valuePrice - pricing.regularPrice).toFixed(2)
      : null;
    return (
      <div className="flex items-baseline gap-3 flex-wrap">
        <span
          className="text-3xl font-light font-mono text-white tabular-nums"
          aria-label={`Price: €${pricing.regularPrice.toFixed(2)}`}
        >
          €{pricing.regularPrice.toFixed(2)}
        </span>
        {pricing.valuePrice && (
          <>
            <span
              className="text-sm font-mono text-text-faint line-through"
              aria-label={`Individual value: €${pricing.valuePrice.toFixed(2)}`}
            >
              €{pricing.valuePrice.toFixed(2)}
            </span>
            <span className="border border-hairline px-2 py-0.5 text-[10px] font-mono tracking-[0.15em] text-text-muted lowercase">
              save €{savings}
            </span>
          </>
        )}
      </div>
    );
  }

  const activeAriaLabel =
    phase === "preorder"
      ? `early bird price: €${pricing.preorderPrice.toFixed(2)}`
      : `batch 02 early bird price: €${pricing.preorderPrice.toFixed(2)}`;

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span
        className="text-3xl font-light font-mono text-white tabular-nums"
        aria-label={activeAriaLabel}
      >
        €{pricing.preorderPrice.toFixed(2)}
      </span>
      <span
        className="text-sm font-mono text-text-faint line-through"
        aria-label={`Regular price: €${pricing.regularPrice.toFixed(2)}`}
      >
        €{pricing.regularPrice.toFixed(2)}
      </span>
      {pricing.valuePrice && (
        <span
          className="text-sm font-mono text-text-faint line-through"
          aria-label={`Individual value: €${pricing.valuePrice.toFixed(2)}`}
        >
          €{pricing.valuePrice.toFixed(2)}
        </span>
      )}
      {phase === "preorder" && (
        <span className="border border-white/20 px-2 py-0.5 text-[10px] font-mono tracking-[0.2em] text-text-muted lowercase">
          pre-order deal
        </span>
      )}
    </div>
  );
}

function Subtext({
  phase,
  stockCount,
  closeDate,
  shipDate,
}: {
  phase: BatchPhase;
  stockCount?: number;
  closeDate?: string;
  shipDate?: string;
}) {
  if (phase === "preorder") {
    return (
      <p className="font-mono text-xs text-text-muted leading-relaxed">
        pre-orders close on {closeDate}. estimated shipping: {shipDate}.
      </p>
    );
  }

  if (phase === "buffer") {
    return (
      <p className="font-mono text-xs text-text-muted leading-relaxed">
        fresh batch in transit.{" "}
        {typeof stockCount === "number" ? (
          <>
            only{" "}
            <span className="text-white/80 tabular-nums">{stockCount}</span>{" "}
            {stockCount === 1 ? "unit" : "units"} remaining.
          </>
        ) : (
          "limited units remaining."
        )}
      </p>
    );
  }

  return (
    <p className="font-mono text-xs text-text-muted leading-relaxed">
      batch 01 completely sold out. reserve now for batch 02 (shipping
      mid-september).
    </p>
  );
}

export default function BatchCartSection({
  productId,
  phase = STORE_CONFIG.currentPhase,
  product,
  stockCount = STORE_CONFIG.stockCount,
  closeDate = STORE_CONFIG.closeDate,
  shipDate = STORE_CONFIG.shipDate,
  className = "",
}: BatchCartSectionProps) {
  const [btnStatus, setBtnStatus] = useState<ButtonStatus>("idle");
  const { addItem } = useCart();
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pricing = PRICING[productId];

  useEffect(() => {
    return () => timeoutRefs.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    setBtnStatus("idle");
  }, [phase]);

  function handleAddToCart() {
    if (!product || btnStatus === "adding") return;
    setBtnStatus("adding");

    const activePrice =
      phase === "buffer" ? pricing?.regularPrice : pricing?.preorderPrice;
    const cartProduct: CartProduct = {
      ...product,
      price: activePrice ?? product.price,
    };

    const t1 = setTimeout(() => {
      addItem(cartProduct);
      setBtnStatus("success");
      const t2 = setTimeout(() => setBtnStatus("idle"), 1800);
      timeoutRefs.current.push(t2);
    }, 350);
    timeoutRefs.current.push(t1);
  }

  const isCartAction = phase !== "soldout";

  const buttonLabel =
    phase === "preorder"
      ? "pre:order batch 01"
      : phase === "buffer"
        ? `order batch 01 (${typeof stockCount === "number" ? `${stockCount} left` : "low stock"})`
        : "pre:order batch 02";

  const buttonAriaLabel =
    phase === "preorder"
      ? `pre-order batch 01 at early bird price of €${pricing?.preorderPrice?.toFixed(2)}`
      : phase === "buffer"
        ? `order batch 01 — ${typeof stockCount === "number" ? `${stockCount} units remaining` : "low stock"}`
        : "pre-order batch 02 — batch 01 is sold out";

  const buttonClassName =
    phase === "preorder"
      ? "bg-white text-black hover:bg-white/90 border border-white font-semibold"
      : phase === "buffer"
        ? "border border-white text-white hover:bg-white hover:text-black transition-colors duration-200"
        : "border border-white/30 text-white hover:border-white/60 transition-colors duration-200";

  // Animated display text for cart-action phases
  const displayLabel =
    isCartAction && btnStatus === "success"
      ? "added"
      : isCartAction && btnStatus === "adding"
        ? "adding…"
        : buttonLabel;

  const isDisabled = isCartAction && btnStatus === "adding";

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* ── Price display ─────────────────────────────────────────────────── */}
      <PriceDisplay phase={phase} productId={productId} />

      {/* ── CTA button ────────────────────────────────────────────────────── */}
      <button
        type="button"
        id={`batch-cta-${phase}`}
        disabled={isDisabled}
        onClick={isCartAction ? handleAddToCart : undefined}
        aria-label={buttonAriaLabel}
        aria-live="polite"
        aria-busy={btnStatus === "adding"}
        className={`
          group w-full flex items-center justify-between gap-3
          px-6 py-4 rounded-none select-none
          text-sm tracking-[0.15em] lowercase
          focus-visible:outline focus-visible:outline-1
          focus-visible:outline-white/60 focus-visible:outline-offset-2
          disabled:cursor-wait disabled:opacity-50
          ${buttonClassName}
        `}
      >
        <span className="font-mono">{displayLabel}</span>

        {isCartAction && (
          <div
            className="h-4 w-4 flex items-center justify-center shrink-0 transition-opacity duration-200"
            style={{
              opacity: btnStatus === "adding" ? 0.4 : 1,
            }}
            aria-hidden="true"
          >
            <Icon
              src={
                btnStatus === "success"
                  ? "/icons/cart-check.svg"
                  : "/icons/cart-plus.svg"
              }
              size={16}
              opacity={1}
              invert={phase !== "preorder"}
            />
          </div>
        )}
      </button>

      {}
      <Subtext
        phase={phase}
        stockCount={stockCount}
        closeDate={closeDate}
        shipDate={shipDate}
      />
    </div>
  );
}
