import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductPriceDisplayProps = {
  product: Pick<Product, "price" | "originalPrice">;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function hasProductDiscount(
  product: Pick<Product, "price" | "originalPrice">
): product is Product & { originalPrice: number } {
  return typeof product.originalPrice === "number" && product.originalPrice > product.price;
}

export function ProductPriceDisplay({
  product,
  size = "md",
  className,
}: ProductPriceDisplayProps) {
  const discounted = hasProductDiscount(product);

  return (
    <div className={cn("flex items-baseline gap-1.5 flex-wrap", className)}>
      <span
        className={cn(
          "font-extrabold text-gradient-brand",
          size === "sm" && "text-sm",
          size === "md" && "text-lg",
          size === "lg" && "text-2xl sm:text-3xl"
        )}
      >
        {formatPrice(product.price)}
      </span>
      {discounted && (
        <span
          className={cn(
            "text-muted-foreground line-through font-medium",
            size === "sm" && "text-[10px]",
            size === "md" && "text-xs",
            size === "lg" && "text-sm"
          )}
        >
          {formatPrice(product.originalPrice)}
        </span>
      )}
    </div>
  );
}
