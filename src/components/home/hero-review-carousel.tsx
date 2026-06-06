"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { heroCustomerReviews } from "@/lib/data/customer-reviews";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5000;

export function HeroReviewCarousel({
  className,
  embedded = false,
}: {
  className?: string;
  embedded?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const review = heroCustomerReviews[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % heroCustomerReviews.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className={cn(
        "hero-review-carousel",
        !embedded && "glass",
        embedded && "hero-review-carousel--embedded",
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <Quote className="hero-review-carousel__quote" aria-hidden />

      <div className="hero-review-carousel__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2"
          >
            <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow text-yellow shrink-0" />
              ))}
            </div>
            <p className="hero-review-carousel__text line-clamp-4">{review.text}</p>
            <p className="hero-review-carousel__name">— {review.name}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hero-review-carousel__dots" aria-hidden>
        {heroCustomerReviews.map((item, i) => (
          <span
            key={item.id}
            className={cn("hero-review-carousel__dot", i === index && "hero-review-carousel__dot--active")}
          />
        ))}
      </div>
    </div>
  );
}
