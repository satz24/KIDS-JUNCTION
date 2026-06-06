import { cn } from "@/lib/utils";

export function DecorativeBg({
  variant = "default",
  className,
}: {
  variant?: "hero" | "pink" | "blue" | "mint" | "default";
  className?: string;
}) {
  return (
    <div className={cn("decorative-bg", `decorative-bg--${variant}`, className)} aria-hidden>
      <span className="decorative-bg__blob decorative-bg__blob--pink animate-float-slow" />
      <span className="decorative-bg__blob decorative-bg__blob--blue animate-float" />
      <span className="decorative-bg__blob decorative-bg__blob--mint animate-float-slow" />
      <span className="decorative-bg__spark decorative-bg__spark--1 animate-sparkle" />
      <span className="decorative-bg__spark decorative-bg__spark--2 animate-sparkle" />
      <span className="decorative-bg__cloud decorative-bg__cloud--1 animate-cloud" />
      <span className="decorative-bg__cloud decorative-bg__cloud--2 animate-cloud" />
    </div>
  );
}
