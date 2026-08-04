import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// Browser-side client (anon key + RLS). Safe to import in client components.
// Uses createBrowserClient so auth tokens are automatically saved in document.cookie for SSR.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-only admin client (service role key).
// Falls back to anon key if service role key is not defined, preventing client-side evaluation crashes.
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceKey,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
