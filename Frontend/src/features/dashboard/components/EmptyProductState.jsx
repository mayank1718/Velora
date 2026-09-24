import React from "react";
import { PackageSearch, SearchX, RotateCcw } from "lucide-react";

const EmptyProductState = ({ isFiltered = false, onResetFilters }) => {
  if (isFiltered) {
    return (
      <div className="w-full py-16 px-4 text-center flex flex-col items-center justify-center bg-white border border-[#E5E5E5] rounded-2xl max-w-lg mx-auto my-8 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-[#737373]">
          <SearchX className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-[#171717] tracking-tight mb-1">
          No products found
        </h3>
        <p className="text-xs sm:text-sm text-[#737373] max-w-sm mb-6 leading-relaxed">
          Try changing your search query or selecting a different category filter.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium uppercase tracking-[0.14em] rounded-full transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-4 text-center flex flex-col items-center justify-center bg-white border border-[#E5E5E5] rounded-2xl max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-[#737373]">
        <PackageSearch className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-[#171717] tracking-tight mb-1">
        No products available yet
      </h3>
      <p className="text-xs sm:text-sm text-[#737373] max-w-sm leading-relaxed">
        Check back soon for new products and collections.
      </p>
    </div>
  );
};

export default EmptyProductState;
