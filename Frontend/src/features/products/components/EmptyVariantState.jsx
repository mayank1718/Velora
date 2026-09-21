import React from "react";
import { Layers, Sparkles } from "lucide-react";

const EmptyVariantState = () => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E5E5E5] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center mb-4 text-[#D4AF37]">
        <Layers className="w-7 h-7 stroke-[1.25]" />
      </div>
      <h3 className="text-base sm:text-lg font-light tracking-tight text-[#171717] mb-1.5">
        No variants added yet
      </h3>
      <p className="text-xs text-[#737373] max-w-xs leading-relaxed">
        Add your first variant with custom pricing, inventory, attributes, and photos using the form.
      </p>
    </div>
  );
};

export default EmptyVariantState;
