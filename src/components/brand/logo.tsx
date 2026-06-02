import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BRAND_LOGO_ALT,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_SRC,
  BRAND_LOGO_WIDTH,
} from "@/lib/brand/logo-asset";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  className?: string;
}

const logoSizes = {
  sm: "h-9 w-auto max-w-[130px]",
  md: "h-12 w-auto max-w-[170px]",
  lg: "h-16 w-auto max-w-[220px]",
  xl: "h-24 sm:h-32 w-auto max-w-[360px]",
};

function BrandLogoImage({
  size = "md",
  className,
  priority = false,
}: {
  size?: LogoProps["size"];
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt={BRAND_LOGO_ALT}
      width={BRAND_LOGO_WIDTH}
      height={BRAND_LOGO_HEIGHT}
      priority={priority}
      className={cn("object-contain shrink-0", logoSizes[size ?? "md"], className)}
    />
  );
}

/** @deprecated Text name is included in the logo image. Kept for compatibility. */
export function BrandName({ className }: { className?: string }) {
  return null;
}

export function Logo({ size = "md", className }: LogoProps) {
  return <BrandLogoImage size={size} className={className} />;
}

export function LogoMark({ className }: { className?: string }) {
  return <BrandLogoImage size="sm" className={className} />;
}

export function BrandTitle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const titleSize = size === "sm" ? "md" : size === "md" ? "lg" : "xl";

  return (
    <div className={cn("flex justify-center", className)}>
      <BrandLogoImage size={titleSize} priority />
    </div>
  );
}
