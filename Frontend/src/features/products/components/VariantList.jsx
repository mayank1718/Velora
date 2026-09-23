import React from "react";
import VariantCard from "./VariantCard";
import EmptyVariantState from "./EmptyVariantState";

const VariantList = ({ variants = [], handleDelete, handleEdit,setEditingVariant,editingVariant }) => {
  const count = Array.isArray(variants) ? variants.length : 0;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] p-4 sm:p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
              Catalogue Variations
            </span>
          </div>
          <h2 className="text-base font-medium text-[#171717] tracking-tight">
            Existing Variants
          </h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono font-medium bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717]">
          {count} {count === 1 ? "variant" : "variants"}
        </span>
      </div>

      {/* List or Empty State */}
      {count === 0 ? (
        <EmptyVariantState />
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <VariantCard
              key={variant._id || `variant-${index}`}
              variant={variant}
              index={index} 
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              setEditingVariant={setEditingVariant}
              editingVariant={editingVariant}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantList;
