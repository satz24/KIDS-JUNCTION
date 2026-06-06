"use client";

import { useCategories } from "@/hooks/use-catalog";
import { CategorySlider } from "@/components/categories/category-slider";
import { DecorativeBg } from "@/components/shared/decorative-bg";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function CollectionsSection() {
  const { categories, loading } = useCategories();

  return (
    <section
      id="collection"
      className="py-14 md:py-20 relative overflow-hidden section-bg-pink section-glow theme-surface premium-section"
    >
      <DecorativeBg variant="pink" />
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-8 md:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-pink/80 mb-2">
            Curated for little ones
          </p>
          <h2 className="font-display heading-lg mb-3">
            Shop by <span className="text-gradient-brand">Collection</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Everything your little one needs — from just born essentials to toys & rides
          </p>
        </ScrollReveal>

        <ScrollReveal>
          {loading ? (
            <p className="text-center text-muted-foreground text-sm">Loading categories...</p>
          ) : (
            <CategorySlider categories={categories} variant="showcase" />
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
