import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowRight, Layers } from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Primary image fallback handling
  const primaryImageUrl = product?.images?.[0]?.url;

  // Calculate lowest price from variants
  const validPrices = (product?.variants || [])
    .map((v) => v?.price?.amount)
    .filter((amt) => typeof amt === "number" && !isNaN(amt) && amt > 0);

  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
  const variantCount = Array.isArray(product?.variants)
    ? product.variants.length
    : 0;

  const handleCardClick = () => {
    if (product?._id) {
      navigate(`/products/${product._id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-square bg-[#F5F5F4] overflow-hidden flex items-center justify-center">
        {primaryImageUrl ? (
          <img
            src={primaryImageUrl}
            alt={product.title || "Product image"}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-400 p-4">
            <Package className="w-10 h-10 mb-2 stroke-[1.25]" />
            <span className="text-[10px] uppercase tracking-wider font-medium text-stone-400">
              No Image
            </span>
          </div>
        )}

        {/* Variant count pill overlay */}
        {variantCount > 0 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-stone-200/80 text-[10px] font-medium text-[#171717] shadow-xs flex items-center gap-1">
            <Layers className="w-3 h-3 text-stone-500" strokeWidth={1.5} />
            <span>
              {variantCount} {variantCount === 1 ? "variant" : "variants"}
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between">
        <div>
          {/* Category */}
          {product.category && (
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#737373] mb-1 truncate">
              {product.category}
            </p>
          )}

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-[#171717] group-hover:text-black line-clamp-2 leading-snug tracking-tight mb-2">
            {product.title}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="pt-2 sm:pt-3 border-t border-stone-100 mt-2 flex flex-col gap-2">
          {/* Price */}
          <div className="flex items-baseline">
            {minPrice !== null ? (
              <span className="text-sm sm:text-base font-semibold text-[#171717] tracking-tight">
                From ₹{minPrice.toLocaleString("en-IN")}
              </span>
            ) : (
              <span className="text-xs text-[#737373] italic">
                Price unavailable
              </span>
            )}
          </div>

          {/* View Product Action */}
          <div className="inline-flex items-center gap-1 text-xs font-medium text-[#171717] group-hover:text-[#D4AF37] transition-colors pt-0.5">
            <span>View Product</span>
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
              strokeWidth={1.75}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
