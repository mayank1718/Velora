import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, ShieldCheck } from "lucide-react";
import BuyerNavbar from "../components/BuyerNavbar";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import CartSkeleton from "../components/cart/CartSkeleton";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../../auth/hooks/useAuth";
import { useRazorpay } from "react-razorpay";

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
    handleCreateOrder,
    handleVerifyOrder,
  } = useCart();

  const { user } = useAuth();
  const { Razorpay } = useRazorpay();
  // Prefer standard handler names with fallback to existing internal names
  const onIncrease = handleIncreaseItem;
  const onDecrease = handleDecreaseItem || handledecreaseItem;
  const onRemove = handleRemoveItem || handleRemoveItemFromCart;
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    handleGetCart();
  }, []);
  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const itemCount = cartItems?.reduce(
    (acc, item) => acc + (item?.quantity || 1),
    0,
  );

  async function handlePaymentCheckout() {
    const order = await handleCreateOrder();
    const options = {
      key: "rzp_test_TiNDxUD9iPtO2q",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Velora",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler: async (response) => {
        const isValid = await handleVerifyOrder(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
        );
        if (isValid) {
          navigate(`/order-success?order_id=${response.razorpay_order_id}`);
        }
      },
      prefill: {
        name: user?.fullName,
        email: user?.email,
        contact: user?.contact,
      },
      theme: {
        color: "#F37254", //theme,
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[var(--text-primary)] selection:text-[var(--btn-text)] dark:bg-[var(--bg-canvas)] dark:text-[var(--text-primary)]">
      {/* 1. Header / Navbar */}
      <BuyerNavbar />

      {/* 2. Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb / Navigation Action */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Page Title & Item Count Header */}
        <div className="flex items-baseline justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[var(--border-subtle)]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shadow-2xs">
              <ShoppingBag
                className="w-5 h-5 text-[var(--text-primary)]"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                Shopping Cart
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Review your items before proceeding to checkout
              </p>
            </div>
          </div>

          {!loading && cartItems.length > 0 && (
            <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] px-3 py-1.5 rounded-full border border-[var(--border-subtle)] shadow-2xs">
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
              <CartSummary
                checkOut={handlePaymentCheckout}
                cart={cart}
                loading={loading}
              />
            </div>
          </div>
        )}
      </main>

      {/* 3. Luxury Minimalist Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 mt-12 border-t border-[var(--border-subtle)]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} VELORA</span>
          <span className="text-[var(--border-subtle)]">•</span>
          <span>CURATED SHOPPING</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/seller/products"
            className="hover:text-[var(--text-primary)] transition-colors">
            Seller Atelier
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 text-[var(--text-secondary)]/80">
            <ShieldCheck
              className="w-3.5 h-3.5 text-[var(--accent-gold)]"
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
