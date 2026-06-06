"use client";

import Link from "next/link";
import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Mousewheel, Navigation, Pagination } from "swiper/modules";
import { CategoryCircleImage } from "@/components/products/category-circle-image";
import { categoryImageUsesContain } from "@/lib/brand/category-image";
import type { DbCategory } from "@/types/database";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CategorySliderProps {
  categories: DbCategory[];
  variant?: "strip" | "showcase";
  className?: string;
  showControls?: boolean;
}

export function CategorySlider({
  categories,
  variant = "strip",
  className,
  showControls = true,
}: CategorySliderProps) {
  const sliderId = useId().replace(/:/g, "");
  const canLoop = categories.length >= 4;

  if (categories.length === 0) return null;

  return (
    <div className={cn("category-slider-wrap", className)}>
      <Swiper
        modules={[Autoplay, FreeMode, Mousewheel, Navigation, Pagination]}
        loop={canLoop}
        freeMode={{ enabled: true, momentum: true, momentumRatio: 0.8 }}
        mousewheel={{ forceToAxis: true, sensitivity: 0.8 }}
        autoplay={{
          delay: 3200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={
          showControls
            ? {
                prevEl: `.cat-swiper-prev-${sliderId}`,
                nextEl: `.cat-swiper-next-${sliderId}`,
              }
            : undefined
        }
        pagination={
          showControls
            ? {
                clickable: true,
                el: `.cat-swiper-pagination-${sliderId}`,
                bulletClass: "premium-swiper-bullet",
                bulletActiveClass: "premium-swiper-bullet--active",
              }
            : undefined
        }
        slidesPerView="auto"
        spaceBetween={variant === "showcase" ? 20 : 14}
        grabCursor
        speed={650}
        className={cn("category-swiper !overflow-visible", showControls && "!pb-10")}
        breakpoints={{
          640: { spaceBetween: variant === "showcase" ? 24 : 18 },
          1024: { spaceBetween: variant === "showcase" ? 28 : 22 },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide
            key={category.id}
            className={cn(
              "!w-auto",
              variant === "showcase" ? "premium-slide-showcase" : "premium-slide-strip"
            )}
          >
            <Link
              href={`/category/${category.id}`}
              className="premium-category-card group block"
              data-cursor-card
            >
              <div
                className={cn(
                  "premium-category-card__shell",
                  variant === "showcase" && "premium-category-card__shell--lg"
                )}
              >
                <div className="premium-category-card__glow" aria-hidden />
                <div className="premium-category-card__glass premium-glass-v2">
                  <CategoryCircleImage
                    src={category.image_url}
                    alt={category.name}
                    size={variant === "showcase" ? "lg" : "md"}
                    className="premium-category-card__image ring-0 shadow-none group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                    contain={categoryImageUsesContain(category.image_url)}
                  />
                </div>
              </div>
              <p
                className={cn(
                  "premium-category-card__label",
                  variant === "showcase" && "premium-category-card__label--lg"
                )}
              >
                {category.name}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {showControls && (
        <div className="premium-swiper-controls premium-swiper-controls--compact">
          <button
            type="button"
            className={`cat-swiper-prev-${sliderId} premium-swiper-arrow`}
            aria-label="Previous categories"
          >
            ‹
          </button>
          <div className={`cat-swiper-pagination-${sliderId} premium-swiper-pagination`} />
          <button
            type="button"
            className={`cat-swiper-next-${sliderId} premium-swiper-arrow`}
            aria-label="Next categories"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
