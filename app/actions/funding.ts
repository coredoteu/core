"use server";

import { supabase } from "@/lib/supabase";

export async function getFundingStats() {
  try {
    const { data, error } = await supabase
      .from("funding_stats")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching funding stats:", error);
      return { unlocked: 105, total: 250 }; // fallback
    }

    if (data) {
      return { unlocked: data.unlocked, total: data.total };
    }
  } catch (err) {
    console.error("Unexpected error fetching funding stats:", err);
  }
  
  return { unlocked: 105, total: 250 }; // fallback
}
