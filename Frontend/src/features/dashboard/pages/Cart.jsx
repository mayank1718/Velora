import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, ShieldCheck } from "lucide-react";
import BuyerNavbar from "../components/BuyerNavbar";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import CartSkeleton from "../components/cart/CartSkeleton";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const {
    cart,
    loading,
    handleGetCart,
    handleIncreaseItem,
    handledecreaseItem,
    handleDecreaseItem,
    handleRemoveItemFromCart,
    handleRemoveItem,
  } = useCart();
  // Prefer standard handler names with fallback to existing internal names
  const onIncrease = handleIncreaseItem;
  const onDecrease = handleDecreaseItem || handledecreaseItem;
  const onRemove = handleRemoveItem || handleRemoveItemFromCart;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    handleGetCart();
  }, []);
  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const itemCount = cartItems?.reduce(
    (acc, item) => acc + (item?.quantity || 1),
    0,
  );
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#171717] flex flex-col justify-between selection:bg-[#171717] selection:text-white">
      {/* 1. Header / Navbar */}
      <BuyerNavbar />

      {/* 2. Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb / Navigation Action */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[#737373] hover:text-[#171717] font-medium transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Page Title & Item Count Header */}
        <div className="flex items-baseline justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#E5E5E5]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center shadow-2xs">
              <ShoppingBag
                className="w-5 h-5 text-[#171717]"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#171717]">
                Shopping Cart
              </h1>
              <p className="text-xs text-[#737373] mt-0.5">
                Review your items before proceeding to checkout
              </p>
            </div>
          </div>

          {!loading && cartItems.length > 0 && (
            <span className="text-xs sm:text-sm font-medium text-[#737373] bg-white px-3 py-1.5 rounded-full border border-[#E5E5E5] shadow-2xs">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {/* Dynamic Cart States */}
        {loading && (!cart || cart.items.length === 0) ? (
          <CartSkeleton />
        ) : cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
              {cartItems?.map((item, index) => (
                <CartItem
                  key={
                    item._id ||
                    `${item.product?._id || "prod"}-${item.variant || index}`
                  }
                  item={item}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                  disabled={loading}
                />
              ))}
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4">
              <CartSummary cart={cart} loading={loading} />
            </div>
          </div>
        )}
      </main>

      {/* 3. Luxury Minimalist Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 mt-12 border-t border-[#E5E5E5]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-[#737373]">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} VELORA</span>
          <span className="text-[#E5E5E5]">•</span>
          <span>CURATED SHOPPING</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/seller/products"
            className="hover:text-[#171717] transition-colors">
            Seller Atelier
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 text-[#737373]/80">
            <ShieldCheck
              className="w-3.5 h-3.5 text-[#D4AF37]"
              strokeWidth={1.5}
            />
            <span className="text-[10px]">Secure Experience</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
