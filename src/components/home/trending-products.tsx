"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTrendingProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/shop/product-card";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";

export function TrendingProducts() {
  const products = getTrendingProducts();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-brand-green/5 to-brand-pink/5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Trending <span className="text-brand-pink">Now</span>
            </h2>
            <p className="text-muted-foreground">
              Most loved by parents and kids this week
            </p>
          </div>
          <Link href="/shop" className="hidden sm:block">
            <Button variant="ghost" className="gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </ScrollReveal>

        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] snap-start shrink-0"
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop">
            <Button variant="outline">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
