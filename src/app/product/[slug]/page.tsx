"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useProduct } from "@/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useToastStore } from "@/lib/store/toast-store";
import { formatPrice } from "@/lib/utils";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { product, loading } = useProduct(slug);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground theme-surface min-h-screen">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center theme-surface min-h-screen">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Link href="/collection"><Button variant="gradient">Browse Collection</Button></Link>
      </div>
    );
  }

  return (
    <div className="section-bg-blue theme-surface min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4">
        <Link href="/collection" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand-pink mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="glass-card rounded-[2rem] overflow-hidden p-4">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full aspect-square object-contain rounded-[1.5rem] bg-white"
              priority
              unoptimized={product.images[0].startsWith("http") === false}
            />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-brand-pink font-bold capitalize mb-1">{product.category.replace(/-/g, " ")}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold">{product.name}</h1>
              <p className="text-2xl font-bold text-brand-green mt-3">{formatPrice(product.price)}</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            <p className="text-sm text-muted-foreground">Stock: {product.stockCount > 0 ? product.stockCount : "Out of stock"}</p>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
              <span className="font-bold w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>+</Button>
            </div>

            <Button
              size="lg"
              variant="gradient"
              className="w-full sm:w-auto"
              disabled={!product.inStock}
              onClick={() => {
                addItem(product, quantity);
                showToast(`${product.name} added to cart`);
              }}
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
