-- ============================================================
-- 005_admin_panel.sql
-- Adds admin-editable label/countdown fields to `batches`, and a
-- `chat_logs` table backing the admin support-chat insights feed.
-- All reads/writes for this migration's tables go through the
-- service-role key (supabaseAdmin) gated by app-level admin checks —
-- consistent with how `orders`, `guarantee_claims`, etc. already work
-- in this codebase. No anon/authenticated policies are added.
-- ============================================================

-- ── Batch: admin-editable display + countdown fields ─────────────────
alter table public.batches
  add column if not exists close_date_label text,
  add column if not exists ship_date_label text,
  add column if not exists close_date_iso timestamptz,
  add column if not exists updated_at timestamptz not null default now();

-- Backfill existing rows so the site never renders a blank label.
update public.batches
set
  close_date_label = coalesce(close_date_label, 'aug 16'),
  ship_date_label = coalesce(ship_date_label, 'by aug 30'),
  close_date_iso = coalesce(
    close_date_iso,
    (preorder_close_date::text || 'T23:59:59+02:00')::timestamptz
  )
where close_date_label is null
   or ship_date_label is null
   or close_date_iso is null;

-- ── Support chat insights feed ────────────────────────────────────────
create table if not exists public.chat_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_email text,
  user_message text not null default '',
  assistant_reply text not null default '',
  tool_names text[]
);

create index if not exists chat_logs_created_at_idx
  on public.chat_logs (created_at desc);

alter table public.chat_logs enable row level security;
-- Intentionally no policies: only the service-role key (server-side,
-- behind requireAdmin()) may read or write this table.
