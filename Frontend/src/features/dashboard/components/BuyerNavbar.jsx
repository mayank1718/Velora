import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../hooks/useCart";
import {
  Store,
  User,
  LogOut,
  ShoppingBag,
  ArrowRight,
  LogIn,
} from "lucide-react";
import ThemeToggle from "../../../components/ThemeToggle";

const BuyerNavbar = () => {
  const { user, handleLogout } = useAuth();
  const { cart, handleGetCart } = useCart();
  useEffect(() => {
    handleGetCart();
  }, []);
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF9]/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-[#E5E5E5]/70 dark:border-gray-800/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center select-none group focus:outline-none">
          <span className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#171717] dark:text-white uppercase transition-opacity group-hover:opacity-90">
            VELORA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] ml-0.5 mb-2 self-end inline-block"></span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Cart Link */}
          <Link
            to="/cart"
            title="Shopping Cart"
            className="relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-900 border border-[#E5E5E5] dark:border-gray-700 text-[#171717] dark:text-gray-200 hover:border-[#171717] dark:hover:border-gray-500 hover:bg-[#F5F5F4] dark:hover:bg-gray-800 transition-all shadow-xs">
            <ShoppingBag
              className="w-4 h-4 text-[#171717] dark:text-gray-200"
              strokeWidth={1.75}
            />
            {Array.isArray(cart) && cart[0]?.items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-[#171717] dark:bg-white text-white dark:text-gray-900 text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-950">
                {cart[0]?.items.reduce(
                  (acc, item) => acc + (item?.quantity || 1),
                  0,
                )}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Seller Atelier Link if Seller */}
          {user?.role === "seller" ? (
            <Link
              to="/seller/products"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#171717] dark:text-gray-200 bg-white dark:bg-gray-900 border border-[#E5E5E5] dark:border-gray-700 rounded-full hover:border-[#171717] dark:hover:border-gray-500 hover:bg-[#F5F5F4] dark:hover:bg-gray-800 transition-all shadow-xs">
              <Store
                className="w-3.5 h-3.5 text-[#D4AF37]"
                strokeWidth={1.75}
              />
              <span className="hidden sm:inline">Seller Atelier</span>
              <span className="sm:hidden">Seller</span>
            </Link>
          ) : user ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#737373] dark:text-gray-400 bg-stone-100/70 dark:bg-gray-800/70 rounded-full border border-stone-200/60 dark:border-gray-700/60">
              <User className="w-3.5 h-3.5 text-[#171717] dark:text-gray-300" strokeWidth={1.75} />
              <span className="truncate max-w-[120px]">
                {user.fullname || user.name || "Member"}
              </span>
            </span>
          ) : null}

          {/* Auth Button */}
          {user ? (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#737373] dark:text-gray-400 hover:text-[#171717] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer">
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#171717] dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors">
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white bg-[#171717] dark:bg-white dark:text-gray-900 hover:bg-[#262626] dark:hover:bg-gray-100 rounded-full transition-all shadow-xs">
                <span>Join</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default BuyerNavbar;
