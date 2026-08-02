"use server";

import { supabase } from "@/lib/supabase";

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { error: "invalid email" };
  }

  // Insert email into Supabase waitlist table
  const { error } = await supabase
    .from("waitlist")
    .insert([{ email }]);

  if (error) {
    console.error("Supabase insert error:", error);
    // If it's a unique constraint violation, we can just pretend it succeeded
    // or return a specific message. We'll return success to avoid leaking info.
    if (error.code !== "23505") { // 23505 is unique violation in Postgres
      return { error: "failed to join waitlist" };
    }
  }

  return { success: true };
}
