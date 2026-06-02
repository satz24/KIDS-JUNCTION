"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { storeInfo } from "@/lib/data/store";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { useGoogleReviews } from "@/hooks/use-google-reviews";
import type { GoogleReview } from "@/types";

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function TestimonialsSection() {
  const { data, loading } = useGoogleReviews();
  const reviews = data?.reviews ?? [];
  const profileUrl = data?.profileUrl ?? storeInfo.googleReviews.url;
  const hasLiveReviews = data?.source === "google" && reviews.length > 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayReviews = useMemo<GoogleReview[]>(() => reviews, [reviews]);

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

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, displayReviews.length]);

  return (
    <section id="testimonials" className="py-16 md:py-24 section-bg-blue section-glow relative theme-surface">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full surface-badge border px-4 py-1.5 text-xs mb-4">
            <GoogleLogo className="h-4 w-4" />
            <span className="text-muted-foreground">
              {loading
                ? "Loading Google reviews..."
                : hasLiveReviews
                  ? "Live from Google Reviews"
                  : "Powered by Google Reviews"}
            </span>
          </div>
          <h2 className="font-display heading-lg mb-3">
            Loved by <span className="text-brand-green">Parents</span>
          </h2>
          <p className="text-muted-foreground">
            {data?.totalReviews
              ? `${data.rating.toFixed(1)}★ from ${data.totalReviews} Google reviews`
              : "Real reviews from families who shop with us"}
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-3xl p-10 h-64 animate-pulse" />
          </div>
        ) : displayReviews.length > 0 ? (
          <div className="relative max-w-4xl mx-auto">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex">
                {displayReviews.map((t) => (
                  <div key={t.id} className="flex-[0_0_100%] min-w-0 px-4">
                    <div className="glass-card rounded-[2rem] p-8 md:p-10 text-center shadow-[var(--shadow-float)]">
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
                          unoptimized
                        />
                        <div className="text-left">
                          <p className="font-semibold text-sm">{t.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.date ? `${t.date} · Google Review` : "Google Review"}
                          </p>
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
                {displayReviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === selectedIndex ? "w-6 bg-brand-green" : "w-2 bg-muted-foreground/30"
                    }`}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto text-center glass rounded-3xl p-10">
            <GoogleLogo className="h-10 w-10 mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">
              Read what customers are saying about Kids Junction on Google.
            </p>
            <Button asChild className="rounded-full bg-brand-green hover:bg-brand-green-dark">
              <Link href={profileUrl} target="_blank" rel="noopener noreferrer">
                View Google Reviews
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}

        <ScrollReveal className="mt-10 text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link href={profileUrl} target="_blank" rel="noopener noreferrer">
              <GoogleLogo className="h-4 w-4 mr-2" />
              See all reviews on Google
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
