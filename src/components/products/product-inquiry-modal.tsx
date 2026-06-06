"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Tag, Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ProductPriceDisplay, hasProductDiscount } from "@/components/products/product-price-display";
import { getCategoryName } from "@/lib/data/categories";
import { useCartStore } from "@/lib/store/cart-store";
import { useToastStore } from "@/lib/store/toast-store";
import { fetchProductById, isSupabaseConfigured } from "@/lib/supabase/queries";
import { calculateDiscount } from "@/lib/utils";
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
  const [displayProduct, setDisplayProduct] = useState<Product | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    if (!open || !product) {
      setDisplayProduct(null);
      return;
    }

    setDisplayProduct(product);

    let cancelled = false;
    (async () => {
      if (!isSupabaseConfigured) return;
      const fresh = await fetchProductById(product.id);
      if (!cancelled && fresh) {
        setDisplayProduct(fresh);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, product]);

  useEffect(() => {
    const active = displayProduct ?? product;
    if (active?.sizes?.length) {
      setSelectedSize(active.sizes[0]);
    } else {
      setSelectedSize(undefined);
    }
    setQuantity(1);
  }, [displayProduct, product]);

  if (!product) return null;

  const viewProduct = displayProduct ?? product;

  const hasDiscount = hasProductDiscount(viewProduct);

  const handleAddToCart = () => {
    addItem(viewProduct, quantity, selectedSize, viewProduct.colors?.[0]);
    showToast(`${viewProduct.name} added to cart`);
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
      <DialogContent className="product-inquiry-modal max-w-3xl p-0 gap-0 max-h-[92vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start min-h-0"
        >
          <div className="relative border-b md:border-b-0 md:border-r border-[var(--glass-border)] md:sticky md:top-0">
            <ProductImageGallery images={viewProduct.images} alt={viewProduct.name} />
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 z-10 bg-brand-pink text-white border-0 shadow-md">
                -{calculateDiscount(viewProduct.price, viewProduct.originalPrice!)}% OFF
              </Badge>
            )}
          </div>

          <div className="flex flex-col min-h-0 md:max-h-[min(85vh,680px)]">
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2 uppercase tracking-wider text-[10px] font-bold">
                  {getCategoryName(viewProduct.category)}
                </Badge>
                <DialogTitle className="font-display text-xl sm:text-2xl font-bold leading-tight">
                  {viewProduct.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{viewProduct.brand}</p>
                {viewProduct.images.length > 1 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {viewProduct.images.length} photos — tap thumbnails or use arrows to browse
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-2 flex-wrap">
                <ProductPriceDisplay product={viewProduct} size="lg" />
                {viewProduct.inStock ? (
                  <span className="text-xs font-semibold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
                    In stock · {viewProduct.stockCount} left
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                    Out of stock
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {viewProduct.longDescription || viewProduct.description}
              </p>

              {viewProduct.sizes && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" /> Select Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {viewProduct.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-sm font-medium transition-all",
                          selectedSize === size
                            ? "border-brand-green bg-gradient-to-r from-brand-pink/10 to-brand-green/10 text-brand-green-dark shadow-sm"
                            : "hover:border-brand-green/50 bg-white/50"
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
                <div className="inline-flex items-center gap-2 rounded-full glass px-1 py-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="shrink-0 p-5 sm:p-6 pt-0 md:pt-0 border-t border-[var(--glass-border)] bg-white/40 backdrop-blur-sm">
              <Button
                size="lg"
                variant="gradient"
                className="w-full btn-gradient btn-shine"
                onClick={handleAddToCart}
                disabled={
                  !viewProduct.inStock ||
                  (viewProduct.sizes && viewProduct.sizes.length > 0 && !selectedSize)
                }
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>
              {viewProduct.sizes && !selectedSize && (
                <p className="text-xs text-center text-brand-pink mt-2">Please select a size</p>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
