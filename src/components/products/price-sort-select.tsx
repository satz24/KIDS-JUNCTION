"use client";

import { PRICE_SORT_OPTIONS, type PriceSort } from "@/lib/products/sort-products";
import { cn } from "@/lib/utils";

interface PriceSortSelectProps {
  sort: PriceSort;
  onSortChange: (sort: PriceSort) => void;
  className?: string;
}

export function PriceSortSelect({ sort, onSortChange, className }: PriceSortSelectProps) {
  return (
    <select
      aria-label="Sort products by price"
      className={cn(
        "rounded-lg surface-input px-2 py-1.5 text-xs font-medium text-muted-foreground",
        "w-auto max-w-[10.5rem] shrink-0",
        className
      )}
      value={sort}
      onChange={(e) => onSortChange(e.target.value as PriceSort)}
    >
      {PRICE_SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
