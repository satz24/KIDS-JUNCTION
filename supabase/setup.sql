-- =============================================================================
-- Kids Junction — Complete Supabase Setup (SINGLE FILE — run this only)
-- =============================================================================
-- Includes: categories, sub-categories, products, orders, storage bucket,
--           RLS policies, table grants, seed data, admin order delete
--
-- How to use:
--   1. Open Supabase → SQL Editor → New query
--   2. Paste this entire file and click Run (safe to re-run on existing projects)
--   3. Create an admin user in Authentication → Users
--   4. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env
-- =============================================================================

-- -----------------------------------------------------------------------------
-- TABLES
-- -----------------------------------------------------------------------------

create table if not exists public.categories (
  id text primary key,
  name text not null,
  image_url text,
  created_at timestamptz default now() not null
);

create table if not exists public.sub_categories (
  id text primary key,
  category_id text not null references public.categories (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now() not null
);

create index if not exists sub_categories_category_id_idx on public.sub_categories (category_id);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  price numeric(10, 2) not null check (price >= 0),
  category_id text not null references public.categories (id) on delete cascade,
  image_url text,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  created_at timestamptz default now() not null
);

-- Upgrade older projects that were created before sub-categories
alter table public.products add column if not exists sub_category_id text references public.sub_categories (id) on delete set null;

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_featured_idx on public.products (featured);
create index if not exists products_sub_category_id_idx on public.products (sub_category_id);

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

-- Category delete removes linked products (safe to re-run on existing projects)
alter table public.products drop constraint if exists products_category_id_fkey;
alter table public.products
  add constraint products_category_id_fkey
  foreign key (category_id) references public.categories (id) on delete cascade;

-- -----------------------------------------------------------------------------
-- STORAGE BUCKET (product image uploads from admin)
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.sub_categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Drop existing policies so this script can be re-run safely
drop policy if exists "categories_public_read" on public.categories;
drop policy if exists "categories_admin_write" on public.categories;
drop policy if exists "sub_categories_public_read" on public.sub_categories;
drop policy if exists "sub_categories_admin_write" on public.sub_categories;
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_admin_write" on public.products;
drop policy if exists "orders_public_insert" on public.orders;
drop policy if exists "orders_admin_read" on public.orders;
drop policy if exists "orders_admin_update" on public.orders;
drop policy if exists "orders_admin_delete" on public.orders;
drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_admin_upload" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;

create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "sub_categories_public_read"
  on public.sub_categories for select
  to anon, authenticated
  using (true);

create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "categories_admin_write"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

create policy "sub_categories_admin_write"
  on public.sub_categories for all
  to authenticated
  using (true)
  with check (true);

create policy "products_admin_write"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

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

create policy "orders_admin_delete"
  on public.orders for delete
  to authenticated
  using (true);

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

-- -----------------------------------------------------------------------------
-- TABLE GRANTS (RLS policies alone are not enough — roles need table privileges)
-- -----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

grant select on public.sub_categories to anon, authenticated;
grant insert, update, delete on public.sub_categories to authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

grant insert on public.orders to anon, authenticated;
grant select, update, delete on public.orders to authenticated;

grant select on storage.objects to anon, authenticated;
grant insert, update, delete on storage.objects to authenticated;

-- -----------------------------------------------------------------------------
-- SEED DATA — categories, sub-categories, sample products
-- -----------------------------------------------------------------------------

insert into public.categories (id, name, image_url) values
  ('toys-school', 'Baby Cycles', '/brand/KJ_final.jpg'),
  ('girls', 'Battery Cars', '/brand/KJ_final.jpg'),
  ('baby', 'Just Born Needs', '/brand/KJ_final.jpg'),
  ('baby-essentials', 'Kids Wear', '/brand/KJ_final.jpg'),
  ('boys', 'Mother Care', '/brand/KJ_final.jpg'),
  ('gift-sets', 'Toys and Games', '/brand/KJ_final.jpg')
on conflict (id) do update set
  name = excluded.name,
  image_url = excluded.image_url;

-- Two placeholder sub-categories per category (same name as parent — rename in admin later)
insert into public.sub_categories (id, category_id, name, sort_order) values
  ('toys-school-1', 'toys-school', 'Baby Cycles', 1),
  ('toys-school-2', 'toys-school', 'Baby Cycles', 2),
  ('girls-1', 'girls', 'Battery Cars', 1),
  ('girls-2', 'girls', 'Battery Cars', 2),
  ('baby-1', 'baby', 'Just Born Needs', 1),
  ('baby-2', 'baby', 'Just Born Needs', 2),
  ('baby-essentials-1', 'baby-essentials', 'Kids Wear', 1),
  ('baby-essentials-2', 'baby-essentials', 'Kids Wear', 2),
  ('boys-1', 'boys', 'Mother Care', 1),
  ('boys-2', 'boys', 'Mother Care', 2),
  ('gift-sets-1', 'gift-sets', 'Toys and Games', 1),
  ('gift-sets-2', 'gift-sets', 'Toys and Games', 2)
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.products (name, slug, description, price, category_id, image_url, stock, featured) values
  ('Baby Soft Romper Set', 'baby-soft-romper-set', 'Comfortable cotton romper for newborns.', 599, 'baby', '/brand/KJ_final.jpg', 25, true),
  ('Girls Floral Dress', 'girls-floral-dress', 'Pretty floral dress for parties and play.', 899, 'girls', '/brand/KJ_final.jpg', 20, true),
  ('Boys Graphic Tee', 'boys-graphic-tee', 'Soft cotton tee with fun print.', 449, 'boys', '/brand/KJ_final.jpg', 40, false),
  ('Baby Feeding Set', 'baby-feeding-set', 'BPA-free bottles and bowls set.', 699, 'baby-essentials', '/brand/KJ_final.jpg', 15, false),
  ('Premium Gift Hamper', 'premium-gift-hamper', 'Curated gift set for special occasions.', 1499, 'gift-sets', '/brand/KJ_final.jpg', 10, true),
  ('Educational Puzzle Pack', 'educational-puzzle-pack', 'Learning puzzles for ages 3+.', 649, 'toys-school', '/brand/KJ_final.jpg', 22, false)
on conflict (slug) do nothing;

-- Done.
