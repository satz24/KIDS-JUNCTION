/** True when the URL is the default logo placeholder, not a real category photo. */
export function isDefaultBrandImage(src: string | null | undefined): boolean {
  if (!src) return true;
  return src.includes("KJ_final.jpg") || src.includes("logo.svg");
}

/** Category photos from Supabase storage should fill the circle; logos stay contained. */
export function categoryImageUsesContain(src: string | null | undefined): boolean {
  return isDefaultBrandImage(src);
}
