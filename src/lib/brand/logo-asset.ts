/** Official Kids Junction logo — `public/brand/KJ_final.jpg` */
export const BRAND_LOGO_FILE = "KJ_final.jpg";

/** Storefront photo — `public/brand/store-front.png` */
export const STORE_FRONT_FILE = "store-front.png";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export const BRAND_LOGO_SRC = withBasePath(`/brand/${BRAND_LOGO_FILE}`);
export const STORE_FRONT_SRC = withBasePath(`/brand/${STORE_FRONT_FILE}`);
export const BRAND_LOGO_ALT = "Kids Junction";
export const STORE_FRONT_ALT = "Kids Junction store at Guduvanchery";

/** Resolve local public paths for GitHub Pages basePath; keep remote URLs unchanged. */
export function resolveImageSrc(src: string | null | undefined): string {
  if (!src) return BRAND_LOGO_SRC;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return withBasePath(src);
}

/** Intrinsic size for Next.js Image (approx. aspect ratio of KJ_final.jpg) */
export const BRAND_LOGO_WIDTH = 560;
export const BRAND_LOGO_HEIGHT = 420;
