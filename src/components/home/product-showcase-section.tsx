"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
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
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const list =
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory);
    return showAll ? list : list.slice(0, limit);
  }, [activeCategory, limit, showAll]);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <section id="collection" className="py-16 md:py-24 section-glow relative">
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Our <span className="text-brand-pink">Collection</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse our collection, add to cart, and order via WhatsApp in minutes.
          </p>
        </ScrollReveal>

        <ScrollReveal className="flex gap-2 overflow-x-auto no-scrollbar pb-6 justify-start md:justify-center">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeCategory === "all"
                ? "gradient-brand text-white shadow-md"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === cat.id
                  ? "gradient-brand text-white shadow-md"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {cat.name}
            </button>
          ))}
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <ShowcaseCard
              key={product.id}
              product={product}
              index={i}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {showViewAll && !showAll && products.length > limit && (
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
