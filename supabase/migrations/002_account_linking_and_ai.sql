-- ============================================================
-- 1. Extend orders with account-linking columns
-- ============================================================
alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists stripe_customer_id text;

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_customer_email_idx on public.orders(lower(customer_email));
create index if not exists orders_stripe_customer_id_idx on public.orders(stripe_customer_id);

-- ============================================================
-- 2. Profiles table (1:1 with auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  stripe_customer_id text,
  default_shipping_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_stripe_customer_id_idx on public.profiles(stripe_customer_id);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
-- Deliberately no insert policy for anon/authenticated: profiles are only
-- ever created by the security-definer trigger below or the service role.

-- ============================================================
-- 3. Webhook idempotency ledger
-- ============================================================
create table if not exists public.webhook_events (
  stripe_event_id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

alter table public.webhook_events enable row level security;
-- No policies -> only the service role (which bypasses RLS) can touch this.

-- ============================================================
-- 4. Auto-link guest orders + create profile on signup
-- ============================================================
create or replace function public.handle_new_user_link_orders()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do update set email = excluded.email;

  -- Link any guest orders placed under this exact email.
  update public.orders
  set user_id = new.id
  where user_id is null
    and lower(customer_email) = lower(new.email);

  -- Sync the Stripe Customer ID from the most recent linked order.
  update public.profiles p
  set stripe_customer_id = o.stripe_customer_id
  from (
    select stripe_customer_id
    from public.orders
    where user_id = new.id and stripe_customer_id is not null
    order by created_at desc
    limit 1
  ) o
  where p.id = new.id and p.stripe_customer_id is null;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_link_orders on auth.users;
create trigger on_auth_user_created_link_orders
  after insert on auth.users
  for each row execute function public.handle_new_user_link_orders();

-- ============================================================
-- 5. Tighten RLS on orders / order_items
--    (replaces the previous fully-public read policies)
-- ============================================================
drop policy if exists "Allow public select on orders" on public.orders;
drop policy if exists "Allow webhook insert to orders" on public.orders;

create policy "orders_select_own" on public.orders
  for select using (
    auth.uid() = user_id
    or lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
-- No insert/update policy for anon/authenticated on purpose: all writes to
-- orders happen via the service-role key (webhook), which bypasses RLS.

drop policy if exists "Allow public select on order_items" on public.order_items;
drop policy if exists "Allow webhook insert to order_items" on public.order_items;

create policy "order_items_select_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (
          auth.uid() = o.user_id
          or lower(o.customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
    )
  );

-- ============================================================
-- 6. One-time backfill for accounts that already existed
--    before this migration (safe to re-run)
-- ============================================================
insert into public.profiles (id, email)
select u.id, u.email from auth.users u
on conflict (id) do nothing;

update public.orders o
set user_id = u.id
from auth.users u
where o.user_id is null
  and lower(o.customer_email) = lower(u.email);

update public.profiles p
set stripe_customer_id = o.stripe_customer_id
from public.orders o
where p.stripe_customer_id is null
  and o.user_id = p.id
  and o.stripe_customer_id is not null;
