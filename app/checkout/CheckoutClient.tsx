"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FREE_SHIPPING_THRESHOLD_EUR } from "@/lib/constants";

// ─── Stripe setup ─────────────────────────────────────────────────────────────

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// ─── Stripe Appearance — CORE. Design System ──────────────────────────────────

const stripeAppearance = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "#0f0f0f",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.45)",
    colorTextPlaceholder: "rgba(255,255,255,0.2)",
    colorInputBorder: "rgba(255,255,255,0.1)",
    colorInputBackground: "rgba(255,255,255,0.03)",
    colorDanger: "#e57373",
    colorSuccess: "#81c784",
    fontFamily:
      '"GeistSans", "Geist Sans", ui-sans-serif, system-ui, sans-serif',
    fontSizeBase: "13px",
    fontSizeSm: "11px",
    fontWeightNormal: "300",
    fontWeightMedium: "400",
    spacingUnit: "4px",
    spacingGridRow: "18px",
    spacingGridColumn: "16px",
    borderRadius: "0px",
    focusBoxShadow: "none",
    focusOutline: "none",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(255,255,255,0.10)",
      backgroundColor: "rgba(255,255,255,0.025)",
      color: "#ffffff",
      boxShadow: "none",
      padding: "12px 14px",
      fontSize: "13px",
      fontWeight: "300",
      transition: "border-color 0.2s ease",
      textTransform: "lowercase",
    },
    ".Input:focus": {
      border: "1px solid rgba(255,255,255,0.35)",
      boxShadow: "none",
      outline: "none",
    },
    ".Input::placeholder": {
      color: "rgba(255,255,255,0.18)",
    },
    ".Input--invalid": {
      border: "1px solid rgba(229,115,115,0.6)",
      boxShadow: "none",
    },
    ".Label": {
      color: "rgba(255,255,255,0.4)",
      fontSize: "9px",
      letterSpacing: "0.2em",
      textTransform: "lowercase",
      fontWeight: "400",
      marginBottom: "6px",
    },
    ".Error": {
      color: "#e57373",
      fontSize: "10px",
      letterSpacing: "0.05em",
      fontWeight: "300",
      textTransform: "lowercase",
    },
    ".Tab": {
      border: "1px solid rgba(255,255,255,0.08)",
      backgroundColor: "rgba(255,255,255,0.02)",
      color: "rgba(255,255,255,0.5)",
      boxShadow: "none",
    },
    ".Tab:hover": {
      border: "1px solid rgba(255,255,255,0.18)",
      color: "rgba(255,255,255,0.8)",
    },
    ".Tab--selected": {
      border: "1px solid rgba(255,255,255,0.3)",
      backgroundColor: "rgba(255,255,255,0.05)",
      color: "#ffffff",
      boxShadow: "none",
    },
    ".TabLabel": {
      fontSize: "11px",
      fontWeight: "300",
      letterSpacing: "0.05em",
      textTransform: "lowercase",
    },
    ".TabIcon": {
      opacity: "0.6",
    },
    ".TabIcon--selected": {
      opacity: "1",
    },
    ".Block": {
      border: "1px solid rgba(255,255,255,0.08)",
      backgroundColor: "rgba(255,255,255,0.02)",
    },
    ".CheckboxInput": {
      border: "1px solid rgba(255,255,255,0.15)",
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    ".CheckboxInput--checked": {
      backgroundColor: "#ffffff",
      border: "1px solid #ffffff",
    },
    ".PickerItem": {
      border: "1px solid rgba(255,255,255,0.08)",
      backgroundColor: "rgba(255,255,255,0.02)",
    },
    ".PickerItem--selected": {
      border: "1px solid rgba(255,255,255,0.25)",
      backgroundColor: "rgba(255,255,255,0.05)",
    },
    ".MenuIcon": {
      color: "rgba(255,255,255,0.4)",
    },
    ".AccordionItem": {
      border: "none",
    },
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderSummaryItem {
  id: string;
  name: string;
  unit: string;
  size: string;
  image: string;
  price: number;
  quantity: number;
}

// ─── Inner form (must be inside <Elements>) ───────────────────────────────────

function CheckoutForm({
  orderSummary,
  subtotal,
  shippingCost,
  isFreeShipping,
  onBack,
}: {
  orderSummary: OrderSummaryItem[];
  subtotal: number;
  shippingCost: number;
  isFreeShipping: boolean;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCart();

  const [step, setStep] = useState<"contact" | "shipping" | "payment">("contact");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShippingComplete, setIsShippingComplete] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const total = subtotal + shippingCost;

  // ── Cursor: hide custom cursor when entering a Stripe iframe region ──────────
  const hideCustomCursor = () => document.body.classList.add("stripe-focus");
  const showCustomCursor = () => document.body.classList.remove("stripe-focus");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Submit elements first (validates + tokenises)
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message?.toLowerCase() || "something went wrong.");
      setIsProcessing(false);
      return;
    }

    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://bycore.eu";

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${siteUrl}/success`,
        receipt_email: email,
      },
    });

    if (error) {
      // Only show error if NOT a redirect (redirect errors are expected)
      if (error.type !== "validation_error") {
        setErrorMessage(error.message || "Payment failed. Please try again.");
      }
      setIsProcessing(false);
    }
    // On success, Stripe redirects — clearCart will be called on the success page
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 border border-hairline">
        <button
          type="button"
          onClick={() => setStep("contact")}
          className={`flex-1 flex items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 border-r border-hairline ${
            step === "contact" ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
          }`}
        >
          <span className={`font-mono text-[9px] tracking-[0.25em] ${step === "contact" ? "text-white" : "text-text-muted"}`}>01</span>
          <span className={`text-[11px] lowercase tracking-[0.1em] ${step === "contact" ? "text-white" : "text-text-muted"}`}>contact</span>
          {isEmailValid && step !== "contact" && (
            <span className="ml-auto opacity-40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => isEmailValid && setStep("shipping")}
          disabled={!isEmailValid}
          className={`flex-1 flex items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 border-r border-hairline disabled:cursor-not-allowed ${
            step === "shipping" ? "bg-white/[0.04]" : "hover:bg-white/[0.02] disabled:hover:bg-transparent"
          }`}
        >
          <span className={`font-mono text-[9px] tracking-[0.25em] ${step === "shipping" ? "text-white" : "text-text-muted"}`}>02</span>
          <span className={`text-[11px] lowercase tracking-[0.1em] ${step === "shipping" ? "text-white" : "text-text-muted"}`}>shipping</span>
          {isShippingComplete && step === "payment" && (
            <span className="ml-auto opacity-40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => isShippingComplete && setStep("payment")}
          disabled={!isShippingComplete}
          className={`flex-1 flex items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 disabled:cursor-not-allowed ${
            step === "payment" ? "bg-white/[0.04]" : "hover:bg-white/[0.02] disabled:hover:bg-transparent"
          }`}
        >
          <span className={`font-mono text-[9px] tracking-[0.25em] ${step === "payment" ? "text-white" : "text-text-muted"}`}>03</span>
          <span className={`text-[11px] lowercase tracking-[0.1em] ${step === "payment" ? "text-white" : "text-text-muted"}`}>payment</span>
        </button>
      </div>

      {/* Step content */}
      <div className="flex-1">
        {/* ── Step 1: Contact ── */}
        <div className={step === "contact" ? "block" : "hidden"}>
          <p className="text-[10px] font-mono tracking-[0.2em] text-text-muted lowercase mb-6">contact information</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono tracking-[0.2em] text-text-muted lowercase">email address</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              placeholder="your@email.com"
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
              }}
              className="w-full px-4 py-3 bg-white/[0.025] border border-hairline text-white text-[13px] font-light placeholder:text-white/20 focus:outline-none focus:border-white/35 transition-colors duration-200 lowercase"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
          <button
            type="button"
            disabled={!isEmailValid}
            onClick={() => setStep("shipping")}
            className="mt-6 w-full py-4 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"
          >
            continue to shipping
          </button>
        </div>

        {/* ── Step 2: Shipping ── */}
        <div className={step === "shipping" ? "block" : "hidden"}>
          <p className="text-[10px] font-mono tracking-[0.2em] text-text-muted lowercase mb-6">shipping address</p>
          <div onMouseEnter={hideCustomCursor} onMouseLeave={showCustomCursor}>
            <AddressElement
              options={{
                mode: "shipping",
                allowedCountries: ["NL", "BE", "DE", "FR", "GB", "US", "IT", "ES"],
                fields: { phone: "never" },
              }}
              onChange={(event) => {
                setIsShippingComplete(event.complete);
              }}
            />
          </div>
          <button
            type="button"
            disabled={!isShippingComplete}
            onClick={() => setStep("payment")}
            className="mt-6 w-full py-4 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"
          >
            continue to payment
          </button>
        </div>

        {/* ── Step 3: Payment ── */}
        <div className={step === "payment" ? "block" : "hidden"}>
          <p className="text-[10px] font-mono tracking-[0.2em] text-text-muted lowercase mb-6">payment method</p>
          <div onMouseEnter={hideCustomCursor} onMouseLeave={showCustomCursor}>
            <PaymentElement
              options={{
                layout: "accordion",
                defaultValues: {
                  billingDetails: {
                    address: { country: "NL" },
                  },
                },
              }}
            />
          </div>

          {errorMessage && (
            <div className="mt-4 px-4 py-3 border border-[rgba(229,115,115,0.3)] bg-[rgba(229,115,115,0.04)]">
              <p className="text-[11px] font-mono text-[#e57373] lowercase leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing || !stripe || !elements}
            className="mt-6 w-full py-4 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <span className="inline-flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1 h-1 bg-[#0D0D0D] rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </span>
                processing...
              </>
            ) : (
              <>
                <img
                  src="/icons/lock.svg"
                  alt=""
                  className="w-3 h-3"
                  style={{ filter: "brightness(0)", opacity: 0.4 }}
                />
                complete order · €{(total / 100).toFixed(2)}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStep("shipping")}
            className="mt-3 w-full py-3 border border-hairline text-text-muted text-xs font-mono tracking-[0.15em] lowercase hover:border-white/30 hover:text-white/60 transition-colors duration-300 text-center"
          >
            ← back to shipping
          </button>
        </div>
      </div>

      {/* Trust row */}
      <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-center gap-6 flex-wrap">
        {[
          { icon: "/icons/lock.svg", text: "256-bit ssl" },
          { icon: "/icons/shield.svg", text: "stripe secured" },
          { icon: "/icons/leaf.svg", text: "eu certified" },
        ].map((trust) => (
          <span
            key={trust.text}
            className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.15em] text-text-muted lowercase"
          >
            <img
              src={trust.icon}
              alt=""
              className="w-3 h-3"
              style={{
                filter: "brightness(0) invert(1)",
                opacity: 0.25,
              }}
            />
            {trust.text}
          </span>
        ))}
      </div>
    </form>
  );
}

// ─── Order summary sidebar ────────────────────────────────────────────────────

function OrderSummary({
  items,
  subtotal,
  shippingCost,
  isFreeShipping,
}: {
  items: OrderSummaryItem[];
  subtotal: number;
  shippingCost: number;
  isFreeShipping: boolean;
}) {
  const total = subtotal + shippingCost;

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="pb-8 mb-8 border-b border-hairline">
        <Link
          href="/"
          className="inline-flex items-center gap-3 group"
          aria-label="CORE. home"
        >
          <Image
            src="/CORE_logo_trans.svg"
            alt="CORE."
            width={80}
            height={19}
            className="h-[18px] w-auto"
          />
        </Link>
        <p className="text-[9px] font-mono tracking-[0.2em] text-text-muted mt-2 lowercase">
          secure checkout
        </p>
      </div>

      {/* Section label */}
      <p className="text-[9px] font-mono tracking-[0.25em] text-text-muted lowercase mb-5">
        your order
      </p>

      {/* Line items */}
      <div className="flex flex-col divide-y divide-white/[0.06]">
        {items.map((item) => {
          const isDuo = item.id === "duo-system-001";
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 py-4 first:pt-0"
            >
              {/* Image */}
              <div className="relative shrink-0 w-12 h-14 bg-white/[0.025] border border-hairline flex items-center justify-center">
                {isDuo ? (
                  <div className="flex items-center w-full h-full gap-0 px-0.5">
                    <div className="relative flex-1 h-full">
                      <Image
                        src="/images/shampoo-front.png"
                        alt="shampoo"
                        fill
                        className="object-contain"
                        sizes="24px"
                      />
                    </div>
                    <div className="relative flex-1 h-full">
                      <Image
                        src="/images/conditioner-front.png"
                        alt="conditioner"
                        fill
                        className="object-contain"
                        sizes="24px"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                )}
                {/* Quantity badge */}
                {item.quantity > 1 && (
                  <span className="absolute -top-2.5 -right-2.5 w-[22px] h-[22px] bg-[#0D0D0D] border border-white/20 text-white text-[9px] font-mono flex items-center justify-center z-10 shadow-md">
                    {item.quantity}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[9px] font-mono tracking-[0.15em] text-text-muted lowercase">
                  {item.unit}
                </span>
                <span className="text-xs font-light text-white lowercase leading-tight">
                  <span className="uppercase">CORE.</span> {item.name}
                </span>
                <span className="text-[9px] text-text-muted lowercase">
                  {item.size}
                </span>
              </div>

              {/* Price */}
              <span className="text-xs font-light text-white tabular-nums shrink-0">
                €{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Free shipping progress */}
      {!isFreeShipping && (
        <div className="mt-6 border border-hairline p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[9px] font-mono tracking-[0.12em] text-text-muted lowercase">
              €
              {Math.max(
                0,
                FREE_SHIPPING_THRESHOLD_EUR - subtotal / 100,
              ).toFixed(2)}{" "}
              from free shipping
            </span>
            <span className="text-[9px] font-mono text-text-muted lowercase">
              pending
            </span>
          </div>
          <div className="h-px bg-white/[0.06] relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-white/25 transition-all duration-500"
              style={{
                width: `${Math.min(100, ((subtotal / 100) / FREE_SHIPPING_THRESHOLD_EUR) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="mt-6 border-t border-hairline pt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.1em] text-text-muted lowercase">
            subtotal
          </span>
          <span className="text-xs text-white tabular-nums">
            €{(subtotal / 100).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.1em] text-text-muted lowercase">
            shipping
          </span>
          <span className="text-xs font-mono text-text-muted lowercase tabular-nums">
            {isFreeShipping ? "free" : `€${(shippingCost / 100).toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.1em] text-text-muted lowercase">
            tax
          </span>
          <span className="text-[10px] font-mono text-text-muted lowercase">
            included
          </span>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-[0.15em] text-white lowercase">
            total due
          </span>
          <span className="text-xl font-light text-white tabular-nums">
            €{((subtotal + shippingCost) / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-10 bg-white/[0.04] border border-hairline" />
      ))}
      <div className="h-12 bg-white/[0.06] border border-hairline mt-2" />
    </div>
  );
}

// ─── Main checkout client ─────────────────────────────────────────────────────

export default function CheckoutClient() {
  const { items, subtotal } = useCart();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummaryItem[]>([]);
  const [serverSubtotal, setServerSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Redirect empty carts
  useEffect(() => {
    if (items.length === 0 && !isInitializing) {
      router.replace("/cart");
    }
  }, [items, isInitializing, router]);

  // Create PaymentIntent on mount
  useEffect(() => {
    if (items.length === 0) {
      setIsInitializing(false);
      return;
    }

    async function initCheckout() {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await res.json();

        if (!res.ok || !data.clientSecret) {
          throw new Error(data.error || "Failed to initialise checkout.");
        }

        setClientSecret(data.clientSecret);
        setOrderSummary(data.orderSummary || []);
        setServerSubtotal(data.subtotal || 0);
        setShippingCost(data.shippingCost || 0);
        setIsFreeShipping(data.isFreeShipping || false);
      } catch (err: any) {
        setInitError(err.message || "An unexpected error occurred.");
      } finally {
        setIsInitializing(false);
      }
    }

    initCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Error state ─────────────────────────────────────────────────────────

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full border border-hairline p-8 bg-white/[0.015] flex flex-col gap-6">
          <span className="font-mono text-[9px] tracking-[0.3em] text-text-muted lowercase">
            error / checkout
          </span>
          <h1 className="text-xl font-light text-white lowercase">
            something went wrong.
          </h1>
          <p className="text-xs font-mono text-text-muted leading-relaxed lowercase">
            {initError}
          </p>
          <Link
            href="/cart"
            className="px-6 py-3.5 bg-white text-[#0D0D0D] text-xs font-mono tracking-[0.2em] lowercase hover:bg-white/90 transition-colors w-fit"
          >
            return to cart
          </Link>
        </div>
      </div>
    );
  }

  // ─── Main layout ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── LEFT: Order summary ──────────────────────────────────────────── */}
      <div className="lg:w-[45%] xl:w-[42%] bg-white/[0.015] border-b lg:border-b-0 lg:border-r border-hairline">
        <div className="max-w-md mx-auto px-6 md:px-10 lg:px-12 pt-24 pb-12 lg:pt-28 lg:pb-16 lg:min-h-screen lg:flex lg:flex-col">
          {isInitializing ? (
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-5 w-24 bg-white/[0.06]" />
              <div className="h-px bg-white/[0.06]" />
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-4 border-b border-hairline"
                >
                  <div className="w-12 h-14 bg-white/[0.04]" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-2 w-16 bg-white/[0.04]" />
                    <div className="h-3 w-32 bg-white/[0.06]" />
                  </div>
                  <div className="h-3 w-12 bg-white/[0.04]" />
                </div>
              ))}
            </div>
          ) : (
            <OrderSummary
              items={orderSummary}
              subtotal={serverSubtotal}
              shippingCost={shippingCost}
              isFreeShipping={isFreeShipping}
            />
          )}
        </div>
      </div>

      {/* ── RIGHT: Checkout form ─────────────────────────────────────────── */}
      <div className="flex-1 lg:overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 md:px-10 lg:px-12 pt-10 pb-16 lg:pt-32 lg:pb-24 lg:min-h-screen lg:flex lg:flex-col">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 pb-6 border-b border-hairline">
            <Link href="/" aria-label="CORE. home">
              <Image
                src="/CORE_logo_trans.svg"
                alt="CORE."
                width={70}
                height={16}
                className="h-[15px] w-auto"
              />
            </Link>
          </div>

          {/* Section heading */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[9px] tracking-[0.3em] text-text-muted">
                03 //
              </span>
              <h1 className="text-2xl font-extralight text-white lowercase tracking-tight">
                checkout.
              </h1>
            </div>
            <p className="text-[10px] font-mono text-text-muted lowercase tracking-[0.1em]">
              complete your system order securely.
            </p>
          </div>

          {isInitializing ? (
            <LoadingSkeleton />
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: stripeAppearance,
                loader: "auto",
              }}
            >
              <CheckoutForm
                orderSummary={orderSummary}
                subtotal={serverSubtotal}
                shippingCost={shippingCost}
                isFreeShipping={isFreeShipping}
                onBack={() => router.push("/cart")}
              />
            </Elements>
          ) : null}

          {/* Bottom nav */}
          <div className="mt-8 flex items-center justify-between">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-[10px] font-mono tracking-[0.12em] text-text-muted hover:text-white/60 transition-colors duration-200 lowercase group"
            >
              <img
                src="/icons/arrow-left.svg"
                alt=""
                className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-200"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.3 }}
              />
              back to cart
            </Link>
            <span className="text-[9px] font-mono tracking-[0.1em] text-text-muted lowercase">
              bycore.eu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
