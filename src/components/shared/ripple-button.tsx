"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const RippleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        className={cn("ripple-btn relative overflow-hidden", className)}
        onClick={handleClick}
        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="ripple-btn__wave"
            style={{ left: ripple.x, top: ripple.y }}
          />
        ))}
        <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
      </Button>
    );
  }
);
RippleButton.displayName = "RippleButton";
