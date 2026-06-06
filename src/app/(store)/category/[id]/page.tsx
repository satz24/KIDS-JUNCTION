import { fetchCategoryIdsForBuild } from "@/lib/supabase/build-fetch";
import { CategoryPageClient } from "./category-page-client";

export async function generateStaticParams() {
  const ids = await fetchCategoryIdsForBuild();
  return ids.map((id) => ({ id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryPageClient categoryId={id} />;
}
