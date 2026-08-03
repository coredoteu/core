-- Run this script in your Supabase SQL Editor

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  size text NOT NULL,
  function text NOT NULL,
  price numeric NOT NULL,
  image text NOT NULL,
  unit text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to products
CREATE POLICY "Allow public read access to products" 
  ON public.products FOR SELECT 
  USING (true);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text UNIQUE NOT NULL,
  customer_email text NOT NULL,
  customer_name text,
  amount_total numeric NOT NULL,
  currency text NOT NULL,
  payment_status text NOT NULL,
  shipping_details jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public/webhook to insert and select orders
CREATE POLICY "Allow webhook insert to orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public select on orders" 
  ON public.orders FOR SELECT 
  USING (true);

-- 3. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text REFERENCES public.products(id),
  quantity integer NOT NULL,
  price_at_purchase numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public/webhook to insert and select order items
CREATE POLICY "Allow webhook insert to order_items" 
  ON public.order_items FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public select on order_items" 
  ON public.order_items FOR SELECT 
  USING (true);

-- Insert Initial Catalog Data
INSERT INTO public.products (id, name, brand, size, function, price, image, unit)
VALUES 
  ('shampoo-290', 'daily balancing shampoo', 'CORE.', '290 ml / 9.81 fl oz', 'cleanse & scalp equilibrium', 28.00, '/images/shampoo-front.png', 'unit 01'),
  ('conditioner-290', 'daily nourishing conditioner', 'CORE.', '290 ml / 9.81 fl oz', 'repair, lipids & weightless seal', 28.00, '/images/conditioner-front.png', 'unit 02'),
  ('duo-system-001', 'the duo', 'CORE.', '2 × 290 ml / 9.81 fl oz', 'complete daily system', 44.95, '/images/shampoo-front.png', 'system 001')
ON CONFLICT (id) DO NOTHING;
