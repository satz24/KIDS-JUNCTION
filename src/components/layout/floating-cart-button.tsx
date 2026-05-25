"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function FloatingCartButton() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());

  const hiddenPaths = ["/cart", "/checkout", "/auth"];
  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;
  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-20 md:bottom-6 right-4 z-40 md:right-4"
      >
        <Link href="/cart">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 rounded-2xl gradient-brand px-5 py-3 shadow-xl shadow-primary/30 text-white"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-green">
                {itemCount}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs opacity-80">Cart</p>
              <p className="text-sm font-bold">{formatPrice(subtotal)}</p>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
