import React from "react";
import { Check } from "lucide-react";

const VariantCard = ({ variant, isSelected, onSelect }) => {
  const attributes = variant?.attributes || {};
  const entries = Object.entries(attributes);

  const priceAmount = variant?.price?.amount;
  const currency = variant?.price?.currency || "INR";
  const formattedPrice =
    typeof priceAmount === "number"
      ? `₹${priceAmount.toLocaleString("en-IN")}`
      : "Price unavailable";

  const stock = typeof variant?.stock === "number" ? variant.stock : 0;
  const isOutOfStock = stock <= 0;
  const variantThumbnail = variant?.images?.[0]?.url;

  return (
    <div
      onClick={() => onSelect(variant)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(variant);
        }
      }}
      className={`relative p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
        isSelected
          ? "border-[var(--text-primary)] bg-white ring-1 ring-[var(--text-primary)] shadow-sm"
          : "border-[var(--border-subtle)] bg-white/70 hover:border-stone-400 hover:bg-white"
      }`}
    >
      {/* Top Header: Attributes & Thumbnail */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 space-y-1">
          {entries.length > 0 ? (
            entries.map(([key, value]) => (
              <div
                key={key}
                className="text-xs sm:text-sm text-[var(--text-primary)] font-medium flex items-center gap-1.5"
              >
                <span className="text-[var(--text-secondary)] capitalize font-normal">
                  {key}:
                </span>
                <span>{String(value)}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-[var(--text-secondary)] italic">Default Option</span>
          )}
        </div>

        {/* Variant Thumbnail if provided */}
        {variantThumbnail ? (
          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
            <img
              src={variantThumbnail}
              alt="Variant option"
              className="w-full h-full object-cover object-center"
            />
          </div>
        ) : isSelected ? (
          <div className="w-5 h-5 rounded-full bg-[var(--text-primary)] text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 stroke-[2.5]" />
          </div>
        ) : null}
      </div>

      {/* Bottom Footer: Price & Stock */}
      <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
        <div className="font-semibold text-[var(--text-primary)]">
          <span>{formattedPrice}</span>{" "}
          <span className="text-[10px] font-normal text-[var(--text-secondary)]">
            {currency}
          </span>
        </div>

        <div>
          {isOutOfStock ? (
            <span className="text-rose-600 font-medium text-[11px]">
              Out of Stock
            </span>
          ) : (
            <span className="text-emerald-700 font-medium text-[11px]">
              Stock: {stock}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantCard;
