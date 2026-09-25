import React from "react";

const CartSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      {/* Items List Skeleton */}
      <div className="lg:col-span-8 space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white border border-[#E5E5E5] rounded-2xl animate-pulse"
          >
            <div className="flex items-start gap-4 w-full sm:w-auto flex-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-stone-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-3 bg-stone-200 rounded w-20" />
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
                <div className="h-3 bg-stone-200 rounded w-24" />
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
              <div className="w-24 h-9 bg-stone-200 rounded-xl" />
              <div className="w-16 h-5 bg-stone-200 rounded" />
              <div className="w-8 h-8 bg-stone-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Skeleton */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 animate-pulse">
          <div className="h-5 bg-stone-200 rounded w-32 pb-3" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-stone-200 rounded w-16" />
              <div className="h-4 bg-stone-200 rounded w-20" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-stone-200 rounded w-24" />
              <div className="h-4 bg-stone-200 rounded w-12" />
            </div>
            <div className="pt-3 border-t border-stone-100 flex justify-between">
              <div className="h-5 bg-stone-200 rounded w-16" />
              <div className="h-5 bg-stone-200 rounded w-24" />
            </div>
          </div>
          <div className="h-12 bg-stone-200 rounded-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
