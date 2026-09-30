import React from "react";
import VariantCard from "./VariantCard";
import { Layers } from "lucide-react";

const VariantList = ({
  variants = [],
  selectedVariant,
  onSelectVariant,
}) => {
  const variantArray = Array.isArray(variants) ? variants : [];

  if (variantArray.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent-gold)]" strokeWidth={1.75} />
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
            Available Variants
          </h3>
        </div>
        <span className="text-[11px] text-[var(--text-secondary)]">
          {variantArray.length} {variantArray.length === 1 ? "option" : "options"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {variantArray.map((variant, index) => {
          const isSelected =
            (selectedVariant?._id && selectedVariant._id === variant?._id) ||
            (!selectedVariant && index === 0);

          return (
            <VariantCard
              key={variant?._id || index}
              variant={variant}
              isSelected={isSelected}
              onSelect={onSelectVariant}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VariantList;
