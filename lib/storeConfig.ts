import { BatchPhase } from "@/components/product/BatchCartSection";

export const STORE_CONFIG = {
  currentPhase: "preorder" as BatchPhase,

  stockCount: 5,
  closeDate: "aug 16",
  shipDate: "by aug 30",
};

export type PricingConfig = {
  regularPrice: number;
  preorderPrice: number;
  valuePrice?: number;
};

export const PRICING: Record<string, PricingConfig> = {
  "shampoo-290": {
    regularPrice: 28.0,
    preorderPrice: 24.95,
  },
  "conditioner-290": {
    regularPrice: 28.0,
    preorderPrice: 24.95,
  },
  "duo-system-001": {
    regularPrice: 44.95,
    preorderPrice: 39.95,
    valuePrice: 56.0,
  },
};

export function getActivePrice(
  productId: string,
  phase: BatchPhase = STORE_CONFIG.currentPhase,
): number {
  const p = PRICING[productId];
  if (!p) return 0;
  if (phase === "buffer") return p.regularPrice;
  return p.preorderPrice;
}
