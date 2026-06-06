"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { DbSubCategory } from "@/types/database";

interface SubCategoryStripProps {
  subCategories: DbSubCategory[];
  selectedId: string | null;
  onSelect: (subCategoryId: string | null) => void;
}

function getSubCategoryLabel(sub: DbSubCategory, all: DbSubCategory[]): string {
  const sameName = all.filter((item) => item.name === sub.name);
  if (sameName.length <= 1) return sub.name;
  const index = sameName.findIndex((item) => item.id === sub.id);
  return `${sub.name} ${index + 1}`;
}

export function SubCategoryStrip({
  subCategories,
  selectedId,
  onSelect,
}: SubCategoryStripProps) {
  const labels = useMemo(
    () =>
      subCategories.map((sub) => ({
        sub,
        label: getSubCategoryLabel(sub, subCategories),
      })),
    [subCategories]
  );

  if (subCategories.length === 0) return null;

  return (
    <div className="mb-6 -mx-1">
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all border",
            selectedId === null
              ? "gradient-brand text-white border-transparent shadow-md"
              : "glass-card text-muted-foreground hover:text-brand-pink hover:border-brand-pink/30"
          )}
        >
          All
        </button>
        {labels.map(({ sub, label }) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSelect(sub.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all border whitespace-nowrap",
              selectedId === sub.id
                ? "gradient-brand text-white border-transparent shadow-md"
                : "glass-card text-muted-foreground hover:text-brand-pink hover:border-brand-pink/30"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
