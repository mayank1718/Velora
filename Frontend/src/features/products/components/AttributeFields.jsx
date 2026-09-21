import React from "react";
import { Plus, Trash2, SlidersHorizontal, Sparkles } from "lucide-react";

// Common attribute suggestions for quick creation
const SUGGESTED_KEYS = ["Size", "Color", "Material", "Storage", "Fit", "Style"];

const AttributeFields = ({
  attributes = [],
  onChange,
  error = null,
}) => {
  // Add a new empty key-value pair
  const handleAddPair = (defaultKey = "") => {
    onChange([...attributes, { key: defaultKey, value: "" }]);
  };

  // Remove a key-value pair by index
  const handleRemovePair = (indexToRemove) => {
    // If only one pair exists, keep at least one empty or remove
    const updated = attributes.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  // Update key or value at a specific index
  const handleFieldChange = (index, field, val) => {
    const updated = attributes.map((attr, idx) => {
      if (idx === index) {
        return { ...attr, [field]: val };
      }
      return attr;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Header and Add Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[#737373]">
            Attributes <span className="text-[#D4AF37]">*</span>
          </label>
        </div>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[#737373]">
          {attributes.length} {attributes.length === 1 ? "Pair" : "Pairs"}
        </span>
      </div>

      {/* Suggested Quick Tags */}
      <div className="flex items-center flex-wrap gap-1.5 pb-1">
        <span className="text-[10px] uppercase tracking-[0.14em] text-[#737373]/80 mr-1 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" /> Suggestions:
        </span>
        {SUGGESTED_KEYS.map((sugKey) => {
          const alreadyUsed = attributes.some(
            (a) => a.key.toLowerCase().trim() === sugKey.toLowerCase()
          );
          return (
            <button
              key={sugKey}
              type="button"
              disabled={alreadyUsed}
              onClick={() => handleAddPair(sugKey)}
              className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                alreadyUsed
                  ? "bg-[#FAFAF9] text-[#737373]/40 border border-[#E5E5E5] cursor-not-allowed line-through"
                  : "bg-[#FFFFFF] hover:bg-[#FAFAF9] text-[#171717] border border-[#E5E5E5] hover:border-[#171717] cursor-pointer"
              }`}
            >
              + {sugKey}
            </button>
          );
        })}
      </div>

      {/* Attributes Dynamic List */}
      <div className="space-y-2.5">
        {attributes.map((attr, index) => (
          <div
            key={index}
            className="flex items-center gap-2 sm:gap-3 bg-[#FAFAF9] p-2.5 sm:p-3 border border-[#E5E5E5]"
          >
            {/* Key Input */}
            <div className="flex-1 min-w-0">
              <label
                htmlFor={`attr-key-${index}`}
                className="sr-only"
              >
                Attribute Key {index + 1}
              </label>
              <input
                id={`attr-key-${index}`}
                type="text"
                placeholder="Key (e.g. Size, Color)"
                value={attr.key}
                onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E5E5] text-xs text-[#171717] placeholder:text-[#737373]/50 focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 transition-colors"
              />
            </div>

            {/* Separator Arrow or Colon */}
            <span className="text-xs text-[#737373]/60 font-mono select-none">
              →
            </span>

            {/* Value Input */}
            <div className="flex-1 min-w-0">
              <label
                htmlFor={`attr-val-${index}`}
                className="sr-only"
              >
                Attribute Value {index + 1}
              </label>
              <input
                id={`attr-val-${index}`}
                type="text"
                placeholder="Value (e.g. XL, Black)"
                value={attr.value}
                onChange={(e) =>
                  handleFieldChange(index, "value", e.target.value)
                }
                className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E5E5E5] text-xs text-[#171717] placeholder:text-[#737373]/50 focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 transition-colors"
              />
            </div>

            {/* Remove Action */}
            <button
              type="button"
              onClick={() => handleRemovePair(index)}
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#FFFFFF] border border-[#E5E5E5] text-[#737373] hover:text-red-600 hover:border-red-300 hover:bg-red-50/20 transition-colors cursor-pointer"
              title="Remove attribute"
              aria-label={`Remove attribute ${attr.key || index + 1}`}
            >
              <Trash2 className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Custom Attribute Button */}
      <button
        type="button"
        onClick={() => handleAddPair("")}
        className="w-full h-10 px-4 border border-dashed border-[#E5E5E5] hover:border-[#171717] bg-[#FFFFFF] hover:bg-[#FAFAF9] text-[#171717] text-xs uppercase tracking-[0.14em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={2} />
        <span>Add Attribute</span>
      </button>

      {/* Validation Error Message */}
      {error && (
        <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
          <span className="font-bold">•</span> {error}
        </p>
      )}
    </div>
  );
};

export default AttributeFields;
