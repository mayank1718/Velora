import React from "react";

const ProductSkeleton = ({ count = 6 }) => {
  const skeletons = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="bg-white border border-[#E5E5E5] flex flex-col animate-pulse"
        >
          {/* Skeleton Image (4:3 ratio) */}
          <div className="aspect-[4/3] w-full bg-[#FAFAF9] border-b border-[#E5E5E5] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5E5E5]/30 to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Skeleton Content */}
          <div className="p-5 flex flex-col flex-1">
            {/* Category badge */}
            <div className="w-24 h-4 bg-[#E5E5E5]/70 mb-3" />

            {/* Title */}
            <div className="w-3/4 h-5 bg-[#E5E5E5] mb-2" />

            {/* Description lines */}
            <div className="w-full h-3 bg-[#E5E5E5]/60 mb-1.5" />
            <div className="w-4/5 h-3 bg-[#E5E5E5]/60 mb-4" />

            {/* Variant status indicator */}
            <div className="w-20 h-3 bg-[#E5E5E5]/70 mb-5" />

            {/* Bottom buttons */}
            <div className="border-t border-[#E5E5E5] pt-4 mt-auto flex items-center gap-2">
              <div className="flex-1 h-9 bg-[#E5E5E5]" />
              <div className="w-20 h-9 bg-[#FAFAF9] border border-[#E5E5E5]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
