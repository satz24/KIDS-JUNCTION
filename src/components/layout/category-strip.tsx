"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/use-catalog";
import { CategoryCircleImage } from "@/components/products/category-circle-image";
import { cn } from "@/lib/utils";

export function CategoryStrip() {
  const pathname = usePathname();
  const { categories, loading } = useCategories();

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

  if (loading && categories.length === 0) {
    return (
      <div className="border-b border-[var(--glass-border)] bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-3 py-2">
          <p className="text-center text-[10px] text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div
      id="collections"
      className="border-b border-[var(--glass-border)] bg-white/80 backdrop-blur-sm theme-surface"
    >
      <div className="container mx-auto px-3 py-3 sm:py-4">
        <div className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto no-scrollbar items-start justify-start sm:justify-center">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="shrink-0 group flex flex-col items-center w-[5.75rem] sm:w-[6.75rem] md:w-[7.5rem]"
            >
              <CategoryCircleImage
                src={category.image_url}
                alt={category.name}
                size="md"
                className={cn(
                  "shadow-sm group-hover:shadow-md group-hover:ring-brand-pink/40",
                  "transition-all duration-200 group-hover:-translate-y-0.5"
                )}
                contain={!category.image_url?.startsWith("http")}
              />
              <p className="mt-2 text-center text-[11px] sm:text-xs md:text-sm font-bold text-brand-pink leading-tight line-clamp-2 group-hover:text-brand-pink-dark transition-colors">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
