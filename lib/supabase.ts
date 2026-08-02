import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// We use the anon key for public facing things, but since this is next.js server actions,
// we could optionally use a service role key. We'll stick to anon key + RLS if needed,
// but for simple waitlist insertions it's usually fine.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
