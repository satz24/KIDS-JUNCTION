/** Resize & compress photos before Supabase upload (phone photos are often 5–15 MB). */
export function inferImageMime(file: File): string {
  if (file.type.startsWith("image/")) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

export function inferImageExtension(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return ext === "jpeg" ? "jpg" : ext;
  const mime = inferImageMime(file);
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

export async function compressImageForUpload(
  file: File,
  options?: { maxEdge?: number; quality?: number; maxBytes?: number; timeoutMs?: number }
): Promise<File> {
  const maxEdge = options?.maxEdge ?? 1400;
  const quality = options?.quality ?? 0.82;
  const maxBytes = options?.maxBytes ?? 500_000;
  const timeoutMs = options?.timeoutMs ?? 8000;
  const mime = inferImageMime(file);

  if (mime === "image/gif") return file;
  if (file.size <= maxBytes && /jpe?g|webp/i.test(mime)) return file;

  try {
    return await withTimeout(compressWithCanvas(file, maxEdge, quality, maxBytes, mime), timeoutMs, file);
  } catch {
    return file;
  }
}

async function compressWithCanvas(
  file: File,
  maxEdge: number,
  quality: number,
  maxBytes: number,
  mime: string
): Promise<File> {
  if (!mime.startsWith("image/")) return file;

  const bitmap = await loadImageBitmap(file, mime);
  const { width, height } = fitWithin(bitmap.width, bitmap.height, maxEdge);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, width, height);
  if ("close" in bitmap && typeof bitmap.close === "function") {
    bitmap.close();
  }

  const outputType = mime === "image/png" ? "image/png" : "image/jpeg";
  const blob = await canvasToBlob(canvas, outputType, quality);
  if (!blob || blob.size >= file.size) return file;
  if (blob.size > maxBytes * 4) return file;

  const ext = outputType === "image/png" ? "png" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${baseName}.${ext}`, { type: outputType });
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => {
      window.setTimeout(() => resolve(fallback), ms);
    }),
  ]);
}

function fitWithin(w: number, h: number, maxEdge: number) {
  if (w <= maxEdge && h <= maxEdge) return { width: w, height: h };
  const scale = maxEdge / Math.max(w, h);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

function loadImageBitmap(file: File, mime: string): Promise<ImageBitmap | HTMLImageElement> {
  const blob = file.type ? file : new Blob([file], { type: mime });

  if (typeof createImageBitmap === "function") {
    return createImageBitmap(blob);
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image file."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}
