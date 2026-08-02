"use client";

import { useState } from "react";
import { useCart, CartProduct } from "@/context/CartContext";

type Status = "idle" | "adding" | "success" | "error";

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

  function handleClick() {
    if (status === "adding") return;
    setStatus("adding");

    setTimeout(() => {
      addItem(product);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1800);
    }, 350);
  }

  const icon =
    status === "success"
      ? "/icons/cart-check.svg"
      : status === "error"
      ? "/icons/cart-cross.svg"
      : "/icons/cart-plus.svg";

  const text =
    status === "success"
      ? "added"
      : status === "error"
      ? "try again"
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
      className={`group flex items-center justify-between gap-3 px-6 py-3.5 border text-sm tracking-[0.15em] lowercase transition-all duration-300 disabled:cursor-wait ${
        status === "success"
          ? "border-white bg-white text-[#0D0D0D]"
          : "border-white/20 text-white/70 hover:text-white hover:border-white/40"
      } ${className}`}
    >
      <span>[ {text} ]</span>
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="h-4 w-4 transition-all duration-300"
        style={{
          filter: iconFilter,
          opacity: status === "success" ? 1 : 0.8,
        }}
      />
    </button>
  );
}
