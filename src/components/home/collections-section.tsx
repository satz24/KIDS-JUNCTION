"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/use-catalog";
import { CategoryCircleImage } from "@/components/products/category-circle-image";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { cn } from "@/lib/utils";

export function CollectionsSection() {
  const { categories, loading } = useCategories();

  return (
    <section id="collections" className="py-14 md:py-20 relative overflow-hidden section-bg-pink section-glow theme-surface">
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-8 md:mb-10">
          <h2 className="font-display heading-lg mb-3">
            Shop by <span className="text-brand-pink">Collection</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Everything your little one needs — from just born essentials to toys & rides
          </p>
        </ScrollReveal>

        <ScrollReveal>
          {loading ? (
            <p className="text-center text-muted-foreground text-sm">Loading categories...</p>
          ) : (
            <div className="flex gap-5 md:gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0 md:justify-center md:flex-wrap">
              {categories.map((collection, index) => (
                <Link
                  key={collection.id}
                  href={`/category/${collection.id}`}
                  className="shrink-0 group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06, duration: 0.35 }}
                    whileHover={{ y: -4 }}
                    className="flex flex-col items-center w-[5.5rem] sm:w-[6.5rem] md:w-[7.5rem]"
                  >
                    <CategoryCircleImage
                      src={collection.image_url}
                      alt={collection.name}
                      size="lg"
                      className={cn(
                        "group-hover:ring-brand-pink/30",
                        "shadow-[0_8px_24px_rgba(255,95,183,0.12)] group-hover:shadow-[0_16px_40px_rgba(98,182,255,0.18)]",
                        "transition-all duration-300 group-hover:-translate-y-1"
                      )}
                      contain={!collection.image_url?.startsWith("http")}
                    />
                    <p className="mt-3 text-center text-xs sm:text-sm font-bold text-brand-pink leading-tight max-w-[6.5rem] group-hover:text-brand-pink-dark transition-colors">
                      {collection.name}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
