"use client";

import { useMemo, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCategories, useProducts, useSubCategories } from "@/hooks/use-catalog";
import { ShowcaseCard } from "@/components/products/showcase-card";
import { ProductInquiryModal } from "@/components/products/product-inquiry-modal";
import { PriceSortSelect } from "@/components/products/price-sort-select";
import { SubCategoryStrip } from "@/components/products/sub-category-strip";
import { sortProductsByPrice, type PriceSort } from "@/lib/products/sort-products";
import type { Product } from "@/types";

export function CategoryPageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { categories } = useCategories();
  const category = categories.find((c) => c.id === id);
  const { subCategories } = useSubCategories(id);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const { products, loading } = useProducts({
    categoryId: id,
    subCategoryId: selectedSubCategoryId ?? undefined,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sort, setSort] = useState<PriceSort>("default");

  const sortedProducts = useMemo(
    () => sortProductsByPrice(products, sort),
    [products, sort]
  );

  return (
    <div className="section-bg-pink theme-surface min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4">
        <Link
          href="/#collections"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand-pink mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> All Collections
        </Link>

        <SubCategoryStrip
          subCategories={subCategories}
          selectedId={selectedSubCategoryId}
          onSelect={setSelectedSubCategoryId}
        />

        <div className="flex items-start justify-between gap-3 mb-8">
          <h1 className="font-display heading-lg">{category?.name ?? id}</h1>
          <PriceSortSelect sort={sort} onSortChange={setSort} />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 justify-items-center">
            {sortedProducts.map((product, i) => (
              <ShowcaseCard
                key={product.id}
                product={product}
                index={i}
                onSelect={(p) => {
                  setSelectedProduct(p);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {!loading && sortedProducts.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            {selectedSubCategoryId
              ? "No products in this sub-category yet."
              : "No products in this category yet."}
          </p>
        )}
      </div>

      <ProductInquiryModal product={selectedProduct} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
