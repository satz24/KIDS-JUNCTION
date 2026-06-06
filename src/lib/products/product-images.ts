import { resolveImageSrc } from "@/lib/brand/logo-asset";
import type { DbProduct } from "@/types/database";

const PLACEHOLDER_MARKERS = ["KJ_final.jpg", "/brand/KJ_final.jpg"];

/** Default logo paths — not real product photos */
export function isPlaceholderProductImage(url: string | null | undefined): boolean {
  if (!url?.trim()) return true;
  const normalized = url.trim().toLowerCase();
  return PLACEHOLDER_MARKERS.some((marker) => normalized.includes(marker.toLowerCase()));
}

export function sanitizeProductImageUrls(urls: string[]): string[] {
  return urls.filter((url) => !isPlaceholderProductImage(url));
}

export function normalizeDbImageUrls(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((url): url is string => typeof url === "string" && url.trim() !== "");
  }
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((url): url is string => typeof url === "string" && url.trim() !== "");
      }
    } catch {
      return [raw];
    }
  }
  return [];
}

/** Real product photos only (no placeholder logo) */
export function getProductPhotoUrls(row: Pick<DbProduct, "image_url" | "image_urls">): string[] {
  const fromJson = sanitizeProductImageUrls(normalizeDbImageUrls(row.image_urls));
  if (fromJson.length > 0) return fromJson;

  if (row.image_url?.trim() && !isPlaceholderProductImage(row.image_url)) {
    return [row.image_url.trim()];
  }

  return [];
}

/** Primary thumbnail for lists and cards */
export function getDbProductCoverUrl(row: Pick<DbProduct, "image_url" | "image_urls">): string {
  const photos = getProductPhotoUrls(row);
  if (photos.length > 0) return resolveImageSrc(photos[0]);
  return resolveImageSrc(null);
}

/** All resolved image URLs for storefront display */
export function getDbProductImages(row: Pick<DbProduct, "image_url" | "image_urls">): string[] {
  const photos = getProductPhotoUrls(row);
  if (photos.length > 0) return photos.map(resolveImageSrc);
  return [resolveImageSrc(null)];
}

/** Resolved gallery URLs for storefront (cover + all uploads, no placeholders) */
export function getProductGalleryImages(images: string[]): string[] {
  const resolved = images
    .filter((url): url is string => typeof url === "string" && url.trim() !== "")
    .map(resolveImageSrc);
  return resolved.length > 0 ? resolved : [resolveImageSrc(null)];
}

/** Pick cover + gallery for saving to Supabase */
export function buildProductImageFields(urls: string[]): {
  image_url: string | null;
  image_urls: string[];
} {
  const cleaned = sanitizeProductImageUrls(urls);
  return {
    image_url: cleaned[0] ?? null,
    image_urls: cleaned,
  };
}
