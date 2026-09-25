import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VariantList from "./VariantList";
import { CheckCircle2, XCircle, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { useCart } from "../../hooks/useCart";

const ProductInfo = ({
  productId,
  title,
  category,
  description,
  variants = [],
  selectedVariant,
  onSelectVariant,
}) => {
  const navigate = useNavigate();
  const { handleAddItemToCart, loading: cartLoading } = useCart();
  const [added, setAdded] = useState(false);

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

  const handleAddToCart = async () => {
    if (!productId || !selectedVariant?._id || !isStockAvailable) return;
    const res = await handleAddItemToCart(productId, selectedVariant._id);
    if (res) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

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

      {/* Action Buttons: Add to Cart / View Cart */}
      <div className="pt-2 space-y-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedVariant || !isStockAvailable || cartLoading}
          className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs sm:text-sm font-medium uppercase tracking-[0.14em] transition-all duration-200 shadow-xs cursor-pointer ${
            added
              ? "bg-emerald-700 text-white"
              : "bg-[#171717] text-white hover:bg-[#262626] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" strokeWidth={2} />
              <span>{isStockAvailable ? "Add to Cart" : "Out of Stock"}</span>
            </>
          )}
        </button>

        {added && (
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white border border-[#171717] text-[#171717] text-xs font-medium uppercase tracking-[0.14em] hover:bg-stone-50 transition-all cursor-pointer"
          >
            <span>View Shopping Cart</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
