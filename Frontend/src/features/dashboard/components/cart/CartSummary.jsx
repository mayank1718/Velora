import { ArrowRight, ShieldCheck, Lock, Truck } from "lucide-react";

const CartSummary = ({ cart = [], loading = false, checkOut }) => {
  // Compute subtotal from cart items stored price
  const subtotal = cart.totalPrice;
  // Derive currency from first item or default to INR
  const currency = cart?.price?.currency || "INR";

  const formattedSubtotal =
    currency === "INR" ? `₹${subtotal}` : `${currency} ${subtotal}`;

  const formattedTotal = formattedSubtotal;

  const handleCheckout = () => {
    checkOut();
  };

  const isCartEmpty = !cart || cart?.items.length === 0;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 sm:p-6 shadow-xs sticky top-24 space-y-6">
      <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text-primary)] pb-3 border-b border-[var(--border-subtle)]">
        Order Summary
      </h2>

      {/* Summary Breakdown */}
      <div className="space-y-3.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span>Subtotal</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {formattedSubtotal}
          </span>
        </div>

        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span>Estimated Shipping</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-500">
              Complimentary
            </span>
          </div>
          <span className="font-medium text-emerald-500">Free</span>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] block">
              Total
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
              Including all taxes
            </span>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Checkout Action Button */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || isCartEmpty}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[var(--btn-primary)] text-[var(--btn-text)] text-xs sm:text-sm font-medium uppercase tracking-[0.14em] hover:opacity-80 active:scale-[0.99] transition-all duration-200 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
        <Lock className="w-4 h-4 text-[var(--accent-gold)]" strokeWidth={2} />
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4 ml-0.5" />
      </button>

      {/* Trust & Assurance Badges */}
      <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2.5 text-[11px] text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)] flex-shrink-0" />
          <span>Authenticity &amp; Quality Guaranteed</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
          <span>Express Tracked Dispatch</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
