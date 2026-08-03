import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client bound to the current request's cookies.
 * Use this in Server Components, Server Actions, and Route Handlers.
 *
 * NOTE: This must be called inside a request context (not at module level).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from Server Components where mutations aren't allowed.
            // Middleware handles token refresh in those cases.
          }
        },
      },
    }
  );
}

/**
 * Returns the active session, or null if unauthenticated.
 * Convenience wrapper for the most common server-side auth check.
 */
export async function getServerSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
