-- Kids Junction — Supabase schema
-- Run in Supabase SQL Editor or via CLI

-- Categories
create table if not exists public.categories (
  id text primary key,
  name text not null,
  image_url text,
  created_at timestamptz default now() not null
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  price numeric(10, 2) not null check (price >= 0),
  category_id text not null references public.categories (id) on delete restrict,
  image_url text,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  created_at timestamptz default now() not null
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_featured_idx on public.products (featured);

-- Orders (WhatsApp checkout)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  cart_data jsonb not null default '[]'::jsonb,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'processing', 'completed', 'cancelled')),
  created_at timestamptz default now() not null
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Public read categories & products
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

-- Admin write categories & products (authenticated users only)
create policy "categories_admin_write"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

create policy "products_admin_write"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- Orders: customers can insert; admins read/update
create policy "orders_public_insert"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "orders_admin_read"
  on public.orders for select
  to authenticated
  using (true);

create policy "orders_admin_update"
  on public.orders for update
  to authenticated
  using (true)
  with check (true);

-- Storage policies
create policy "product_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "product_images_admin_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "product_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
