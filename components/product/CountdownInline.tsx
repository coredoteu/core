"use client";

import { ReactNode } from "react";
import { useCountdown } from "@/lib/useCountdown";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownInline({
  targetISO,
  className = "",
  fallback = null,
}: {
  targetISO: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const value = useCountdown(targetISO);

  if (!value) return <>{fallback}</>;
  if (value.isExpired) return null;

  return (
    <span className={`font-mono tabular-nums tracking-[0.1em] ${className}`}>
      {value.days > 0 && <>{pad(value.days)}d : </>}
      {pad(value.hours)}h : {pad(value.minutes)}m : {pad(value.seconds)}s
    </span>
  );
}
