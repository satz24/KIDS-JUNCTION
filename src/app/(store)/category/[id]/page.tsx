import { STATIC_CATEGORY_IDS } from "@/lib/static-export-params";
import { CategoryPageClient } from "./category-page-client";

export function generateStaticParams() {
  return STATIC_CATEGORY_IDS.map((id) => ({ id }));
}

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  return <CategoryPageClient params={params} />;
}
