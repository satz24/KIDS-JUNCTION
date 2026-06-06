"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { ProductBadges } from "@/components/products/product-badges";
import {
  hasProductDiscount,
  ProductPriceDisplay,
} from "@/components/products/product-price-display";
import { Magnetic } from "@/components/shared/magnetic";
import { RippleButton } from "@/components/shared/ripple-button";
import { Badge } from "@/components/ui/badge";
import { getCategoryName } from "@/lib/data/categories";
import { getProductBadges } from "@/lib/products/product-badges";
import { useCartStore } from "@/lib/store/cart-store";
import { useToastStore } from "@/lib/store/toast-store";
import { resolveImageSrc } from "@/lib/brand/logo-asset";
import { calculateDiscount } from "@/lib/utils";
import { productThumbContainerClass, productThumbImageClass } from "@/lib/product-image-styles";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ShowcaseCardProps {
  product: Product;
  index?: number;
  variant?: "grid" | "slider";
  onSelect: (product: Product) => void;
}

export function ShowcaseCard({
  product,
  index = 0,
  variant = "grid",
  onSelect,
}: ShowcaseCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const badges = getProductBadges(product);
  const discounted = hasProductDiscount(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: variant === "slider" ? 0 : index * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className={cn(
        "group text-left w-full mx-auto premium-product-card",
        variant === "slider" ? "max-w-[240px]" : "max-w-[220px]"
      )}
      data-cursor-card
    >
      <button
        type="button"
        onClick={() => onSelect(product)}
        className={cn(
          "premium-product-card__media relative overflow-hidden w-full block mb-3",
          productThumbContainerClass
        )}
      >
        <div className="premium-product-card__glow" aria-hidden />
        <Image
          src={resolveImageSrc(product.images[0])}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 45vw, 200px"
          className={cn(productThumbImageClass, "premium-product-card__image")}
          loading="lazy"
          unoptimized
        />
        <div className="premium-product-card__shine" aria-hidden />

        <ProductBadges badges={badges} className="absolute top-3 left-3 z-10" />
        {discounted && (
          <Badge className="absolute top-3 right-3 z-10 bg-brand-pink text-white border-0 shadow-md text-[10px]">
            -{calculateDiscount(product.price, product.originalPrice)}%
          </Badge>
        )}

        <span className="absolute bottom-3 left-3 right-3 z-10 premium-product-card__view">
          <Eye className="h-3.5 w-3.5" /> View Details
        </span>
      </button>

      <div className="premium-product-card__body space-y-2.5 px-1">
        <button type="button" onClick={() => onSelect(product)} className="text-left w-full">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-blue/80 mb-1">
            {getCategoryName(product.category)}
          </p>
          <h3 className="font-display font-bold text-sm leading-tight line-clamp-1 group-hover:text-brand-pink transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
            {product.description}
          </p>
        </button>
        <div className="flex items-center justify-between gap-2">
          <ProductPriceDisplay product={product} size="md" />
          <Magnetic strength={0.18}>
            <RippleButton
              size="sm"
              variant="gradient"
              className="h-9 text-xs px-4 rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add
            </RippleButton>
          </Magnetic>
        </div>
      </div>
    </motion.article>
  );
}
