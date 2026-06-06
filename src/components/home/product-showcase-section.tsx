"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCategories, useProducts } from "@/hooks/use-catalog";
import { ShowcaseCard } from "@/components/products/showcase-card";
import { ProductInquiryModal } from "@/components/products/product-inquiry-modal";
import { PriceSortSelect } from "@/components/products/price-sort-select";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { DecorativeBg } from "@/components/shared/decorative-bg";
import { Button } from "@/components/ui/button";
import { sortProductsByPrice, type PriceSort } from "@/lib/products/sort-products";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductShowcaseSectionProps {
  limit?: number;
  showViewAll?: boolean;
  showAll?: boolean;
}

export function ProductShowcaseSection({
  limit = 8,
  showViewAll = true,
  showAll = false,
}: ProductShowcaseSectionProps) {
  const searchParams = useSearchParams();
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<PriceSort>("default");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { products: allProducts, loading } = useProducts({
    categoryId: activeCategory === "all" ? undefined : activeCategory,
  });

  useEffect(() => {
    const collectionParam = searchParams.get("collection");
    if (!collectionParam) return;
    if (!categories.some((c) => c.id === collectionParam)) return;
    setActiveCategory((current) =>
      current === collectionParam ? current : collectionParam
    );
  }, [searchParams, categories]);

  const sortedProducts = useMemo(() => {
    const sorted = sortProductsByPrice(allProducts, sort);
    if (showAll) return sorted;
    return sorted.slice(0, limit);
  }, [allProducts, sort, limit, showAll]);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <section
      id="collection"
      className="py-16 md:py-24 section-bg-blue section-glow relative theme-surface premium-section"
    >
      <DecorativeBg variant="blue" />
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-8 md:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue/80 mb-2">
            Handpicked for you
          </p>
          <h2 className="font-display heading-lg mb-3">
            Our <span className="text-gradient-brand">Collection</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Browse our collection, add to cart, and order via WhatsApp in minutes.
          </p>
        </ScrollReveal>

        <ScrollReveal className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="premium-filter-pill flex gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0 pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "premium-filter-btn",
                activeCategory === "all" && "premium-filter-btn--active"
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "premium-filter-btn",
                  activeCategory === category.id && "premium-filter-btn--active"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
          <PriceSortSelect sort={sort} onSortChange={setSort} />
        </ScrollReveal>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 justify-items-center">
            {sortedProducts.map((product, i) => (
              <ShowcaseCard
                key={product.id}
                product={product}
                index={i}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        {!loading && sortedProducts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No products in this category yet. Contact us on WhatsApp for availability.
          </p>
        )}

        {showViewAll && !showAll && allProducts.length > limit && (
          <div className="text-center mt-10">
            <Link href="/collection">
              <Button size="lg" variant="outline">
                View Full Collection
              </Button>
            </Link>
          </div>
        )}
      </div>

      <ProductInquiryModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
}
