/** Official Kids Junction logo — `public/brand/KJ_final.jpg` */
export const BRAND_LOGO_FILE = "KJ_final.jpg";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const BRAND_LOGO_SRC = `${basePath}/brand/${BRAND_LOGO_FILE}`;
export const BRAND_LOGO_ALT = "Kids Junction";

/** Intrinsic size for Next.js Image (approx. aspect ratio of KJ_final.jpg) */
export const BRAND_LOGO_WIDTH = 560;
export const BRAND_LOGO_HEIGHT = 420;
