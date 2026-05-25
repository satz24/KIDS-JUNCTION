"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/scroll-reveal";

export function FeaturedCategories() {
  return (
    <section className="py-16 md:py-24 section-glow relative">
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Shop by <span className="text-brand-green">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Discover our curated collections designed for every age and adventure
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <StaggerItem key={category.name}>
              <Link href={`/shop?category=${category.id}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-white font-bold text-base md:text-lg">
                          {category.name}
                        </h3>
                        <p className="text-white/80 text-xs mt-0.5 hidden sm:block">
                          {category.productCount} products
                        </p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <ArrowUpRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
