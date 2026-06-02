-- =============================================================================
-- Kids Junction — Complete Supabase Setup (single file)
-- =============================================================================
-- How to use:
--   1. Open your Supabase project → SQL Editor → New query
--   2. Paste this entire file and click Run
--   3. Create an admin user in Authentication → Users
--   4. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
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
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Drop existing policies so this script can be re-run safely
drop policy if exists "categories_public_read" on public.categories;
drop policy if exists "categories_admin_write" on public.categories;
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_admin_write" on public.products;
drop policy if exists "orders_public_insert" on public.orders;
drop policy if exists "orders_admin_read" on public.orders;
drop policy if exists "orders_admin_update" on public.orders;
drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_admin_upload" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;

-- Categories & products: public read
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

-- Categories & products: admin write (logged-in users)
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

-- Orders: customers insert via website; admins read & update
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

-- Storage: public read, admin upload/update/delete
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
-- SEED DATA — 10 categories + 1 sample product each
-- -----------------------------------------------------------------------------

insert into public.categories (id, name, image_url) values
  ('baby', 'Baby', '/brand/KJ_final.jpg'),
  ('footwear', 'Footwear', '/brand/KJ_final.jpg'),
  ('girls', 'Girls', '/brand/KJ_final.jpg'),
  ('boys', 'Boys', '/brand/KJ_final.jpg'),
  ('baby-essentials', 'Baby Essentials', '/brand/KJ_final.jpg'),
  ('new-collection', 'New Collection', '/brand/KJ_final.jpg'),
  ('travel-bedroom', 'Travel & Bedroom', '/brand/KJ_final.jpg'),
  ('toys-school', 'Toys & School', '/brand/KJ_final.jpg'),
  ('gift-sets', 'Gift Sets', '/brand/KJ_final.jpg'),
  ('online-gift-card', 'Online Gift Card', '/brand/KJ_final.jpg')
on conflict (id) do update set
  name = excluded.name,
  image_url = excluded.image_url;

insert into public.products (name, slug, description, price, category_id, image_url, stock, featured) values
  ('Baby Soft Romper Set', 'baby-soft-romper-set', 'Comfortable cotton romper for newborns.', 599, 'baby', '/brand/KJ_final.jpg', 25, true),
  ('Kids Sport Sandals', 'kids-sport-sandals', 'Lightweight sandals for active kids.', 799, 'footwear', '/brand/KJ_final.jpg', 30, false),
  ('Girls Floral Dress', 'girls-floral-dress', 'Pretty floral dress for parties and play.', 899, 'girls', '/brand/KJ_final.jpg', 20, true),
  ('Boys Graphic Tee', 'boys-graphic-tee', 'Soft cotton tee with fun print.', 449, 'boys', '/brand/KJ_final.jpg', 40, false),
  ('Baby Feeding Set', 'baby-feeding-set', 'BPA-free bottles and bowls set.', 699, 'baby-essentials', '/brand/KJ_final.jpg', 15, false),
  ('New Season Jacket', 'new-season-jacket', 'Latest collection lightweight jacket.', 1299, 'new-collection', '/brand/KJ_final.jpg', 12, true),
  ('Travel Stroller Mat', 'travel-stroller-mat', 'Foldable mat for travel and bedroom.', 549, 'travel-bedroom', '/brand/KJ_final.jpg', 18, false),
  ('Educational Puzzle Pack', 'educational-puzzle-pack', 'Learning puzzles for ages 3+.', 649, 'toys-school', '/brand/KJ_final.jpg', 22, false),
  ('Premium Gift Hamper', 'premium-gift-hamper', 'Curated gift set for special occasions.', 1499, 'gift-sets', '/brand/KJ_final.jpg', 10, true),
  ('Kids Junction Gift Card', 'kids-junction-gift-card', 'Redeemable in-store gift card.', 500, 'online-gift-card', '/brand/KJ_final.jpg', 999, false)
on conflict (slug) do nothing;

-- Done.
