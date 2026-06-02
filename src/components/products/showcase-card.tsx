"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/shared/tilt-card";
import { getCategoryName } from "@/lib/data/categories";
import { useCartStore } from "@/lib/store/cart-store";
import { useToastStore } from "@/lib/store/toast-store";
import { resolveImageSrc } from "@/lib/brand/logo-asset";
import { formatPrice } from "@/lib/utils";
import { productThumbContainerClass, productThumbImageClass } from "@/lib/product-image-styles";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ShowcaseCardProps {
  product: Product;
  index?: number;
  onSelect: (product: Product) => void;
}

export function ShowcaseCard({ product, index = 0, onSelect }: ShowcaseCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const blobClass = index % 2 === 0 ? "blob-card" : "blob-card-alt";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group text-left w-full max-w-[220px] mx-auto"
    >
      <TiltCard className="relative">
        <button
          type="button"
          onClick={() => onSelect(product)}
          className={cn(
            "relative overflow-hidden glass-card mb-3 w-full block transition-all duration-500",
            productThumbContainerClass,
            blobClass
          )}
        >
          <Image
            src={resolveImageSrc(product.images[0])}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 45vw, 180px"
            className={cn(productThumbImageClass, "product-image-zoom")}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/20 via-transparent to-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <Badge className="surface-badge border-0 text-[10px] font-bold shadow-sm backdrop-blur-sm">
              {getCategoryName(product.category)}
            </Badge>
            {product.featured && (
              <Badge className="gradient-brand text-white border-0 text-[10px] font-bold shadow-md">
                Featured
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full surface-badge px-2 py-1 text-[10px] font-bold shadow-sm">
            <Star className="h-3 w-3 fill-yellow text-yellow" />
            {product.rating}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <span className="text-foreground text-xs font-bold flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
              <Eye className="h-3.5 w-3.5" /> View Details
            </span>
          </div>
        </button>
      </TiltCard>

      <div className="space-y-2.5 px-1">
        <button type="button" onClick={() => onSelect(product)} className="text-left w-full">
          <h3 className="font-bold text-sm leading-tight line-clamp-1 group-hover:text-brand-pink transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
            {product.description}
          </p>
        </button>
        <div className="flex items-center justify-between gap-2">
          <p className="font-extrabold text-lg text-gradient-brand">{formatPrice(product.price)}</p>
          <Button size="sm" variant="gradient" className="h-9 text-xs px-4 rounded-full" onClick={handleAddToCart}>
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
