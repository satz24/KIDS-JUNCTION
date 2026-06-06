import type { DbCategory } from "@/types/database";

/** Offline fallback only — live store uses Supabase admin categories. */
export const STORE_CATEGORIES: DbCategory[] = [
  { id: "toys-school", name: "Baby Cycles", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "baby-gears", name: "Baby Gears", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "baby-rideons", name: "Baby Rideons", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "girls", name: "Battery Cars", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "baby", name: "Just Born Needs", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "baby-essentials", name: "Kids Wear", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "boys", name: "Mother Care", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "gift-sets", name: "Toys and Games", image_url: "/brand/KJ_final.jpg", created_at: "" },
];

export const STORE_CATEGORY_IDS = STORE_CATEGORIES.map((c) => c.id);

export function getStoreCategoryName(id: string): string | undefined {
  return STORE_CATEGORIES.find((c) => c.id === id)?.name;
}
