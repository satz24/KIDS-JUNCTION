import Image from "next/image";
import { resolveImageSrc } from "@/lib/brand/logo-asset";
import { cn } from "@/lib/utils";

type CategoryCircleSize = "sm" | "md" | "lg";

const sizeStyles: Record<
  CategoryCircleSize,
  { wrapper: string; imagePx: number; ring: string }
> = {
  sm: {
    wrapper: "h-10 w-10",
    imagePx: 40,
    ring: "ring-1",
  },
  md: {
    wrapper: "h-16 w-16 sm:h-[4.75rem] sm:w-[4.75rem] md:h-20 md:w-20",
    imagePx: 80,
    ring: "ring-2",
  },
  lg: {
    wrapper: "h-[5.5rem] w-[5.5rem] sm:h-[6.5rem] sm:w-[6.5rem] md:h-[7.5rem] md:w-[7.5rem]",
    imagePx: 120,
    ring: "ring-2",
  },
};

interface CategoryCircleImageProps {
  src: string | null | undefined;
  alt: string;
  size?: CategoryCircleSize;
  className?: string;
  imageClassName?: string;
  /** Slight inset for logo-style images */
  contain?: boolean;
}

export function CategoryCircleImage({
  src,
  alt,
  size = "md",
  className,
  imageClassName,
  contain = false,
}: CategoryCircleImageProps) {
  const styles = sizeStyles[size];
  const resolved = resolveImageSrc(src);

  return (
    <div
      className={cn(
        "relative shrink-0 aspect-square rounded-full overflow-hidden bg-white",
        styles.wrapper,
        styles.ring,
        "ring-[var(--glass-border)]",
        className
      )}
    >
      <Image
        src={resolved}
        alt={alt}
        fill
        sizes={`${styles.imagePx}px`}
        className={cn(
          contain ? "object-contain p-1.5" : "object-cover",
          imageClassName
        )}
        unoptimized
      />
    </div>
  );
}
