/** Normalize App Router pathname (handles trailing slashes from GitHub Pages export). */
export function normalizePath(pathname: string | null | undefined): string {
  if (!pathname) return "";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed || "/";
}

export function isAdminPath(pathname: string | null | undefined): boolean {
  const path = normalizePath(pathname);
  return path === "/admin" || path.startsWith("/admin/");
}

export function isAdminLoginPath(pathname: string | null | undefined): boolean {
  return normalizePath(pathname) === "/admin/login";
}
