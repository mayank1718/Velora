import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

/**
 * ThemeToggle — Accessible Sun / Moon button.
 *
 * Variants:
 *   - default  : round icon button (used inside navbars)
 *   - pill     : icon + label pill (optional extended usage)
 *
 * The icon swap is animated with a subtle rotation + scale + opacity
 * transition using pure CSS (Tailwind). No extra libraries needed.
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
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-gray-950
        ${
          variant === "pill"
            ? "gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] rounded-full border border-[#E5E5E5] bg-white text-[#737373] hover:text-[#171717] hover:border-[#171717] dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:hover:border-gray-500 shadow-xs"
            : "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5E5E5] text-[#171717] hover:border-[#171717] hover:bg-[#F5F5F4] dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-800 shadow-xs"
        }
        ${className}
      `}
    >
      {/* Sun icon — visible in dark mode (click to go light) */}
      <span
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-300
          ${isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-75 pointer-events-none"
          }
        `}
        aria-hidden="true"
      >
        <Sun className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.75} />
      </span>

      {/* Moon icon — visible in light mode (click to go dark) */}
      <span
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-300
          ${!isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-75 pointer-events-none"
          }
        `}
        aria-hidden="true"
      >
        <Moon className="w-4 h-4 text-[#525252] dark:text-gray-300" strokeWidth={1.75} />
      </span>

      {/* Pill label (only rendered in pill variant) */}
      {variant === "pill" && (
        <span className="ml-5 select-none">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
