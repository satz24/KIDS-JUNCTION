"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Shield,
  Shirt,
  Sparkles as SparklesIcon,
  Heart,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const trustBadges = [
  {
    icon: Shirt,
    text: "Affordable Kids Fashion",
    accent: "nav-tab-blue" as const,
    iconColor: "text-brand-blue",
  },
  {
    icon: SparklesIcon,
    text: "Premium Toys Collection",
    accent: "nav-tab-pink" as const,
    iconColor: "text-brand-pink",
  },
  {
    icon: Shield,
    text: "Best Quality for Kids",
    accent: "nav-tab-green" as const,
    iconColor: "text-brand-green",
  },
];

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden gradient-hero min-h-[92vh] flex items-center theme-surface">
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
          <div className="space-y-6 text-center lg:text-left min-w-0 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display heading-xl"
            >
              Where Little{" "}
              <span className="text-gradient-brand">Dreams</span> Come Alive
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Discover premium kids clothing & toys at Kids Junction. Add to cart and
              place your order instantly via WhatsApp — simple, fast, and personal.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-2.5 justify-center lg:justify-start pt-1 max-w-lg mx-auto lg:mx-0"
            >
              {trustBadges.map(({ icon: Icon, text, accent, iconColor }, i) => (
                <motion.div
                  key={text}
                  whileHover={{ y: -3 }}
                  className={cn("hero-trust-tag nav-tab", accent)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                >
                  <Icon className={cn("h-3.5 w-3.5 shrink-0", iconColor)} strokeWidth={2.5} />
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block min-w-0 pl-4 xl:pl-8"
          >
            <div className="relative w-full aspect-square max-w-md xl:max-w-lg mx-auto group">
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 right-0 xl:-right-2 z-20 glass-card rounded-2xl px-4 py-3 flex items-center gap-2"
              >
                <Heart className="h-4 w-4 text-brand-pink fill-brand-pink/30" />
                <span className="text-xs font-bold text-brand-pink">Parent Trusted</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-2 left-0 xl:-left-4 z-20 glass-card rounded-2xl px-4 py-3 flex items-center gap-2"
              >
                <Star className="h-4 w-4 text-brand-blue fill-brand-blue/30" />
                <span className="text-xs font-bold text-brand-blue">Premium Quality</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 hero-frame rounded-[2.75rem] p-3 group-hover:shadow-[0_30px_70px_rgba(255,95,183,0.2)] transition-shadow duration-500"
              >
                <div className="relative overflow-hidden rounded-[2.25rem]">
                  <Image
                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=800&fit=crop"
                    alt="Kids Junction store showcase"
                    width={600}
                    height={600}
                    className="object-cover product-image-zoom"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/10 via-transparent to-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
