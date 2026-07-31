"use client";

import { useState } from "react";

type Status = "idle" | "adding" | "success" | "error";

export default function AddToCartButton({
  label = "add to cart",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  function handleClick() {
    if (status === "adding") return;
    setStatus("adding");

    // Wire this up to the real cart mutation. Call setStatus("error") on a
    // failed request; cart-cross.svg and the "try again" label are already
    // handled below.
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1800);
    }, 450);
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

  // 2. Dynamic cart icon color:
  // – success state: button bg is white → icon must be BLACK (invert off, no filter needed since svg is already dark stroke)
  // – all other states: dark bg → icon should be WHITE (brightness(0) invert(1))
  const iconFilter =
    status === "success"
      ? "brightness(0)" // black icon on white background
      : "brightness(0) invert(1)"; // white icon on dark background

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "adding"}
      aria-live="polite"
      className={`group flex items-center justify-between gap-3 px-6 py-3.5 border text-sm tracking-[0.15em] lowercase transition-colors duration-300 disabled:cursor-wait ${
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
