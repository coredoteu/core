import Link from "next/link";
import { ReactNode } from "react";

export function Button({
  href,
  variant = "solid",
  children,
  onClick,
  className = "",
}: {
  href?: string;
  variant?: "solid" | "outline";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "flex items-center justify-center gap-3 px-8 py-4 border text-sm tracking-[0.2em] lowercase transition-all duration-300 active:scale-[0.98] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 cursor-pointer";
  const variants = {
    solid:
      "border-white bg-white text-[#0D0D0D] hover:bg-transparent hover:text-white focus-visible:outline-white",
    outline:
      "border-hairline text-text-muted hover:text-white hover:border-white/40 focus-visible:outline-white/40",
  };

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} ${variants[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
