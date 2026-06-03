"use client";

import Link from "next/link";
import { Upload } from "lucide-react";
import { CategoryCircleImage } from "@/components/products/category-circle-image";
import { resolveImageSrc } from "@/lib/brand/logo-asset";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AdminImageUploadProps {
  label?: string;
  value: string;
  uploading: boolean;
  onUpload: (file: File) => Promise<void>;
  previewRounded?: "lg" | "full";
  className?: string;
}

export function AdminImageUpload({
  label = "Photo",
  value,
  uploading,
  onUpload,
  previewRounded = "lg",
  className,
}: AdminImageUploadProps) {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    await onUpload(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="flex items-center gap-3 flex-wrap">
        <label className="hero-cta hero-cta-explore cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 text-sm">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={handleChange}
          />
        </label>
        {value ? (
          previewRounded === "full" ? (
            <CategoryCircleImage
              src={value}
              alt="Preview"
              size="sm"
              contain={!value.startsWith("http")}
            />
          ) : (
            <Image
              src={resolveImageSrc(value)}
              alt="Preview"
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl object-cover bg-white ring-2 ring-[var(--glass-border)]"
              unoptimized
            />
          )
        ) : (
          <span className="text-xs text-muted-foreground">No photo yet — uses store logo if empty</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Pick a photo from your phone or computer (JPG, PNG, WebP)
      </p>
    </div>
  );
}
