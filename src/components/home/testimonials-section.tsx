"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { testimonials } from "@/lib/data/products";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-b from-brand-pink/5 to-background">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Loved by <span className="text-brand-green">Parents</span>
          </h2>
          <p className="text-muted-foreground">Real reviews from real families</p>
        </ScrollReveal>

        <div className="relative max-w-4xl mx-auto">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {testimonials.map((t) => (
                <div key={t.id} className="flex-[0_0_100%] min-w-0 px-4">
                  <div className="glass rounded-3xl p-8 md:p-10 text-center shadow-lg">
                    <Quote className="h-8 w-8 text-brand-green/40 mx-auto mb-4" />
                    <p className="text-lg md:text-xl leading-relaxed mb-6 max-w-2xl mx-auto">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow text-yellow" />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex ? "w-6 bg-brand-green" : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
