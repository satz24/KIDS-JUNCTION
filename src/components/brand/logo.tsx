import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

const sizeMap = {
  sm: {
    box: "h-10 w-10 text-base rounded-full",
    name: "text-[1.65rem] sm:text-[1.9rem]",
    gap: "gap-2.5",
  },
  md: {
    box: "h-[3.25rem] w-[3.25rem] text-xl rounded-full",
    name: "text-[2rem] sm:text-[2.35rem] lg:text-[2.6rem]",
    gap: "gap-3",
  },
  lg: {
    box: "h-16 w-16 text-2xl rounded-full",
    name: "text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem]",
    gap: "gap-3.5",
  },
};

export function BrandName({ className }: { className?: string }) {
  return (
    <div className={cn("font-brand whitespace-nowrap", className)}>
      <span className="brand-name-green">KidS</span>{" "}
      <span className="brand-name-pink">Junction</span>
    </div>
  );
}

export function Logo({ size = "md", showName = true, className }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <LogoMark className={s.box} />
      {showName && <BrandName className={s.name} />}
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-brand bg-white dark:bg-card border-2 border-brand-green/25 brand-mark-glow shrink-0",
        className
      )}
    >
      <span className="brand-name-green text-[1em] leading-none">K</span>
      <span className="brand-name-pink text-[1em] leading-none">J</span>
    </div>
  );
}

export function BrandTitle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "text-[2rem] sm:text-[2.5rem]",
    md: "text-[2.5rem] sm:text-[3.25rem]",
    lg: "text-[3rem] sm:text-[4rem] md:text-[4.75rem]",
    xl: "text-[3.5rem] sm:text-[5rem] lg:text-[6rem]",
  };

  return (
    <h1 className={cn("font-brand leading-none", sizes[size], className)}>
      <span className="brand-name-green">KidS</span>{" "}
      <span className="brand-name-pink">Junction</span>
    </h1>
  );
}
