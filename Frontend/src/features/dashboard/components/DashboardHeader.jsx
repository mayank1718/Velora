import React from "react";
import { Sparkles } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="text-center max-w-2xl mx-auto pt-4 sm:pt-8 pb-4">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-white border border-[#E5E5E5] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#737373] shadow-xs">
        <Sparkles className="w-3 h-3 text-[#D4AF37]" strokeWidth={1.75} />
        <span>Curated Catalog</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#171717] leading-tight font-serif">
        Discover Products
      </h1>
      <p className="mt-2 text-sm sm:text-base text-[#737373] font-normal tracking-wide">
        Find something you'll love.
      </p>
    </div>
  );
};

export default DashboardHeader;
