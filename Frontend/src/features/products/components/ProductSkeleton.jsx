import React from "react";

const ProductSkeleton = ({ count = 6 }) => {
  const skeletons = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="bg-white border border-[var(--border-subtle)] flex flex-col animate-pulse"
        >
          {/* Skeleton Image (4:3 ratio) */}
          <div className="aspect-[4/3] w-full bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border-subtle)]/30 to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Skeleton Content */}
          <div className="p-5 flex flex-col flex-1">
            {/* Category badge */}
            <div className="w-24 h-4 bg-[var(--border-subtle)]/70 mb-3" />

            {/* Title */}
            <div className="w-3/4 h-5 bg-[var(--border-subtle)] mb-2" />

            {/* Description lines */}
            <div className="w-full h-3 bg-[var(--border-subtle)]/60 mb-1.5" />
            <div className="w-4/5 h-3 bg-[var(--border-subtle)]/60 mb-4" />

            {/* Variant status indicator */}
            <div className="w-20 h-3 bg-[var(--border-subtle)]/70 mb-5" />

            {/* Bottom buttons */}
            <div className="border-t border-[var(--border-subtle)] pt-4 mt-auto flex items-center gap-2">
              <div className="flex-1 h-9 bg-[var(--border-subtle)]" />
              <div className="w-20 h-9 bg-[var(--bg-canvas)] border border-[var(--border-subtle)]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
