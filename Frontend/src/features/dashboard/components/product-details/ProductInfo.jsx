import React from "react";
import VariantList from "./VariantList";
import { CheckCircle2, XCircle } from "lucide-react";

const ProductInfo = ({
  title,
  category,
  description,
  variants = [],
  selectedVariant,
  onSelectVariant,
}) => {
  const variantList = Array.isArray(variants) ? variants : [];

  // Calculate pricing based on variants
  const prices = variantList
    .map((v) => v?.price?.amount)
    .filter((amt) => typeof amt === "number" && !isNaN(amt) && amt > 0);

  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
  const isUniformPrice = minPrice !== null && minPrice === maxPrice;

  // Selected variant specific values
  const activePrice = selectedVariant?.price?.amount;
  const activeCurrency = selectedVariant?.price?.currency || "INR";
  const activeStock =
    typeof selectedVariant?.stock === "number"
      ? selectedVariant.stock
      : variantList[0]?.stock ?? 0;

  const isStockAvailable = activeStock > 0;

  return (
    <div className="flex flex-col space-y-6">
      {/* Category & Title */}
      <div className="space-y-2">
        {category && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
            {category}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] leading-tight">
          {title || "Untitled Product"}
        </h1>
      </div>

      {/* Price Display */}
      <div className="py-3 px-4 bg-[#F5F5F4]/60 border border-[#E5E5E5] rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#737373] block mb-0.5">
            {selectedVariant ? "Selected Variant Price" : "Price"}
          </span>
          <div className="flex items-baseline gap-2">
            {selectedVariant && typeof activePrice === "number" ? (
              <>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                  ₹{activePrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-medium text-[#737373]">
                  {activeCurrency}
                </span>
              </>
            ) : isUniformPrice && minPrice !== null ? (
              <>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                  ₹{minPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-medium text-[#737373]">
                  {variantList[0]?.price?.currency || "INR"}
                </span>
              </>
            ) : minPrice !== null ? (
              <>
                <span className="text-xs font-medium uppercase text-[#737373]">
                  From
                </span>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                  ₹{minPrice.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="text-sm text-[#737373] italic">
                Price upon selection
              </span>
            )}
          </div>
        </div>

        {/* Stock Status Badge */}
        <div className="text-right">
          {selectedVariant ? (
            isStockAvailable ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>In Stock ({activeStock})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-full text-xs font-medium">
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Out of Stock</span>
              </div>
            )
          ) : (
            <div className="text-xs text-[#737373]">
              {variantList.length > 0 ? "Select a variant" : "No variants"}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">
            About This Item
          </h3>
          <p className="text-sm text-[#525252] leading-relaxed font-normal whitespace-pre-line">
            {description}
          </p>
        </div>
      )}

      {/* Variants Section */}
      <VariantList
        variants={variantList}
        selectedVariant={selectedVariant}
        onSelectVariant={onSelectVariant}
      />
    </div>
  );
};

export default ProductInfo;
