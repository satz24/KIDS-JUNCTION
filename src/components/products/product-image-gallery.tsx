"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { getProductGalleryImages } from "@/lib/products/product-images";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ProductImageGallery({ images, alt, className }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = useMemo(() => getProductGalleryImages(images), [images]);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const goPrev = () => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % gallery.length);

  const hasMultiple = gallery.length > 1;

  return (
    <div className={cn("product-modal-gallery", className)}>
      <div className="product-modal-gallery__main relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${gallery[activeIndex]}-${activeIndex}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={gallery[activeIndex]}
              alt={`${alt} — photo ${activeIndex + 1} of ${gallery.length}`}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-contain p-4 md:p-6"
              priority={activeIndex === 0}
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="product-modal-gallery__nav product-modal-gallery__nav--prev"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="product-modal-gallery__nav product-modal-gallery__nav--next"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <span className="product-modal-gallery__counter">
          <Images className="h-3 w-3" />
          {activeIndex + 1}/{gallery.length}
        </span>
      </div>

      <div className="product-modal-gallery__thumbs" aria-label="All product photos">
        {gallery.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "product-modal-gallery__thumb",
              index === activeIndex && "product-modal-gallery__thumb--active"
            )}
            aria-label={`View photo ${index + 1} of ${gallery.length}`}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="72px"
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  );
}
