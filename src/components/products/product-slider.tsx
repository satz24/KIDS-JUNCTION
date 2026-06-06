"use client";

import { useId, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Mousewheel, Navigation, Pagination } from "swiper/modules";
import type { Product } from "@/types";
import { ShowcaseCard } from "@/components/products/showcase-card";
import { ProductInquiryModal } from "@/components/products/product-inquiry-modal";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProductSliderProps {
  products: Product[];
  loading?: boolean;
  className?: string;
}

export function ProductSlider({ products, loading, className }: ProductSliderProps) {
  const sliderId = useId().replace(/:/g, "");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const canLoop = products.length >= 4;

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="premium-slider-loading">
        <span className="premium-spinner" aria-hidden />
        <p className="text-sm text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-10 text-sm">
        No products in this collection yet.
      </p>
    );
  }

  return (
    <>
      <div className={cn("premium-product-slider", className)}>
        <Swiper
          modules={[Autoplay, FreeMode, Mousewheel, Navigation, Pagination]}
          loop={canLoop}
          freeMode={{ enabled: true, momentum: true }}
          mousewheel={{ forceToAxis: true }}
          autoplay={{
            delay: 3800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: `.premium-swiper-prev-${sliderId}`,
            nextEl: `.premium-swiper-next-${sliderId}`,
          }}
          pagination={{
            clickable: true,
            el: `.premium-swiper-pagination-${sliderId}`,
            bulletClass: "premium-swiper-bullet",
            bulletActiveClass: "premium-swiper-bullet--active",
          }}
          slidesPerView={1.35}
          spaceBetween={14}
          grabCursor
          speed={550}
          breakpoints={{
            480: { slidesPerView: 2.1, spaceBetween: 16 },
            768: { slidesPerView: 3.1, spaceBetween: 18 },
            1024: { slidesPerView: 4.1, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 22 },
          }}
          className="premium-swiper !overflow-visible !pb-12"
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id} className="!h-auto">
              <ShowcaseCard product={product} index={index} onSelect={handleSelect} variant="slider" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="premium-swiper-controls">
          <button
            type="button"
            className={`premium-swiper-prev-${sliderId} premium-swiper-arrow`}
            aria-label="Previous"
          >
            ‹
          </button>
          <div className={`premium-swiper-pagination-${sliderId} premium-swiper-pagination`} />
          <button
            type="button"
            className={`premium-swiper-next-${sliderId} premium-swiper-arrow`}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>

      <ProductInquiryModal product={selectedProduct} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

interface ProductSliderSectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  products: Product[];
  loading?: boolean;
  tone?: "pink" | "blue" | "mint";
}

export function ProductSliderSection({
  id,
  eyebrow,
  title,
  highlight,
  description,
  products,
  loading,
  tone = "blue",
}: ProductSliderSectionProps) {
  const sectionClass =
    tone === "pink" ? "section-bg-pink" : tone === "mint" ? "section-bg-green" : "section-bg-blue";

  return (
    <section
      id={id}
      className={cn(
        "py-14 md:py-20 relative overflow-hidden section-glow premium-section",
        sectionClass,
        "theme-surface"
      )}
    >
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-8 md:mb-10 max-w-2xl mx-auto">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="font-display heading-lg mb-3">
            {title} <span className="text-gradient-brand">{highlight}</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <ProductSlider products={products} loading={loading} />
        </ScrollReveal>
      </div>
    </section>
  );
}
