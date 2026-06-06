"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/lib/store/theme-store";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={cn("premium-icon-btn theme-toggle", className)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="inline-flex"
      >
        {isDark ? (
          <Sun className="h-[1.05rem] w-[1.05rem] text-yellow" />
        ) : (
          <Moon className="h-[1.05rem] w-[1.05rem] text-brand-blue" />
        )}
      </motion.span>
    </motion.button>
  );
}
