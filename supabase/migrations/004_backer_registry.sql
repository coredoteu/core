-- ============================================================
-- 004_backer_registry.sql
-- Feature: V2 Backer Registry (anonymous live ledger).
-- Exposes a country-only, zero-PII view of paid orders for the public
-- "live backer registry" ticker under the V2 funding section.
-- ============================================================

create or replace function public.get_backer_ledger(limit_count int default 10)
returns table (
  founder_number bigint,
  country text,
  product_label text,
  v2_funded_amount numeric,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  with numbered as (
    select
      o.id,
      o.created_at,
      o.shipping_details -> 'address' ->> 'country' as country,
      coalesce(o.v2_funded_amount, 0) as v2_funded_amount,
      row_number() over (order by o.created_at asc) as founder_number
    from public.orders o
    where o.payment_status = 'paid'
      and o.status is distinct from 'refunded'
  ),
  with_product as (
    select
      n.*,
      case
        when exists (
          select 1 from public.order_items oi
          where oi.order_id = n.id and oi.product_id = 'duo-system-001'
        ) then 'the duo'
        when exists (
          select 1 from public.order_items oi
          where oi.order_id = n.id and oi.product_id = 'shampoo-290'
        ) and exists (
          select 1 from public.order_items oi
          where oi.order_id = n.id and oi.product_id = 'conditioner-290'
        ) then 'shampoo + conditioner'
        when exists (
          select 1 from public.order_items oi
          where oi.order_id = n.id and oi.product_id = 'shampoo-290'
        ) then 'the shampoo'
        when exists (
          select 1 from public.order_items oi
          where oi.order_id = n.id and oi.product_id = 'conditioner-290'
        ) then 'the conditioner'
        else 'the system'
      end as product_label
    from numbered n
  )
  select founder_number, country, product_label, v2_funded_amount, created_at
  from with_product
  order by created_at desc
  limit least(coalesce(limit_count, 10), 50);
$$;

revoke all on function public.get_backer_ledger(int) from public;
grant execute on function public.get_backer_ledger(int) to anon, authenticated;
