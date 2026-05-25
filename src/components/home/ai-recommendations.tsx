"use client";

import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { getFeaturedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/shop/product-card";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";

export function AIRecommendations() {
  const recommendations = getFeaturedProducts().slice(0, 4);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="flex items-center gap-3 mb-10">
          <LogoMark className="h-10 w-10 shadow-lg" />
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Picked Just <span className="text-brand-pink">For You</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              AI-curated recommendations based on popular picks
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recommendations.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Discover More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
