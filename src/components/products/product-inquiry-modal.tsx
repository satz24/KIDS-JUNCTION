"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Tag, Minus, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryName } from "@/lib/data/categories";
import { useCartStore } from "@/lib/store/cart-store";
import { useToastStore } from "@/lib/store/toast-store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductInquiryModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductInquiryModal({
  product,
  open,
  onOpenChange,
}: ProductInquiryModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize(undefined);
    }
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, product.colors?.[0]);
    showToast(`${product.name} added to cart`);
    onOpenChange(false);
    setQuantity(1);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setQuantity(1);
      }}
    >
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative aspect-[4/3] sm:aspect-video bg-muted">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-brand-pink text-white border-0">
                -{calculateDiscount(product.price, product.originalPrice!)}% OFF
              </Badge>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                {getCategoryName(product.category)}
              </Badge>
              <h2 className="font-display text-2xl font-bold">{product.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow text-yellow" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-muted-foreground text-sm">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-brand-green">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-muted-foreground line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {product.sizes && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" /> Select Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
                        selectedSize === size
                          ? "border-brand-green bg-brand-green/10 text-brand-green"
                          : "hover:border-brand-green/50"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              variant="gradient"
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </Button>

            {product.sizes && !selectedSize && (
              <p className="text-xs text-center text-brand-pink">Please select a size</p>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
