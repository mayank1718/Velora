import React, { useState } from "react";
import { Star } from "lucide-react";

/**
 * Reusable Star Rating UI Component
 *
 * Supports:
 * - Read-only mode with half/fractional stars visual
 * - Interactive mode with hover preview and keyboard accessibility
 * - Light and dark theme integration using CSS variables and Tailwind
 */
const RatingStars = ({
  value = 0,
  max = 5,
  readOnly = true,
  onChange,
  size = "md",
  className = "",
  showValue = false,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  // Size map for star icon dimensions
  const sizeMap = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const starSizeClass = sizeMap[size] || size;
  const numericValue = Number(value) || 0;
  const activeValue = !readOnly && hoverValue > 0 ? hoverValue : numericValue;

  const handleStarClick = (starIndex) => {
    if (readOnly) return;
    onChange?.(starIndex);
  };

  const handleKeyDown = (e, starIndex) => {
    if (readOnly) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange?.(starIndex);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1 select-none ${className}`}
      onMouseLeave={() => !readOnly && setHoverValue(0)}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`Rating: ${numericValue} out of ${max} stars`}
    >
      <div className="inline-flex items-center gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          const isInteractive = !readOnly;

          // In interactive mode, full star fill based on hover or value
          if (isInteractive) {
            const isFilled = starNumber <= activeValue;
            return (
              <button
                key={starNumber}
                type="button"
                role="radio"
                aria-checked={numericValue === starNumber}
                aria-label={`${starNumber} star${starNumber > 1 ? "s" : ""}`}
                onClick={() => handleStarClick(starNumber)}
                onMouseEnter={() => setHoverValue(starNumber)}
                onKeyDown={(e) => handleKeyDown(e, starNumber)}
                className="p-0.5 rounded-xs transition-transform duration-150 hover:scale-115 active:scale-95 cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[var(--accent-gold)]"
              >
                <Star
                  className={`${starSizeClass} transition-colors ${
                    isFilled
                      ? "fill-[var(--accent-gold)] text-[var(--accent-gold)]"
                      : "text-[var(--border-strong)] fill-transparent"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            );
          }

          // In read-only mode: support full, fractional/half, or empty stars
          const fillDifference = numericValue - index;
          const isFullyFilled = fillDifference >= 1;
          const isPartiallyFilled = fillDifference > 0 && fillDifference < 1;
          const partialPercent = isPartiallyFilled
            ? Math.round(fillDifference * 100)
            : 0;

          return (
            <div
              key={starNumber}
              className="relative inline-flex items-center justify-center"
              title={`${numericValue.toFixed(1)} / ${max}`}
            >
              {/* Background empty star */}
              <Star
                className={`${starSizeClass} text-[var(--border-strong)] fill-transparent`}
                strokeWidth={1.5}
              />

              {/* Foreground filled or fractional star */}
              {isFullyFilled && (
                <div className="absolute inset-0 overflow-hidden">
                  <Star
                    className={`${starSizeClass} fill-[var(--accent-gold)] text-[var(--accent-gold)]`}
                    strokeWidth={1.5}
                  />
                </div>
              )}

              {isPartiallyFilled && (
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${partialPercent}%` }}
                >
                  <Star
                    className={`${starSizeClass} fill-[var(--accent-gold)] text-[var(--accent-gold)] max-w-none`}
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showValue && (
        <span className="text-xs font-semibold tracking-tight text-[var(--text-primary)] ml-1">
          {numericValue.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
