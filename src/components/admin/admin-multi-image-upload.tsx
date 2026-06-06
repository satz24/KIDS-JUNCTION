"use client";

import { useRef } from "react";
import { Loader2, Upload, X, Star } from "lucide-react";
import { resolveImageSrc } from "@/lib/brand/logo-asset";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function isPendingPreview(url: string): boolean {
  return url.startsWith("blob:") || url.startsWith("data:");
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const resolved = resolveImageSrc(src);
  if (isPendingPreview(resolved)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={resolved} alt={alt} className="h-[5.5rem] w-[5.5rem] object-cover" />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolved} alt={alt} className="h-[5.5rem] w-[5.5rem] object-cover" />
  );
}

interface AdminMultiImageUploadProps {
  label?: string;
  values: string[];
  uploading: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: (index: number) => void;
  onSetPrimary?: (index: number) => void;
  className?: string;
}

export function AdminMultiImageUpload({
  label = "Product Photos",
  values,
  uploading,
  onUpload,
  onRemove,
  onSetPrimary,
  className,
}: AdminMultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;

    const picked = Array.from(fileList);
    e.target.value = "";

    picked.forEach((file) => {
      void onUpload(file);
    });
  };

  return (
    <div className={cn("space-y-3 sm:col-span-2", className)}>
      <Label>{label}</Label>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {values.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group rounded-xl overflow-hidden ring-2 ring-[var(--glass-border)] bg-white"
            >
              <PreviewImage src={url} alt={`Product photo ${index + 1}`} />
              {isPendingPreview(url) && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                </span>
              )}
              {index === 0 && !isPendingPreview(url) && (
                <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 rounded-full bg-brand-pink px-1.5 py-0.5 text-[9px] font-bold text-white">
                  <Star className="h-2.5 w-2.5 fill-white" />
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex gap-0.5 p-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                {index !== 0 && onSetPrimary && !isPendingPreview(url) && (
                  <button
                    type="button"
                    onClick={() => onSetPrimary(index)}
                    className="flex-1 rounded-md bg-white/90 text-[10px] font-semibold py-1 text-foreground"
                  >
                    Set cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  disabled={isPendingPreview(url) && uploading}
                  className="rounded-md bg-destructive/90 p-1 text-white disabled:opacity-50"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="hero-cta hero-cta-explore inline-flex items-center gap-2 px-4 py-2.5 text-sm disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : values.length ? "Add More Photos" : "Upload Photos"}
        </button>
        {values.length === 0 && (
          <span className="text-xs text-muted-foreground">
            Upload one or more photos — first photo is the cover image
          </span>
        )}
      </div>

      {/* Not nested in <form> — avoids file picker / submit conflicts in some browsers */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        disabled={uploading}
        onChange={handleChange}
      />

      <p className="text-xs text-muted-foreground">
        Large phone photos are auto-compressed for faster upload · JPG, PNG, WebP
      </p>
    </div>
  );
}
