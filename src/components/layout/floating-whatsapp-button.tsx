"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { storeInfo } from "@/lib/data/store";

export function FloatingWhatsAppButton() {
  return (
    <AnimatePresence>
      <motion.a
        href={storeInfo.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-20 md:bottom-6 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 hover:shadow-2xl transition-shadow md:left-auto md:right-20"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </motion.a>
    </AnimatePresence>
  );
}
