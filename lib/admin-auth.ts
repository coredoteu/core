import { notFound } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getServerSession } from "@/lib/supabase-server";

/**
 * Whitelist check against ADMIN_EMAILS (comma-separated, case-insensitive).
 * Example: ADMIN_EMAILS=founder@bycore.eu,ops@bycore.eu
 */
function parseAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns the session only if the signed-in user is on the admin
 * whitelist. Returns null for anonymous visitors AND for signed-in
 * non-admin customers — both cases are treated identically upstream
 * (rendered as a 404) so the existence of /admin is never exposed.
 */
export async function getAdminSession(): Promise<Session | null> {
  const session = await getServerSession();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;

  const adminEmails = parseAdminEmails();
  if (adminEmails.length === 0) return null;
  if (!adminEmails.includes(email)) return null;

  return session;
}

/**
 * Use at the top of every admin Server Action and admin route as
 * defense-in-depth (route-level layout gating is not the only guard).
 * Throws Next's notFound() for anyone who isn't an admin.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await getAdminSession();
  if (!session) {
    notFound();
  }
  return session;
}
