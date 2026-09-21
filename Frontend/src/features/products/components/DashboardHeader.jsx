import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const DashboardHeader = ({ totalCount = 0 }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#171717]">
            Products
          </h1>
          {totalCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium tracking-wider bg-[#FAFAF9] border border-[#E5E5E5] text-[#737373]">
              {totalCount}
            </span>
          )}
        </div>
        <p className="text-xs md:text-sm text-[#737373] font-normal mt-1">
          Manage your products and configure their variants.
        </p>
      </div>

      <Link
        to="/seller/create-product"
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-black transition-colors self-start sm:self-center"
      >
        <Plus className="w-4 h-4 text-white" strokeWidth={2} />
        <span>Add Product</span>
      </Link>
    </div>
  );
};

export default DashboardHeader;
