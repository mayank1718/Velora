import React, { useState } from "react";
import { Layers, Image as ImageIcon, Sparkles, Tag, Package } from "lucide-react";

export const formatCategory = (category) => {
  if (!category) return "General";
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ProductInfo = ({ product, variantCount = 0 }) => {
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const {
    _id,
    title = "Untitled Product",
    description = "",
    category = "ready-to-wear",
    images = [],
  } = product;

  // Extract first image URL
  const firstImage =
    images && images.length > 0
      ? typeof images[0] === "string"
        ? images[0]
        : images[0]?.url || (images[0] instanceof File ? URL.createObjectURL(images[0]) : null)
      : null;

  return (
    <div className="bg-[#FFFFFF] border border-[var(--border-subtle)] p-4 sm:p-5 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Section: Thumbnail & Main Info */}
        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
          {/* Product Thumbnail */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] overflow-hidden relative">
            {firstImage && !imgError ? (
              <img
                src={firstImage}
                alt={title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)]/60 bg-[var(--bg-canvas)]">
                <ImageIcon className="w-6 h-6 stroke-[1.25]" />
              </div>
            )}
            {images.length > 1 && (
              <span className="absolute bottom-1 right-1 px-1 py-0.2 text-[8px] font-mono uppercase bg-[var(--text-primary)]/80 text-white">
                +{images.length - 1}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              {/* Category Badge */}
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]"></span>
                {formatCategory(category)}
              </span>

              {/* Product ID Pill */}
              {_id && (
                <span className="text-[10px] text-[var(--text-secondary)] font-mono tracking-tight hidden md:inline-block">
                  ID: #{String(_id).slice(-6)}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h2 className="text-base sm:text-lg font-light tracking-tight text-[var(--text-primary)] truncate">
              {title}
            </h2>

            {/* Short Description */}
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1 leading-relaxed max-w-2xl">
              {description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Right Section: Compact Status Badge */}
        <div className="w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border-subtle)]/60 flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] sm:min-w-[130px] justify-center">
            <Layers className="w-3.5 h-3.5 text-[var(--accent-gold)]" strokeWidth={1.5} />
            <span className="text-xs font-medium text-[var(--text-primary)]">
              {variantCount} {variantCount === 1 ? "variant" : "variants"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
