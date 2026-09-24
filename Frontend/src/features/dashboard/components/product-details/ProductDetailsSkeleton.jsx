import React from "react";

const ProductDetailsSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-36 bg-stone-200 rounded mb-8"></div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery Skeleton */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-200 rounded-lg"
              ></div>
            ))}
          </div>
          <div className="flex-1 aspect-square sm:aspect-[4/4.5] max-h-[560px] bg-stone-200 rounded-2xl"></div>
        </div>

        {/* Right Column: Info Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="h-3.5 w-24 bg-stone-200 rounded"></div>
            <div className="h-8 w-3/4 bg-stone-200 rounded"></div>
          </div>

          <div className="h-20 w-full bg-stone-100 rounded-xl border border-stone-200/60 p-4"></div>

          <div className="space-y-2">
            <div className="h-3 w-28 bg-stone-200 rounded"></div>
            <div className="h-4 w-full bg-stone-200 rounded"></div>
            <div className="h-4 w-5/6 bg-stone-200 rounded"></div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="h-3.5 w-32 bg-stone-200 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-24 bg-stone-100 rounded-xl border border-stone-200"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
