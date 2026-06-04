-- Run this in Supabase SQL Editor if admin shows:
-- "column products.sub_category_id does not exist"
-- Safe to re-run.

create table if not exists public.sub_categories (
  id text primary key,
  category_id text not null references public.categories (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now() not null
);

create index if not exists sub_categories_category_id_idx on public.sub_categories (category_id);

alter table public.products add column if not exists sub_category_id text references public.sub_categories (id) on delete set null;

alter table public.sub_categories enable row level security;

drop policy if exists "sub_categories_public_read" on public.sub_categories;
drop policy if exists "sub_categories_admin_write" on public.sub_categories;

create policy "sub_categories_public_read"
  on public.sub_categories for select
  to anon, authenticated
  using (true);

create policy "sub_categories_admin_write"
  on public.sub_categories for all
  to authenticated
  using (true)
  with check (true);

grant select on public.sub_categories to anon, authenticated;
grant insert, update, delete on public.sub_categories to authenticated;

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
