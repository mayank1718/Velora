import React from "react";
import { Layers, Sparkles } from "lucide-react";

const EmptyVariantState = () => {
  return (
    <div className="bg-[#FFFFFF] border border-[var(--border-subtle)] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center mb-4 text-[var(--accent-gold)]">
        <Layers className="w-7 h-7 stroke-[1.25]" />
      </div>
      <h3 className="text-base sm:text-lg font-light tracking-tight text-[var(--text-primary)] mb-1.5">
        No variants added yet
      </h3>
      <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
        Add your first variant with custom pricing, inventory, attributes, and photos using the form.
      </p>
    </div>
  );
};

export default EmptyVariantState;
