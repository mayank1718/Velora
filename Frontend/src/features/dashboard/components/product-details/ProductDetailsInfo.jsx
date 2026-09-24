import React from "react";

const ProductDetailsInfo = ({ category, variantsCount = 0, description }) => {
  return (
    <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[#E5E5E5]">
      <div className="max-w-3xl">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#171717] mb-6">
          Product Details
        </h2>

        {/* Details Meta Table/List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-[#E5E5E5] rounded-xl p-5 mb-6 text-sm">
          <div className="flex items-center justify-between sm:justify-start sm:gap-4 py-1.5 border-b sm:border-b-0 sm:border-r border-stone-100 sm:pr-4">
            <span className="text-[#737373] font-normal">Category</span>
            <span className="text-[#171717] font-medium capitalize">
              {category || "Uncategorized"}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-start sm:gap-4 py-1.5 sm:pl-2">
            <span className="text-[#737373] font-normal">Variants Available</span>
            <span className="text-[#171717] font-medium">
              {variantsCount} {variantsCount === 1 ? "variant" : "variants"}
            </span>
          </div>
        </div>

        {/* Detailed Description */}
        {description && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">
              Full Overview
            </h3>
            <p className="text-sm text-[#525252] leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsInfo;
