"use client";

import Link from "next/link";
import { CategoryCircleImage } from "@/components/products/category-circle-image";
import { categoryImageUsesContain } from "@/lib/brand/category-image";
import type { DbCategory } from "@/types/database";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
  categories: DbCategory[];
  variant?: "strip" | "showcase";
  className?: string;
}

export function CategoryGrid({
  categories,
  variant = "strip",
  className,
}: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <div className={cn("category-grid", className)}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className="premium-category-card premium-category-card--grid group"
          data-cursor-card
        >
          <div
            className={cn(
              "premium-category-card__shell",
              variant === "showcase" && "premium-category-card__shell--lg"
            )}
          >
            <div className="premium-category-card__glow" aria-hidden />
            <div className="premium-category-card__glass premium-glass-v2">
              <CategoryCircleImage
                src={category.image_url}
                alt={category.name}
                size={variant === "showcase" ? "lg" : "md"}
                className="premium-category-card__image ring-0 shadow-none group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                contain={categoryImageUsesContain(category.image_url)}
              />
            </div>
          </div>
          <p
            className={cn(
              "premium-category-card__label",
              variant === "showcase" && "premium-category-card__label--lg"
            )}
          >
            {category.name}
          </p>
        </Link>
      ))}
    </div>
  );
}
