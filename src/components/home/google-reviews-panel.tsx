"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { storeInfo } from "@/lib/data/store";
import { useGoogleReviews } from "@/hooks/use-google-reviews";
import { Button } from "@/components/ui/button";

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

interface GoogleReviewsPanelProps {
  variant?: "compact" | "full";
}

export function GoogleReviewsPanel({ variant = "full" }: GoogleReviewsPanelProps) {
  const { data, loading } = useGoogleReviews();
  const profileUrl = data?.profileUrl ?? storeInfo.googleReviews.url;
  const rating = data?.rating ?? 0;
  const totalReviews = data?.totalReviews ?? 0;
  const reviews = data?.reviews ?? [];
  const isLive = data?.source === "google" && reviews.length > 0;

  if (variant === "compact") {
    return (
      <Link
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-2xl glass-card px-4 py-2.5 text-sm transition-all hover:border-brand-green/40 hover:shadow-md"
      >
        <GoogleLogo className="h-4 w-4 shrink-0" />
        <span className="font-semibold">
          {loading ? "..." : rating > 0 ? `${rating.toFixed(1)}★` : "Google"}
        </span>
        <span className="text-muted-foreground">
          {loading
            ? "Loading reviews"
            : totalReviews > 0
              ? `${totalReviews} reviews`
              : "View reviews"}
        </span>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand-green" />
      </Link>
    );
  }

  return (
    <div className="rounded-3xl glass-panel p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl glass shadow-sm">
            <GoogleLogo className="h-7 w-7" />
          </div>
          <div>
            <p className="font-display font-semibold text-lg">Google Reviews</p>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Fetching latest reviews..."
                : isLive
                  ? "Live reviews from Google"
                  : "Read what customers say on Google"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!loading && rating > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(rating)
                        ? "fill-yellow text-yellow"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold mt-1">
                {rating.toFixed(1)} · {totalReviews} reviews
              </p>
            </div>
          )}
          <Button asChild variant="outline" className="rounded-full">
            <Link href={profileUrl} target="_blank" rel="noopener noreferrer">
              View on Google
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.slice(0, 4).map((review) => (
            <Link
              key={review.id}
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl glass-card p-4 transition-all hover:border-brand-green/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover shrink-0"
                  unoptimized
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{review.name}</p>
                    {review.date && (
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 my-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow text-yellow" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{review.comment}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Connect your Google Places API key to show live reviews here, or read them directly on Google.
          </p>
          <Button asChild className="rounded-full bg-brand-green hover:bg-brand-green-dark">
            <Link href={profileUrl} target="_blank" rel="noopener noreferrer">
              Read Google Reviews
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
