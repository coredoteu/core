import { supabaseAdmin } from "@/lib/supabase";
import { STORE_CONFIG } from "@/lib/storeConfig";
import type { BatchPhase } from "@/components/product/BatchCartSection";

export interface AdminBatch {
  id: string;
  batchNumber: number;
  phase: BatchPhase;
  preorderCloseDate: string; // YYYY-MM-DD
  shipWindowStart: string; // YYYY-MM-DD
  shipWindowEnd: string; // YYYY-MM-DD
  stockCount: number | null;
  closeDateLabel: string; // e.g. "aug 31" — shown to customers
  shipDateLabel: string; // e.g. "by sept 15" — shown to customers
  closeDateISO: string; // drives the live countdown engine
}

/** Subset of AdminBatch that maps 1:1 onto BatchCartSectionProps. */
export interface BatchDisplayProps {
  phase: BatchPhase;
  stockCount?: number;
  closeDate: string;
  shipDate: string;
  closeDateISO: string;
}

const BATCH_SELECT =
  "id, batch_number, phase, preorder_close_date, ship_window_start, ship_window_end, stock_count, close_date_label, ship_date_label, close_date_iso";

export async function getActiveBatch(): Promise<AdminBatch | null> {
  const { data, error } = await supabaseAdmin
    .from("batches")
    .select(BATCH_SELECT)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    batchNumber: data.batch_number,
    phase: data.phase,
    preorderCloseDate: data.preorder_close_date,
    shipWindowStart: data.ship_window_start,
    shipWindowEnd: data.ship_window_end,
    stockCount: data.stock_count,
    closeDateLabel: data.close_date_label ?? STORE_CONFIG.closeDate,
    shipDateLabel: data.ship_date_label ?? STORE_CONFIG.shipDate,
    closeDateISO:
      data.close_date_iso ?? `${data.preorder_close_date}T23:59:59+02:00`,
  };
}

/**
 * Maps an AdminBatch onto the props BatchCartSection (and everything
 * above it in the tree — HeroPanel, DuoCard, SingleProductCard) already
 * knows how to consume. Returns undefined when there's no active batch,
 * in which case those components fall back to their static defaults.
 */
export function toBatchDisplayProps(
  batch: AdminBatch | null,
): BatchDisplayProps | undefined {
  if (!batch) return undefined;
  return {
    phase: batch.phase,
    stockCount: batch.stockCount ?? undefined,
    closeDate: batch.closeDateLabel,
    shipDate: batch.shipDateLabel,
    closeDateISO: batch.closeDateISO,
  };
}
