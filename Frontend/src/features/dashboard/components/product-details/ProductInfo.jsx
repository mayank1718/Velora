import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VariantList from "./VariantList";
import {
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Check,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useProduct } from "../../hooks/useProduct";
import { calculateRatingStats } from "../reviews/ratingUtils";
import RatingStars from "../reviews/RatingStars";

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
  const { reviews } = useProduct();
  const ratingStats = calculateRatingStats(reviews);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const variantList = Array.isArray(variants) ? variants : [];

  // Reset quantity to 1 when selected variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?._id]);

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
    const res = await handleAddItemToCart(
      productId,
      selectedVariant._id,
      quantity
    );
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            {category}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)] dark:text-[#F5F5F5] leading-tight">
          {title || "Untitled Product"}
        </h1>

        {/* Rating Summary Link */}
        <div className="pt-1 flex items-center gap-2">
          {ratingStats.hasReviews ? (
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("product-reviews-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
            >
              <RatingStars value={ratingStats.averageRating} size="xs" readOnly />
              <span className="font-semibold text-[var(--text-primary)]">
                {ratingStats.formattedRating}
              </span>
              <span className="text-[var(--text-secondary)] group-hover:underline">
                ({ratingStats.reviewCount} {ratingStats.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("product-reviews-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <RatingStars value={0} size="xs" readOnly />
              <span className="text-[11px] underline">Be the first to review</span>
            </button>
          )}
        </div>
      </div>

      {/* Price Display */}
      <div className="py-3 px-4 bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)] rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-secondary)] block mb-0.5">
            {selectedVariant ? "Selected Variant Price" : "Price"}
          </span>
          <div className="flex items-baseline gap-2">
            {selectedVariant && typeof activePrice === "number" ? (
              <>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  ₹{activePrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {activeCurrency}
                </span>
              </>
            ) : isUniformPrice && minPrice !== null ? (
              <>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  ₹{minPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {variantList[0]?.price?.currency || "INR"}
                </span>
              </>
            ) : minPrice !== null ? (
              <>
                <span className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                  From
                </span>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  ₹{minPrice.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="text-sm text-[var(--text-secondary)] italic">
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
            <div className="text-xs text-[var(--text-secondary)]">
              {variantList.length > 0 ? "Select a variant" : "No variants"}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            About This Item
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal whitespace-pre-line">
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

      {/* Quantity Selector Section */}
      {isStockAvailable && (
        <div className="pt-2 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Quantity
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Max available:{" "}
              <strong className="text-[var(--text-primary)]">{activeStock}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quantity Stepper */}
            <div className="inline-flex items-center border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-canvas)] p-1">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1 || cartLoading}
                aria-label="Decrease quantity"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-stone-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="w-12 text-center text-sm font-semibold text-[var(--text-primary)] select-none">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((prev) => Math.min(activeStock, prev + 1))
                }
                disabled={quantity >= activeStock || cartLoading}
                aria-label="Increase quantity"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-stone-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total calculation indicator */}
            {typeof activePrice === "number" && quantity > 1 && (
              <div className="text-xs text-[var(--text-secondary)]">
                <span>Total: </span>
                <span className="font-bold text-[var(--text-primary)]">
                  ₹{(activePrice * quantity).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons: Add to Cart / View Cart */}
      <div className="pt-2 space-y-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedVariant || !isStockAvailable || cartLoading}
          className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs sm:text-sm font-medium uppercase tracking-[0.14em] transition-all duration-200 shadow-xs cursor-pointer ${
            added
              ? "bg-emerald-700 text-white"
              : "bg-[var(--text-primary)] text-[var(--text-secondary)] hover:bg-[#262626] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>
                Added {quantity} {quantity === 1 ? "Item" : "Items"} to Cart!
              </span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[var(--accent-gold)]" strokeWidth={2} />
              <span>
                {isStockAvailable
                  ? quantity > 1
                    ? `Add ${quantity} to Cart`
                    : "Add to Cart"
                  : "Out of Stock"}
              </span>
            </>
          )}
        </button>

        {added && (
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white border border-[var(--text-primary)] text-[var(--text-primary)] text-xs font-medium uppercase tracking-[0.14em] hover:bg-stone-50 transition-all cursor-pointer"
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
