"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function StickyMobileCartBar() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());

  if (pathname === "/cart" || itemCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-16 left-0 right-0 z-40 md:hidden px-4"
    >
      <Link href="/cart">
        <div className="flex items-center justify-between rounded-2xl gradient-brand px-5 py-3 shadow-xl text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full surface-badge ring-2 ring-white/30 text-[10px] font-bold text-brand-green shadow-sm">
                {itemCount}
              </span>
            </div>
            <span className="font-semibold text-sm">View Cart</span>
          </div>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
      </Link>
    </motion.div>
  );
}
