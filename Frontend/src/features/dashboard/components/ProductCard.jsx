import { useNavigate } from "react-router-dom";
import { Package, ArrowRight, Layers, Star } from "lucide-react";
import { getProductRatingSummary } from "./reviews/ratingUtils";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const ratingSummary = getProductRatingSummary(product);

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
      className="group flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-[var(--border-strong)] transition-all duration-300 cursor-pointer h-full"
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-square bg-[var(--bg-muted)] overflow-hidden flex items-center justify-center">
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
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[var(--bg-surface)]/90 backdrop-blur-xs border border-[var(--border-subtle)] text-[10px] font-medium text-[var(--text-primary)] shadow-xs flex items-center gap-1">
            <Layers className="w-3 h-3 text-[var(--text-secondary)]" strokeWidth={1.5} />
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
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-1 truncate">
              {product.category}
            </p>
          )}

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--text-primary)] line-clamp-2 leading-snug tracking-tight mb-1.5">
            {product.title}
          </h3>

          {/* Rating Summary */}
          <div className="flex items-center gap-1.5 text-xs mb-2">
            {ratingSummary.hasReviews ? (
              <div className="flex items-center gap-1">
                <Star
                  className="w-3.5 h-3.5 fill-[var(--accent-gold)] text-[var(--accent-gold)] shrink-0"
                  strokeWidth={1.5}
                />
                <span className="font-semibold text-xs text-[var(--text-primary)]">
                  {ratingSummary.formattedRating}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  ({ratingSummary.reviewCount} {ratingSummary.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                <Star className="w-3 h-3 text-[var(--border-strong)]" strokeWidth={1.5} />
                <span>No ratings</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 sm:pt-3 border-t border-[var(--border-subtle)] mt-2 flex flex-col gap-2">
          {/* Price */}
          <div className="flex items-baseline">
            {minPrice !== null ? (
              <span className="text-sm sm:text-base font-semibold text-[var(--text-primary)] tracking-tight">
                From ₹{minPrice.toLocaleString("en-IN")}
              </span>
            ) : (
              <span className="text-xs text-[var(--text-secondary)] italic">
                Price unavailable
              </span>
            )}
          </div>

          {/* View Product Action */}
          <div className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors pt-0.5">
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
