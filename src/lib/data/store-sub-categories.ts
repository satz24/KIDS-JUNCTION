import type { DbSubCategory } from "@/types/database";
import { STORE_CATEGORIES } from "./store-categories";

/** Placeholder sub-categories — two per category, same name as parent (rename in admin). */
export const STORE_SUB_CATEGORIES: DbSubCategory[] = STORE_CATEGORIES.flatMap((cat) => [
  {
    id: `${cat.id}-1`,
    category_id: cat.id,
    name: cat.name,
    sort_order: 1,
    created_at: "",
  },
  {
    id: `${cat.id}-2`,
    category_id: cat.id,
    name: cat.name,
    sort_order: 2,
    created_at: "",
  },
]);

export function getStoreSubCategoriesForCategory(categoryId: string): DbSubCategory[] {
  return STORE_SUB_CATEGORIES.filter((sub) => sub.category_id === categoryId).sort(
    (a, b) => a.sort_order - b.sort_order
  );
}
