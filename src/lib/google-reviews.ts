import { storeInfo } from "@/lib/data/store";
import type { GoogleReview, GoogleReviewsData } from "@/types";

const PLACES_BASE = "https://places.googleapis.com/v1";

interface PlacesReview {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
    uri?: string;
  };
}

interface PlacesSearchResponse {
  places?: Array<{
    id?: string;
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    reviews?: PlacesReview[];
  }>;
}

interface PlaceDetailsResponse {
  id?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
}

function mapReview(review: PlacesReview, index: number): GoogleReview {
  const name = review.authorAttribution?.displayName ?? "Google User";
  return {
    id: `google-${index}-${name.replace(/\s+/g, "-").toLowerCase()}`,
    name,
    avatar:
      review.authorAttribution?.photoUri ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=fff&size=96`,
    rating: review.rating ?? 5,
    comment: review.text?.text ?? "",
    date: review.relativePublishTimeDescription ?? "",
    sourceUrl: review.authorAttribution?.uri ?? storeInfo.googleReviews.url,
  };
}

function emptyFallback(): GoogleReviewsData {
  return {
    rating: 0,
    totalReviews: 0,
    reviews: [],
    profileUrl: storeInfo.googleReviews.url,
    mapsUrl: storeInfo.googleReviews.mapsUrl,
    source: "fallback",
  };
}

async function placesFetch<T>(
  path: string,
  init: RequestInit,
  fieldMask: string
): Promise<T | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`${PLACES_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
        ...init.headers,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function resolvePlaceId(): Promise<string | null> {
  const configured = process.env.GOOGLE_PLACE_ID?.trim();
  if (configured) {
    return configured.startsWith("places/") ? configured : `places/${configured}`;
  }

  const search = await placesFetch<PlacesSearchResponse>(
    "/places:searchText",
    {
      method: "POST",
      body: JSON.stringify({ textQuery: storeInfo.googleReviews.searchQuery }),
    },
    "places.id,places.displayName"
  );

  return search?.places?.[0]?.id ?? null;
}

async function fetchPlaceDetails(placeId: string): Promise<PlaceDetailsResponse | null> {
  return placesFetch<PlaceDetailsResponse>(
    `/${placeId}`,
    { method: "GET" },
    "id,rating,userRatingCount,reviews,googleMapsUri"
  );
}

export async function fetchGoogleReviews(): Promise<GoogleReviewsData> {
  const placeId = await resolvePlaceId();
  if (!placeId) return emptyFallback();

  const details = await fetchPlaceDetails(placeId);
  if (!details) return emptyFallback();

  const reviews = (details.reviews ?? [])
    .filter((review) => review.text?.text)
    .slice(0, 10)
    .map(mapReview);

  return {
    rating: details.rating ?? 0,
    totalReviews: details.userRatingCount ?? reviews.length,
    reviews,
    profileUrl: storeInfo.googleReviews.url,
    mapsUrl: details.googleMapsUri ?? storeInfo.googleReviews.mapsUrl,
    source: reviews.length > 0 || (details.rating ?? 0) > 0 ? "google" : "fallback",
  };
}
