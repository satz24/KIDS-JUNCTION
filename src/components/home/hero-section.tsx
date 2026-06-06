"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, ShoppingBag, Star } from "lucide-react";
import { storeInfo } from "@/lib/data/store";
import { STORE_FRONT_ALT, STORE_FRONT_SRC } from "@/lib/brand/logo-asset";
import { Magnetic } from "@/components/shared/magnetic";
import { RippleButton } from "@/components/shared/ripple-button";
import { HeroReviewCarousel } from "@/components/home/hero-review-carousel";

const whatsappOrderLink = `${storeInfo.whatsappLink}?text=${encodeURIComponent("Hi Kids Junction! I want to place an order")}`;

export function HeroSection() {
  return (
    <section id="home" className="hero-mesh relative overflow-hidden min-h-[92vh] flex items-center theme-surface">
      <div className="hero-mesh__blobs" aria-hidden>
        <span className="hero-mesh__blob hero-mesh__blob--pink" />
        <span className="hero-mesh__blob hero-mesh__blob--blue" />
        <span className="hero-mesh__blob hero-mesh__blob--mint" />
      </div>

      <div className="container mx-auto px-4 py-14 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 xl:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 text-center lg:text-left min-w-0 order-2 lg:order-1"
          >
            <h1 className="hero-headline font-display">
              <span className="hero-headline__line">Where Little</span>
              <span className="hero-headline__dreams">Dreams</span>
              <span className="hero-headline__line">Come Alive</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
              Discover premium kids clothing & toys at Kids Junction. Add to cart and place
              your order instantly via WhatsApp — simple, fast, and personal.
            </p>

            <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
              <Magnetic strength={0.2}>
                <RippleButton variant="gradient" size="lg" className="btn-gradient btn-shine" asChild>
                  <Link href="/#collection">
                    <ShoppingBag className="h-4 w-4" />
                    Shop Now
                  </Link>
                </RippleButton>
              </Magnetic>
              <Magnetic strength={0.16}>
                <RippleButton variant="outline" size="lg" className="btn-glass-outline" asChild>
                  <a href={whatsappOrderLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Order
                  </a>
                </RippleButton>
              </Magnetic>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="hero-right-stack relative min-w-0 order-1 lg:order-2 max-w-lg mx-auto lg:mx-0 lg:ml-auto w-full"
          >
            <HeroReviewCarousel className="hero-right-stack__reviews" />

            <div className="hero-right-stack__image relative w-full aspect-[4/3] group">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-3 right-3 z-20 glass trust-chip animate-float"
              >
                <Heart className="h-3.5 w-3.5 text-brand-pink fill-brand-pink/30 inline mr-1" />
                Parent Trusted
              </motion.div>

              <div className="hero-store-frame relative z-10 overflow-hidden rounded-3xl h-full">
                <Image
                  src={STORE_FRONT_SRC}
                  alt={STORE_FRONT_ALT}
                  fill
                  sizes="(max-width: 1024px) 90vw, 520px"
                  className="object-cover object-[center_38%] product-image-zoom"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-brand-pink/10" />
                <div className="absolute inset-x-0 bottom-0 px-5 py-4">
                  <p className="text-white text-sm font-bold drop-shadow-sm">Visit us on G.S.T. Road</p>
                  <p className="text-white/90 text-xs">Guduvanchery&apos;s No.1 baby shop</p>
                </div>
              </div>

              <Star className="absolute -bottom-2 -left-2 h-8 w-8 text-brand-yellow fill-brand-yellow/40 opacity-80 animate-pulse-soft hidden sm:block" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
