"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useToastStore } from "@/lib/store/toast-store";

export function AddToCartToast() {
  const message = useToastStore((s) => s.message);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-2xl glass px-5 py-3 shadow-xl border border-brand-green/20"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <Check className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
