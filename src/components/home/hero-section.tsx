"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Shirt,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingElements } from "@/components/shared/floating-elements";
import { LogoMark, BrandTitle } from "@/components/brand/logo";
import { storeInfo } from "@/lib/data/store";

const trustBadges = [
  { icon: Shirt, text: "Affordable Kids Fashion", color: "text-brand-green" },
  { icon: Sparkles, text: "Premium Toys Collection", color: "text-brand-pink" },
  { icon: Shield, text: "Best Quality for Kids", color: "text-brand-green" },
];

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden gradient-hero min-h-[92vh] flex items-center">
      <FloatingElements dense />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-semibold">
                <span className="text-brand-green italic">{storeInfo.tagline}</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="space-y-4 flex flex-col items-center lg:items-start"
            >
              <LogoMark className="h-16 w-16 text-2xl rounded-2xl shadow-xl animate-wiggle" />
              <BrandTitle size="lg" className="text-center lg:text-left" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.12]"
            >
              Where Little{" "}
              <span className="text-gradient-brand">Dreams</span> Come Alive
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Discover premium kids clothing & toys at Kids Junction. Add to cart and
              place your order instantly via WhatsApp — simple, fast, and personal.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link href="#collection">
                <Button size="xl" variant="gradient" className="w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/collection">
                <Button size="xl" variant="outline" className="w-full sm:w-auto glass">
                  Explore Collection
                </Button>
              </Link>
              <a href={storeInfo.whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="xl" variant="outline" className="w-full sm:w-auto border-brand-green/30">
                  <MessageCircle className="h-5 w-5 text-brand-green" />
                  Contact WhatsApp
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 justify-center lg:justify-start pt-2"
            >
              {trustBadges.map(({ icon: Icon, text, color }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm glass rounded-xl px-3 py-2"
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-[3rem] gradient-brand opacity-20 blur-3xl animate-pulse-soft" />
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl ring-4 ring-white/40"
              >
                <Image
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=800&fit=crop"
                  alt="Kids Junction store showcase"
                  width={600}
                  height={600}
                  className="object-cover"
                  priority
                />
              </motion.div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-8 top-1/4 z-20 glass rounded-2xl p-3 shadow-xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"
                  alt="Toys"
                  width={72}
                  height={72}
                  className="rounded-xl"
                />
                <p className="text-xs font-bold mt-2 text-brand-pink">Soft Toys</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -right-6 bottom-1/4 z-20 glass rounded-2xl p-3 shadow-xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1515488042361-ee00e017ddd1?w=200&h=200&fit=crop"
                  alt="Kids wear"
                  width={72}
                  height={72}
                  className="rounded-xl"
                />
                <p className="text-xs font-bold mt-2 text-brand-green">Kids Wear</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
