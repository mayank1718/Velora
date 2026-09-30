import React from "react";
import { Store, ShieldCheck } from "lucide-react";

const ProductDetailsInfo = ({ category, variantsCount = 0, description, seller }) => {
  const sellerName =
    typeof seller === "object" && seller?.fullname
      ? seller.fullname
      : typeof seller === "string"
        ? "Verified Merchant Atelier"
        : "Velora Verified Atelier";

  return (
    <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-3xl">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)] mb-6">
          Product Details
        </h2>

        {/* Details Meta Table/List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 mb-6 text-sm">
          <div className="flex items-center justify-between sm:justify-start sm:gap-4 py-1.5 border-b sm:border-b-0 sm:border-r border-[var(--border-subtle)] sm:pr-4">
            <span className="text-[var(--text-secondary)] font-normal text-xs uppercase tracking-wider">Category</span>
            <span className="text-[var(--text-primary)] font-medium capitalize">
              {category || "Uncategorized"}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-start sm:gap-4 py-1.5 border-b sm:border-b-0 sm:border-r border-[var(--border-subtle)] sm:pr-4 sm:pl-2">
            <span className="text-[var(--text-secondary)] font-normal text-xs uppercase tracking-wider">Variants</span>
            <span className="text-[var(--text-primary)] font-medium">
              {variantsCount} {variantsCount === 1 ? "variant" : "variants"}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-start sm:gap-3 py-1.5 sm:pl-2">
            <span className="text-[var(--text-secondary)] font-normal text-xs uppercase tracking-wider">Seller</span>
            <span className="text-[var(--text-primary)] font-medium inline-flex items-center gap-1.5 truncate max-w-[140px]" title={sellerName}>
              <Store className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
              <span className="truncate">{sellerName}</span>
            </span>
          </div>
        </div>

        {/* Detailed Description */}
        {description && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Product Overview
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsInfo;
