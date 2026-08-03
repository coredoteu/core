"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getFundingStats() {
  try {
    const { data, error } = await supabase
      .from("funding_stats")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Supabase Error (Funding Stats):", error.message, error.details, error.hint);
      return { unlocked: 105, total: 250 }; // fallback
    }

    if (data) {
      // Revalidate the path to ensure Next.js doesn't cache the old data
      revalidatePath("/");
      return { unlocked: data.unlocked, total: data.total };
    }
  } catch (err) {
    console.error("Unexpected error fetching funding stats:", err);
  }
  
  return { unlocked: 105, total: 250 }; // fallback
}
