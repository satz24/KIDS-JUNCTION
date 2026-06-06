"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/use-catalog";
import { CategoryCircleImage } from "@/components/products/category-circle-image";
import { categoryImageUsesContain } from "@/lib/brand/category-image";

export function CategoryStrip() {
  const pathname = usePathname();
  const { categories, loading } = useCategories();

  if (pathname !== "/") {
    return null;
  }

  if (loading && categories.length === 0) {
    return (
      <div className="category-strip theme-surface">
        <div className="container mx-auto px-3 py-4">
          <p className="text-center text-xs text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div id="collections" className="category-strip theme-surface">
      <div className="container mx-auto px-3 py-5 sm:py-6">
        <div className="flex flex-wrap gap-5 sm:gap-6 md:gap-7 items-start justify-center">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="category-bubble group"
              style={{ animationDelay: `${index * 0.08}s` }}
              data-cursor-card
            >
              <div className="category-bubble__ring">
                <div className="category-bubble__inner glass">
                  <CategoryCircleImage
                    src={category.image_url}
                    alt={category.name}
                    size="md"
                    className="ring-0 shadow-none transition-transform duration-300 group-hover:scale-105"
                    contain={categoryImageUsesContain(category.image_url)}
                  />
                </div>
              </div>
              <p className="category-bubble__label">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
