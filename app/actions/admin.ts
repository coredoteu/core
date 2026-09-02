"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

const BatchUpdateSchema = z.object({
  batchId: z.string().uuid(),
  phase: z.enum(["preorder", "buffer", "soldout"]),
  preorderCloseDate: z.string().min(1),
  shipWindowStart: z.string().min(1),
  shipWindowEnd: z.string().min(1),
  stockCount: z.coerce.number().int().min(0).nullable(),
  closeDateLabel: z.string().min(1).max(40),
  shipDateLabel: z.string().min(1).max(40),
  closeDateISO: z
    .string()
    .min(1)
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      "use iso format, e.g. 2026-08-31T23:59:59+02:00",
    ),
});

export type BatchUpdateResult =
  | { success: true }
  | { success: false; error: string };

export async function updateBatchAction(
  _prevState: BatchUpdateResult,
  formData: FormData,
): Promise<BatchUpdateResult> {
  // Defense-in-depth: the /admin layout already gates this, but Server
  // Actions are independently invocable, so we re-check here.
  await requireAdmin();

  const stockRaw = formData.get("stockCount");

  const parsed = BatchUpdateSchema.safeParse({
    batchId: formData.get("batchId"),
    phase: formData.get("phase"),
    preorderCloseDate: formData.get("preorderCloseDate"),
    shipWindowStart: formData.get("shipWindowStart"),
    shipWindowEnd: formData.get("shipWindowEnd"),
    stockCount: stockRaw === null || stockRaw === "" ? null : stockRaw,
    closeDateLabel: formData.get("closeDateLabel"),
    shipDateLabel: formData.get("shipDateLabel"),
    closeDateISO: formData.get("closeDateISO"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "invalid input.",
    };
  }

  const { batchId, ...fields } = parsed.data;

  const { error } = await supabaseAdmin
    .from("batches")
    .update({
      phase: fields.phase,
      preorder_close_date: fields.preorderCloseDate,
      ship_window_start: fields.shipWindowStart,
      ship_window_end: fields.shipWindowEnd,
      stock_count: fields.stockCount,
      close_date_label: fields.closeDateLabel,
      ship_date_label: fields.shipDateLabel,
      close_date_iso: fields.closeDateISO,
      updated_at: new Date().toISOString(),
    })
    .eq("id", batchId);

  if (error) {
    console.error("[Admin] updateBatchAction error:", error);
    return { success: false, error: "database update failed." };
  }

  // Every page that reads the active batch server-side needs a fresh pull.
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/admin");

  return { success: true };
}
