"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategoryName } from "@/lib/data/categories";
import { useCartStore } from "@/lib/store/cart-store";
import { useToastStore } from "@/lib/store/toast-store";
import { formatPrice } from "@/lib/utils";
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group text-left w-full"
    >
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="relative overflow-hidden rounded-2xl bg-muted aspect-[4/5] mb-3 shadow-sm group-hover:shadow-xl transition-shadow duration-300 w-full block"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover product-image-zoom"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-foreground border-0 text-[10px]">
            {getCategoryName(product.category)}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-white text-xs font-medium flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> Details
          </span>
        </div>
      </button>

      <div className="space-y-2 px-1">
        <button type="button" onClick={() => onSelect(product)} className="text-left w-full">
          <h3 className="font-medium text-sm leading-tight line-clamp-1 group-hover:text-brand-green transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
            {product.description}
          </p>
        </button>
        <div className="flex items-center justify-between gap-2">
          <p className={cn("font-bold text-brand-pink")}>{formatPrice(product.price)}</p>
          <Button size="sm" variant="gradient" className="h-8 text-xs px-3" onClick={handleAddToCart}>
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
