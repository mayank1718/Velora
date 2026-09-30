import React from "react";
import { Search, X, ChevronDown, ArrowUpDown, Filter } from "lucide-react";

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "ready-to-wear", label: "Ready to Wear" },
  { value: "tailoring", label: "Tailoring" },
  { value: "footwear", label: "Footwear" },
  { value: "leather-goods", label: "Leather Goods" },
  { value: "accessories", label: "Accessories" },
  { value: "eyewear", label: "Eyewear" },
  { value: "fragrance", label: "Fragrance" },
  { value: "electronics", label: "Electronics" },
  { value: "other", label: "Other" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-asc", label: "Title: A - Z" },
  { value: "title-desc", label: "Title: Z - A" },
  { value: "variants-desc", label: "Most Variants" },
];

const ProductToolbar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  availableCategories = [],
}) => {
  // Merge static categories with any categories present in products
  const categoryList = React.useMemo(() => {
    const list = [...CATEGORY_OPTIONS];
    availableCategories.forEach((cat) => {
      if (cat && !list.some((item) => item.value.toLowerCase() === cat.toLowerCase())) {
        const formatted = cat
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        list.push({ value: cat, label: formatted });
      }
    });
    return list;
  }, [availableCategories]);

  return (
    <div className="py-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search
          className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          strokeWidth={1.75}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs md:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 pl-9 pr-8 py-2.5 focus:border-[var(--border-strong)] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter and Sort Dropdowns */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
        {/* Category Filter */}
        <div className="relative flex-1 sm:flex-initial min-w-[150px]">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] pl-3 pr-8 py-2.5 focus:border-[var(--border-strong)] transition-colors cursor-pointer"
          >
            {categoryList.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={1.75}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-initial min-w-[140px]">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full appearance-none bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] pl-3 pr-8 py-2.5 focus:border-[var(--border-strong)] transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={1.75}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
