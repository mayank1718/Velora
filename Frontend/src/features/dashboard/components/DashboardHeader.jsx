import React from "react";
import { Sparkles } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="text-center max-w-2xl mx-auto pt-4 sm:pt-8 pb-4">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] shadow-xs">
        <Sparkles className="w-3 h-3 text-[var(--accent-gold)]" strokeWidth={1.75} />
        <span>Curated Catalog</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[var(--text-primary)] leading-tight font-serif">
        Discover Products
      </h1>
      <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)] font-normal tracking-wide">
        Find something you'll love.
      </p>
    </div>
  );
};

export default DashboardHeader;
