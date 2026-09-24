import React from "react";

const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden animate-pulse shadow-xs flex flex-col h-full"
        >
          {/* Image Skeleton */}
          <div className="w-full aspect-square bg-stone-200/70"></div>

          {/* Content Skeleton */}
          <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
            <div className="space-y-2">
              {/* Category skeleton */}
              <div className="h-3 w-16 bg-stone-200 rounded-sm"></div>

              {/* Title skeleton */}
              <div className="h-4 w-5/6 bg-stone-200 rounded-sm"></div>
              <div className="h-4 w-3/5 bg-stone-200 rounded-sm"></div>
            </div>

            {/* Price & Action skeleton */}
            <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
              <div className="h-5 w-20 bg-stone-200 rounded-sm"></div>
              <div className="h-3 w-14 bg-stone-200 rounded-sm"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
