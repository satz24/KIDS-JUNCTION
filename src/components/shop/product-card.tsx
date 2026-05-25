"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
}

export function ProductCard({ product, className, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn("group", className)}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative overflow-hidden rounded-2xl bg-muted aspect-square mb-3">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover product-image-zoom"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <Badge className="bg-destructive text-white border-0 shadow-md">
                -{calculateDiscount(product.price, product.originalPrice!)}%
              </Badge>
            )}
            {product.trending && (
              <Badge className="bg-brand-green text-white border-0 shadow-md">
                Trending
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                inWishlist ? "fill-brand-pink text-brand-pink" : "text-gray-600"
              )}
            />
          </button>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full shadow-lg"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-brand-green transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow text-yellow" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-green">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
