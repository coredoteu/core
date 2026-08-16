"use client";

import { useEffect, useState } from "react";

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function computeCountdown(targetISO: string): CountdownValue {
  const target = new Date(targetISO).getTime();
  const diff = target - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
}

/**
 * Returns null until the effect fires post-mount, deliberately, so the
 * server-rendered pass and the first client pass agree (avoids a hydration
 * mismatch from ticking against two different Date.now() reads).
 */
export function useCountdown(
  targetISO: string | null | undefined,
): CountdownValue | null {
  const [value, setValue] = useState<CountdownValue | null>(null);

  useEffect(() => {
    if (!targetISO) {
      setValue(null);
      return;
    }
    setValue(computeCountdown(targetISO));
    const interval = setInterval(() => {
      setValue(computeCountdown(targetISO));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetISO]);

  return value;
}
