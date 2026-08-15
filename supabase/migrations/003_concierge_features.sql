-- ── Order tracking columns ──────────────────────────────────────────
alter table public.orders
  add column if not exists carrier text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text,
  add column if not exists shipping_status text,
  add column if not exists cancellation_requested boolean not null default false,
  add column if not exists cancellation_requested_at timestamptz;

-- ── Guarantee claim tracking (feature 3) ─────────────────────────────
create table if not exists public.guarantee_claims (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  product_scope text not null check (product_scope in ('shampoo-290','conditioner-290','duo-system-001')),
  claim_type text not null check (claim_type in ('full_refund','partial_refund')),
  created_at timestamptz not null default now()
);

create index if not exists guarantee_claims_email_idx on public.guarantee_claims(lower(customer_email));

alter table public.guarantee_claims enable row level security;

drop policy if exists "guarantee_claims_select_own" on public.guarantee_claims;
create policy "guarantee_claims_select_own" on public.guarantee_claims
  for select using (
    auth.uid() = user_id
    or lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
-- inserts: service role only — your team logs a claim when they process it manually.

-- ── Active batch / pre-order tracking (feature 5) ────────────────────
create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  batch_number integer not null unique,
  phase text not null check (phase in ('preorder','buffer','soldout')),
  preorder_close_date date not null,
  ship_window_start date not null,
  ship_window_end date not null,
  stock_count integer,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists batches_one_active
  on public.batches (is_active) where is_active = true;

alter table public.batches enable row level security;

drop policy if exists "batches_public_read" on public.batches;
create policy "batches_public_read" on public.batches for select using (true);

-- Seed with your current live config (mirrors lib/storeConfig.ts today)
insert into public.batches (batch_number, phase, preorder_close_date, ship_window_start, ship_window_end, stock_count, is_active)
values (1, 'preorder', '2026-08-16', '2026-08-28', '2026-08-30', 5, true)
on conflict (batch_number) do nothing;
