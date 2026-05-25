"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { galleryImages } from "@/lib/data/gallery";
import { storeInfo } from "@/lib/data/store";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { InstagramIcon } from "@/components/brand/social-icons";
import { cn } from "@/lib/utils";

export function GallerySection() {
  return (
    <section id="gallery" className="py-16 md:py-24 section-glow relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Store <span className="text-brand-pink">Gallery</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md">
              A peek inside Kids Junction — fashion, toys, and smiles
            </p>
          </div>
          <a
            href={storeInfo.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <InstagramIcon className="h-4 w-4" />
            Follow @{storeInfo.instagram.handle}
          </a>
        </ScrollReveal>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "relative break-inside-avoid overflow-hidden rounded-2xl group cursor-pointer",
                img.span === "tall" && "aspect-[3/4]",
                img.span === "wide" && "aspect-[4/3]",
                img.span === "normal" && "aspect-square"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs font-medium">{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
