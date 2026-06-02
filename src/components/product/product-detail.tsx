"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { getRelatedProducts, reviews } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);

  const related = getRelatedProducts(product);
  const inWishlist = isInWishlist(product.id);
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  useEffect(() => {
    addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8 md:py-12 pb-28 md:pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ScrollReveal>
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white group max-w-sm mx-auto w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-4 product-image-zoom"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                {hasDiscount && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-white border-0 text-sm">
                    -{calculateDiscount(product.price, product.originalPrice!)}% OFF
                  </Badge>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all",
                        selectedImage === i
                          ? "border-primary shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {product.brand}
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(product.rating)
                            ? "fill-yellow text-yellow"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {product.sizes && (
                <div>
                  <p className="font-medium mb-2 text-sm">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : "hover:border-primary/50"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && (
                <div>
                  <p className="font-medium mb-2 text-sm">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                          selectedColor === color
                            ? "border-primary bg-primary/10 text-primary"
                            : "hover:border-primary/50"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="font-medium mb-2 text-sm">Quantity</p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="hidden md:flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" /> Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toggleItem(product)}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      inWishlist && "fill-pink text-pink"
                    )}
                  />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                {[
                  { icon: Truck, text: "Free shipping $50+" },
                  { icon: Shield, text: "Safety certified" },
                  { icon: RotateCcw, text: "30-day returns" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center text-center gap-1.5">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="delivery">Delivery Info</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <p>{product.longDescription}</p>
                <div className="flex flex-wrap gap-2 mt-4 not-prose">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6 space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-4 p-4 rounded-2xl border">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{review.author}</span>
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow text-yellow" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="delivery" className="mt-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Standard Shipping:</strong>{" "}
                  3-5 business days. Free on orders over $50.
                </p>
                <p>
                  <strong className="text-foreground">Express Shipping:</strong>{" "}
                  1-2 business days. $9.99 flat rate.
                </p>
                <p>
                  <strong className="text-foreground">Returns:</strong> 30-day
                  hassle-free returns. Items must be unworn with tags attached.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollReveal>

        {related.length > 0 && (
          <ScrollReveal className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>

      <div className="fixed bottom-16 md:hidden left-0 right-0 z-40 glass border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-bold text-primary">{formatPrice(product.price)}</p>
            <p className="text-xs text-muted-foreground truncate">{product.name}</p>
          </div>
          <Button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1">
            {addedToCart ? (
              <>
                <Check className="h-4 w-4" /> Added!
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
