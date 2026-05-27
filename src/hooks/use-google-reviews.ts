"use client";

import { useEffect, useState } from "react";
import type { GoogleReviewsData } from "@/types";

export function useGoogleReviews() {
  const [data, setData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/google-reviews`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reviews");
        return res.json() as Promise<GoogleReviewsData>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
