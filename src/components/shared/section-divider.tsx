import { cn } from "@/lib/utils";

type DividerTone = "pink" | "blue" | "mint" | "blend";

const toneClass: Record<DividerTone, string> = {
  pink: "section-curve--pink",
  blue: "section-curve--blue",
  mint: "section-curve--mint",
  blend: "section-curve--blend",
};

export function SectionDivider({
  tone = "blend",
  flip = false,
  className,
}: {
  tone?: DividerTone;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("section-curve", toneClass[tone], flip && "section-curve--flip", className)}
      aria-hidden
    />
  );
}
