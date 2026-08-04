"use client";

import { useState, useEffect, useRef } from "react";
import { useCart, CartProduct } from "@/context/CartContext";
import { Icon } from "@/components/ui/Icon";

type Status = "idle" | "adding" | "success";

export default function AddToCartButton({
  product,
  label = "add to cart",
  className = "",
}: {
  product: CartProduct;
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const { addItem } = useCart();
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timeoutRefs.current.forEach(clearTimeout);
  }, []);

  function handleClick() {
    if (status === "adding") return;
    setStatus("adding");

    const t1 = setTimeout(() => {
      addItem(product);
      setStatus("success");
      const t2 = setTimeout(() => setStatus("idle"), 1800);
      timeoutRefs.current.push(t2);
    }, 350);
    timeoutRefs.current.push(t1);
  }

  const icon =
    status === "success"
      ? "/icons/cart-check.svg"
      : "/icons/cart-plus.svg";

  const text =
    status === "success"
      ? "added"
      : status === "adding"
      ? "adding"
      : label;

  const iconFilter =
    status === "success"
      ? "brightness(0)"
      : "brightness(0) invert(1)";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "adding"}
      aria-live="polite"
      className={`group flex items-center justify-between gap-3 px-6 py-3.5 border text-sm tracking-[0.15em] lowercase transition-all duration-300 disabled:cursor-wait focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/60 focus-visible:outline-offset-2 ${
        status === "success"
          ? "border-white bg-white text-[#0D0D0D]"
          : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
      } ${className}`}
    >
      <span>[ {text} ]</span>
      <div
        className="h-4 w-4 transition-all duration-300 flex items-center justify-center"
        style={{
          filter: iconFilter,
          opacity: status === "success" ? 1 : 0.8,
        }}
      >
        <Icon src={icon} size={16} opacity={1} />
      </div>
    </button>
  );
}
