import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Lock, Truck } from "lucide-react";

const CartSummary = ({ cart = [], loading = false }) => {
  const navigate = useNavigate();

  // Compute subtotal from cart items stored price
  const subtotal = cart[0]?.items.reduce((total, item) => {
    const price = item?.price?.amount ?? 0;
    const quantity = item?.quantity ?? 1;
    return total + price * quantity;
  }, 0);
  // Derive currency from first item or default to INR
  const currency = cart?.[0]?.price?.currency || "INR";

  const formattedSubtotal =
    currency === "INR"
      ? `₹${subtotal.toLocaleString("en-IN")}`
      : `${currency} ${subtotal.toLocaleString()}`;

  const formattedTotal = formattedSubtotal;

  const handleCheckout = () => {
    // Navigate to checkout route
    navigate("/checkout");
  };

  const isCartEmpty = !cart || cart.length === 0;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-xs sticky top-24 space-y-6">
      <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#171717] pb-3 border-b border-stone-100">
        Order Summary
      </h2>

      {/* Summary Breakdown */}
      <div className="space-y-3.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-[#525252]">
          <span>Subtotal</span>
          <span className="font-semibold text-[#171717]">
            {formattedSubtotal}
          </span>
        </div>

        <div className="flex items-center justify-between text-[#525252]">
          <div className="flex items-center gap-1.5">
            <span>Estimated Shipping</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
              Complimentary
            </span>
          </div>
          <span className="font-medium text-emerald-700">Free</span>
        </div>

        <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between">
          <div>
            <span className="text-sm sm:text-base font-bold text-[#171717] block">
              Total
            </span>
            <span className="text-[10px] text-[#737373] uppercase tracking-wider">
              Including all taxes
            </span>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#171717]">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Checkout Action Button */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || isCartEmpty}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#171717] text-white text-xs sm:text-sm font-medium uppercase tracking-[0.14em] hover:bg-[#262626] active:scale-[0.99] transition-all duration-200 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <Lock className="w-4 h-4 text-[#D4AF37]" strokeWidth={2} />
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4 ml-0.5" />
      </button>

      {/* Trust & Assurance Badges */}
      <div className="pt-4 border-t border-stone-100 space-y-2.5 text-[11px] text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
          <span>Authenticity & Quality Guaranteed</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#737373] flex-shrink-0" />
          <span>Express Tracked Dispatch</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
