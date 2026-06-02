-- Seed 10 categories + 1 sample product each
-- Uses brand logo as placeholder image until admin uploads real photos

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
