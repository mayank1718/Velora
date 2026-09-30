import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  ArrowRight,
  Image as ImageIcon,
  Circle,
  Trash2,
  Star,
} from "lucide-react";
import { getProductRatingSummary } from "../../dashboard/components/reviews/ratingUtils";

// Format category slug to readable title
export const formatCategory = (category) => {
  if (!category) return "General";
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ProductCard = ({ product, onDeleteProduct }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const {
    _id,
    title = "Untitled Product",
    description = "",
    category = "General",
    images = [],
    variants = [],
  } = product || {};

  const primaryImage = images && images.length > 0 ? images[0]?.url : null;
  const variantCount = Array.isArray(variants) ? variants.length : 0;
  const hasVariants = variantCount > 0;
  const ratingSummary = getProductRatingSummary(product);

  console.log(ratingSummary)

  const handleAddVariants = (e) => {
    e.stopPropagation();
    navigate(`/seller/products/${_id}/variants`);
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    navigate(`/seller/products/${_id}`);
  };

  const handleDelete = async () => {
    await onDeleteProduct?.(_id);
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col h-full hover:border-[var(--accent-gold)]/40 transition-colors duration-200 group">
      {/* 1. Product Image Area (aspect-ratio 4:3) */}
      <div className="relative aspect-[4/3] w-full bg-[var(--bg-muted)] border-b border-[var(--border-subtle)] overflow-hidden">
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] p-4 bg-[var(--bg-muted)]">
            <ImageIcon className="w-8 h-8 stroke-[1.25] mb-1.5 opacity-50" />
            <span className="text-[10px] uppercase tracking-[0.14em] font-medium opacity-70">
              No Image Preview
            </span>
          </div>
        )}

        {/* Multi-image indicator badge */}
        {images && images.length > 1 && (
          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] uppercase font-medium tracking-wider bg-[var(--bg-surface)]/95 text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xs">
            {images.length} Photos
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* 2. Category Badge */}
        <div className="mb-2">
          <span className="inline-block text-[10px] uppercase font-semibold tracking-[0.18em] text-[var(--text-secondary)] bg-[var(--bg-muted)] border border-[var(--border-subtle)] px-2.5 py-0.5">
            {formatCategory(category)}
          </span>
        </div>

        {/* 3. Product Title */}
        <h3
          className="text-base font-medium text-[var(--text-primary)] tracking-tight leading-snug line-clamp-1 mb-1.5 cursor-pointer hover:text-[var(--accent-gold)] transition-colors"
          onClick={handleViewProduct}
          title={title}
        >
          {title}
        </h3>

        {/* 4. Description (Line Clamp 2) */}
        <p
          className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-3 flex-1"
          title={description}
        >
          {description || "No description provided for this product."}
        </p>

        {/* Rating Summary */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          {ratingSummary.hasReviews ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 font-semibold text-xs text-[var(--text-primary)]">
                <Star className="w-3.5 h-3.5 fill-[var(--accent-gold)] text-[var(--accent-gold)]" strokeWidth={1.5} />
                <span>{ratingSummary.formattedRating}</span>
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                ({ratingSummary.reviewCount} {ratingSummary.reviewCount === 1 ? "Review" : "Reviews"})
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <Star className="w-3 h-3" strokeWidth={1.5} />
              <span>No ratings yet</span>
            </span>
          )}
        </div>

        {/* 5. Variant Status */}
        <div className="flex items-center gap-2 mb-4 pt-1 text-xs">
          {hasVariants ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] inline-block" />
              <span>
                {variantCount} {variantCount === 1 ? "variant" : "variants"}
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
              <Circle className="w-2.5 h-2.5 stroke-[1.75]" />
              <span>No variants</span>
            </span>
          )}
        </div>

        {/* 6. Product Actions */}
        <div className="border-t border-[var(--border-subtle)] pt-4 mt-auto flex items-center gap-2">
          {/* Primary Action: Add Variants */}
          <button
            type="button"
            onClick={handleAddVariants}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[var(--btn-primary)] text-[var(--btn-text)] text-xs uppercase tracking-[0.14em] font-medium hover:opacity-80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Add Variants</span>
            <ArrowRight className="w-3 h-3 opacity-70 ml-0.5 hidden sm:inline" />
          </button>

          {/* Secondary Action: View */}
          <button
            type="button"
            onClick={handleViewProduct}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[var(--bg-muted)] hover:border-[var(--border-strong)] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[var(--text-secondary)]" strokeWidth={1.75} />
            <span>View</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            title="Delete product"
            className="inline-flex items-center justify-center p-2.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
