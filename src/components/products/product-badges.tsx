import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/lib/products/product-badges";

const toneClass: Record<ProductBadge["type"], string> = {
  "new-arrival": "product-badge--new",
  trending: "product-badge--trending",
  "best-seller": "product-badge--best",
  "limited-stock": "product-badge--limited",
};

export function ProductBadges({
  badges,
  className,
}: {
  badges: ProductBadge[];
  className?: string;
}) {
  if (badges.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {badges.map((badge) => (
        <span key={badge.type} className={cn("product-badge", toneClass[badge.type])}>
          {badge.label}
        </span>
      ))}
    </div>
  );
}
