"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCategories, useProducts } from "@/hooks/use-catalog";
import { ShowcaseCard } from "@/components/products/showcase-card";
import { ProductInquiryModal } from "@/components/products/product-inquiry-modal";
import type { Product } from "@/types";

export function CategoryPageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { categories } = useCategories();
  const category = categories.find((c) => c.id === id);
  const { products, loading } = useProducts({ categoryId: id });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="section-bg-pink theme-surface min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4">
        <Link href="/#collections" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand-pink mb-6">
          <ArrowLeft className="h-4 w-4" /> All Collections
        </Link>
        <h1 className="font-display heading-lg mb-2">
          {category?.name ?? id}
        </h1>
        <p className="text-muted-foreground mb-10">
          {loading ? "Loading products..." : `${products.length} product(s)`}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 justify-items-center">
          {products.map((product, i) => (
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

        {!loading && products.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No products in this category yet.</p>
        )}
      </div>

      <ProductInquiryModal product={selectedProduct} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
