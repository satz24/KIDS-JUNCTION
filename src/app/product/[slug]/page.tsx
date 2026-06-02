import { STATIC_PRODUCT_SLUGS } from "@/lib/static-export-params";
import { ProductPageClient } from "./product-page-client";

export function generateStaticParams() {
  return STATIC_PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProductPageClient params={params} />;
}
