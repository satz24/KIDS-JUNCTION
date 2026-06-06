import { createClient } from "@supabase/supabase-js";
import { STORE_CATEGORY_IDS } from "@/lib/data/store-categories";

/** Fetch category IDs at build time so GitHub Pages pre-renders admin-added categories. */
export async function fetchCategoryIdsForBuild(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return STORE_CATEGORY_IDS;

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from("categories").select("id").order("name");
    if (error || !data?.length) return STORE_CATEGORY_IDS;
    return data.map((row) => row.id);
  } catch {
    return STORE_CATEGORY_IDS;
  }
}
