import React, { useState } from "react";
import {
  Image as ImageIcon,
  Edit2,
  Trash2,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";

// Currency symbols
const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  JPY: "¥",
};

const VariantCard = ({
  variant,
  handleDelete,
}) => {
  const [imgError, setImgError] = useState(false);
  const { productId } = useParams();
  const {
    _id,
    stock = 0,
    price = { amount: 0, currency: "INR" },
    attributes = {},
    images = [],
  } = variant || {};

  // Extract first image
  const primaryImage =
    images && images.length > 0
      ? typeof images[0] === "string"
        ? images[0]
        : images[0]?.url ||
          (images[0] instanceof File ? URL.createObjectURL(images[0]) : null)
      : null;

  const symbol = CURRENCY_SYMBOLS[price.currency] || price.currency || "₹";

  // Parse attributes whether stored as Object { size: 'XL', color: 'Black' } or Array [{key, value}]
  const attrEntries = Array.isArray(attributes)
    ? attributes.map((a) => [a.key, a.value])
    : Object.entries(attributes || {});

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#171717]/30 transition-all p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start group">
      {/* Thumbnail Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-[#FAFAF9] border border-[#E5E5E5] overflow-hidden relative self-center sm:self-start">
        {primaryImage && !imgError ? (
          <img
            src={primaryImage}
            alt="Variant thumbnail"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#737373]/60 bg-[#FAFAF9]">
            <ImageIcon className="w-6 h-6 stroke-[1.25]" />
          </div>
        )}
        {images.length > 1 && (
          <span className="absolute bottom-1 right-1 px-1 py-0.2 text-[8px] font-mono uppercase bg-[#171717]/90 text-white">
            {images.length} photos
          </span>
        )}
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0 space-y-2.5 w-full">
        {/* Attributes Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {attrEntries.length > 0 ? (
            attrEntries.map(([k, v], idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717]">
                <span className="text-[#737373] capitalize">{k}:</span>
                <span className="font-semibold text-[#171717]">{v}</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-[#737373] italic">
              No attributes configured
            </span>
          )}
        </div>

        {/* Price & Stock Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#E5E5E5]/60">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-light tracking-tight text-[#171717]">
              {symbol}
              {Number(price.amount || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono uppercase text-[#737373] tracking-wider">
              {price.currency}
            </span>
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                Number(stock) > 0 ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            <span className="font-medium text-[#171717]">
              Stock: {Number(stock || 0)}
            </span>
            <span className="text-[#737373] text-[11px]">units</span>
          </div>
        </div>

        {/* Card Actions: Edit & Delete (visual placeholders as requested) */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            title="Edit variant (coming soon)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] font-medium bg-[#FFFFFF] border border-[#E5E5E5] text-[#737373]  hover:bg-[#FFFFFF]">
            <Edit2 className="w-3 h-3 stroke-[1.75]" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => {
              handleDelete(productId, _id);
            }}
            title="Delete variant (coming soon)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] font-medium bg-[#FFFFFF] border border-[#E5E5E5] text-[#737373]  hover:bg-[#FFFFFF]">
            <Trash2 className="w-3 h-3 stroke-[1.75]" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantCard;
