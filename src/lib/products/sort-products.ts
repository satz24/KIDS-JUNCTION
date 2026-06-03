import type { Product } from "@/types";

export type PriceSort = "default" | "price-asc" | "price-desc";

export const PRICE_SORT_OPTIONS: { value: PriceSort; label: string }[] = [
  { value: "default", label: "Sort by: Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function sortProductsByPrice(products: Product[], sort: PriceSort): Product[] {
  if (sort === "default") return products;
  return [...products].sort((a, b) =>
    sort === "price-asc" ? a.price - b.price : b.price - a.price
  );
}
