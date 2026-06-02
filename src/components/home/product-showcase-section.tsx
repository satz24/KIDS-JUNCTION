"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCategories, useProducts } from "@/hooks/use-catalog";
import { ShowcaseCard } from "@/components/products/showcase-card";
import { ProductInquiryModal } from "@/components/products/product-inquiry-modal";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { products: allProducts, loading } = useProducts({
    categoryId: activeCategory === "all" ? undefined : activeCategory,
    limit: showAll ? undefined : limit,
  });

  useEffect(() => {
    const collectionParam = searchParams.get("collection");
    if (collectionParam && categories.some((c) => c.id === collectionParam)) {
      setActiveCategory(collectionParam);
    }
  }, [searchParams, categories]);

  const filtered = useMemo(() => {
    if (showAll) return allProducts;
    return allProducts.slice(0, limit);
  }, [allProducts, limit, showAll]);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <section id="collection" className="py-16 md:py-24 section-bg-blue section-glow relative theme-surface">
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-10">
          <h2 className="font-display heading-lg mb-3">
            Our <span className="text-brand-pink">Collection</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse our collection, add to cart, and order via WhatsApp in minutes.
          </p>
        </ScrollReveal>

        <ScrollReveal className="flex gap-2 overflow-x-auto no-scrollbar pb-6 justify-start md:justify-center flex-wrap md:flex-nowrap">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "nav-tab shrink-0",
              activeCategory === "all" ? "nav-tab-pink nav-tab-active" : "nav-tab-pink"
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
                "nav-tab shrink-0 nav-tab-blue",
                activeCategory === category.id && "nav-tab-active"
              )}
            >
              {category.name}
            </button>
          ))}
        </ScrollReveal>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 justify-items-center">
            {filtered.map((product, i) => (
              <ShowcaseCard
                key={product.id}
                product={product}
                index={i}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
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
