import React from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, Plus, RotateCcw } from "lucide-react";

const EmptyProductState = ({ isFiltered = false, onResetFilters }) => {
  if (isFiltered) {
    return (
      <div className="bg-white border border-[#E5E5E5] p-10 sm:p-14 text-center flex flex-col items-center justify-center my-4">
        <div className="w-14 h-14 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center mb-4 text-[#737373]">
          <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="text-lg md:text-xl font-light tracking-tight text-[#171717] mb-1.5">
          No Matching Products
        </h3>
        <p className="text-xs md:text-sm text-[#737373] max-w-md mb-6 leading-relaxed">
          We couldn't find any products matching your search query or filter criteria. Try adjusting your filters or search terms.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#171717] text-[#171717] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#171717] hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E5E5] p-10 sm:p-16 text-center flex flex-col items-center justify-center my-4">
      <div className="w-16 h-16 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center mb-5 text-[#D4AF37]">
        <Package className="w-8 h-8 stroke-[1.25]" />
      </div>
      <h3 className="text-xl md:text-2xl font-light tracking-tight text-[#171717] mb-2">
        No Products Yet
      </h3>
      <p className="text-xs md:text-sm text-[#737373] max-w-md mb-6 leading-relaxed">
        Create your first product to start managing your inventory.
      </p>
      <Link
        to="/seller/create-product"
        className="inline-flex items-center gap-2 px-5 py-3 bg-[#171717] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-black transition-colors"
      >
        <Plus className="w-4 h-4 text-white" strokeWidth={2} />
        <span>Create Product</span>
      </Link>
    </div>
  );
};

export default EmptyProductState;
