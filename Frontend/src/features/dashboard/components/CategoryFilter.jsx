import React from "react";

const CategoryFilter = ({
  categories = [],
  selectedCategory = "All",
  onSelectCategory,
}) => {
  // Ensure "All" is always the first item and avoid duplicates
  const allCategories = [
    "All",
    ...categories.filter(
      (cat) => cat && cat.toLowerCase() !== "all"
    ),
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-3 sm:my-5">
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 pt-1 px-2 no-scrollbar scroll-smooth">
        {allCategories.map((category) => {
          const isSelected =
            selectedCategory.toLowerCase() === category.toLowerCase();
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              type="button"
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-[var(--btn-primary)] text-[var(--btn-text)] shadow-xs"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-muted)]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
