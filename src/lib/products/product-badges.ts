import type { Product } from "@/types";

export type ProductBadgeType = "new-arrival" | "trending" | "best-seller" | "limited-stock";

export interface ProductBadge {
  type: ProductBadgeType;
  label: string;
}

const BADGE_LABELS: Record<ProductBadgeType, string> = {
  "new-arrival": "New Arrival",
  trending: "Trending",
  "best-seller": "Best Seller",
  "limited-stock": "Limited Stock",
};

/** Display-only badges derived from existing product fields — no data model changes. */
export function getProductBadges(product: Product): ProductBadge[] {
  const badges: ProductBadge[] = [];

  if (product.stockCount > 0 && product.stockCount <= 8) {
    badges.push({ type: "limited-stock", label: BADGE_LABELS["limited-stock"] });
  }
  if (product.trending) {
    badges.push({ type: "trending", label: BADGE_LABELS.trending });
  }
  if (product.featured) {
    badges.push({ type: "best-seller", label: BADGE_LABELS["best-seller"] });
  }
  if (
    product.inStock &&
    product.stockCount > 8 &&
    !product.featured &&
    !product.trending
  ) {
    badges.push({ type: "new-arrival", label: BADGE_LABELS["new-arrival"] });
  }

  return badges.slice(0, 2);
}
