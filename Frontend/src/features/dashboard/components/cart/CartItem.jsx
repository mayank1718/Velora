import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, Package } from "lucide-react";

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  disabled = false,
}) => {
  if (!item) return null;

  // Safe string matching for variant ObjectId
  const selectedVariant = item.product?.variants;

  // Dynamic Image resolution (variant image first, then product image, then fallback)
  const imageUrl =
    selectedVariant?.images?.[0]?.url || item.product?.images?.[0]?.url;

  // Price calculations
  const unitPrice = item.price?.amount ?? 0;
  const currency = item.price?.currency || "INR";
  const itemTotal = unitPrice * (item.quantity || 1);

  const formattedUnitPrice =
    currency === "INR"
      ? `₹${unitPrice.toLocaleString("en-IN")}`
      : `${currency} ${unitPrice.toLocaleString()}`;

  const formattedItemTotal =
    currency === "INR"
      ? `₹${itemTotal.toLocaleString("en-IN")}`
      : `${currency} ${itemTotal.toLocaleString()}`;

  // Dynamic attributes (e.g. Size, Color, Material, RAM, Storage, etc.)
  const dynamicAttributes = Object.entries(selectedVariant?.attributes || {});

  // Stock check
  const stock = selectedVariant?.stock;
  const isMaxStockReached =
    typeof stock === "number" && stock > 0 && item.quantity >= stock;

  const productId = item.product?._id;
  const variantId = item.variant;

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-xs dark-glow">
      {/* Product Image & Core Details */}
      <div className="flex items-start gap-4 w-full sm:w-auto flex-1 min-w-0">
        {/* Thumbnail */}
        <Link
          to={productId ? `/products/${productId}` : "#"}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:opacity-95 transition-opacity"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.product?.title || "Cart product"}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[var(--text-muted)] p-2 text-center">
              <Package className="w-6 h-6 stroke-[1.5]" />
              <span className="text-[9px] uppercase tracking-wider mt-1">
                No image
              </span>
            </div>
          )}
        </Link>

        {/* Product Info & Dynamic Attributes */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {item.product?.category && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)] block">
              {item.product.category}
            </span>
          )}

          <Link
            to={productId ? `/products/${productId}` : "#"}
            className="text-sm sm:text-base font-medium text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors line-clamp-1 block"
          >
            {item.product?.title || "Untitled Product"}
          </Link>

          {/* Dynamic Variant Attributes */}
          {dynamicAttributes.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {dynamicAttributes.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-md text-[11px] text-[var(--text-secondary)]"
                >
                  <span className="capitalize text-[var(--text-muted)]">{key}:</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {String(value)}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-[var(--text-muted)] italic">
              Standard Variant
            </span>
          )}

          {/* Unit Price on Mobile / Subtitle */}
          <div className="text-xs text-[var(--text-secondary)] pt-0.5">
            <span>Unit Price: </span>
            <span className="font-medium text-[var(--text-primary)]">
              {formattedUnitPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity Controls, Total Price & Remove Action */}
      <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border-subtle)]">
        {/* Quantity Controls */}
        <div className="flex items-center border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-muted)] p-1">
          <button
            type="button"
            onClick={() => onDecrease(productId, variantId)}
            disabled={disabled || item.quantity <= 1}
            aria-label="Decrease quantity"
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold text-[var(--text-primary)] select-none">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onIncrease(productId, variantId)}
            disabled={disabled || isMaxStockReached}
            aria-label="Increase quantity"
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right min-w-[75px] sm:min-w-[90px]">
          <span className="text-sm sm:text-base font-bold tracking-tight text-[var(--text-primary)] block">
            {formattedItemTotal}
          </span>
          {item.quantity > 1 && (
            <span className="text-[10px] text-[var(--text-secondary)] block">
              {item.quantity} × {formattedUnitPrice}
            </span>
          )}
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(productId, variantId)}
          disabled={disabled}
          title="Remove item"
          aria-label="Remove item from cart"
          className="p-2 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
