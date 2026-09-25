import React, { useRef } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ searchQuery, onSearchChange }) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-xl mx-auto my-4 sm:my-6">
      <div className="relative flex items-center group">
        {/* Search Icon */}
        <div className="absolute left-4.5 pointer-events-none flex items-center justify-center text-[#737373] group-focus-within:text-[#171717] transition-colors">
          <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2} />
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products by title, category, or description..."
          className="w-full h-12 sm:h-13 pl-11 sm:pl-12 pr-11 sm:pr-12 bg-white border border-[#E5E5E5] rounded-full text-xs sm:text-sm text-[#171717] placeholder:text-[#737373]/60 shadow-xs focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/5 transition-all duration-200"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 sm:right-4 p-1 rounded-full text-[#737373] hover:text-[#171717] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Clear search">
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
