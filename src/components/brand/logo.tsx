import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: "h-8 w-8 text-sm rounded-lg", name: "text-lg" },
  md: { box: "h-10 w-10 text-base rounded-xl", name: "text-xl" },
  lg: { box: "h-14 w-14 text-xl rounded-2xl", name: "text-2xl" },
};

export function Logo({ size = "md", showName = true, className }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center font-display font-extrabold shadow-lg shadow-brand-green/20",
          s.box,
          "bg-white dark:bg-card border-2 border-brand-green/20"
        )}
      >
        <span className="text-brand-green">K</span>
        <span className="text-brand-pink">J</span>
      </div>
      {showName && (
        <div className={cn("font-display font-bold leading-tight hidden sm:block", s.name)}>
          <span className="text-brand-green">KIDS</span>{" "}
          <span className="text-brand-pink">JUNCTION</span>
        </div>
      )}
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl font-display text-base font-extrabold bg-white dark:bg-card border-2 border-brand-green/20 shadow-md",
        className
      )}
    >
      <span className="text-brand-green">K</span>
      <span className="text-brand-pink">J</span>
    </div>
  );
}
