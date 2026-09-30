import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

/**
 * ThemeToggle — Accessible, Luxury Sun / Moon toggle button.
 *
 * Variants:
 *   - default  : round icon button (for navbars and headers)
 *   - pill     : icon + label pill
 */
const ThemeToggle = ({ variant = "default", className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`
        relative inline-flex items-center justify-center
        transition-all duration-300 cursor-pointer
        focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2
        ${
          variant === "pill"
            ? "gap-2 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:shadow-[0_0_14px_rgba(212,175,55,0.18)] shadow-xs"
            : "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:bg-[var(--bg-muted)] hover:shadow-[0_0_14px_rgba(212,175,55,0.18)] shadow-xs"
        }
        ${className}
      `}
    >
      {/* Sun icon — visible in dark mode (click to go light) */}
      <span
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-400 ease-out
          ${isDark
            ? "opacity-100 rotate-0 scale-100 text-[var(--accent-gold)] drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
            : "opacity-0 rotate-90 scale-50 pointer-events-none"
          }
        `}
        aria-hidden="true"
      >
        <Sun className="w-4 h-4" strokeWidth={1.85} />
      </span>

      {/* Moon icon — visible in light mode (click to go dark) */}
      <span
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-400 ease-out
          ${!isDark
            ? "opacity-100 rotate-0 scale-100 text-[var(--text-primary)]"
            : "opacity-0 -rotate-90 scale-50 pointer-events-none"
          }
        `}
        aria-hidden="true"
      >
        <Moon className="w-4 h-4" strokeWidth={1.85} />
      </span>

      {/* Pill label (only rendered in pill variant) */}
      {variant === "pill" && (
        <span className="ml-5 select-none font-medium">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
