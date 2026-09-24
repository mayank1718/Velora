import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  Store,
  User,
  LogOut,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  LogIn,
} from "lucide-react";

const BuyerNavbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF9]/90 backdrop-blur-md border-b border-[#E5E5E5]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center select-none group focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#171717] uppercase transition-opacity group-hover:opacity-90">
            VELORA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] ml-0.5 mb-2 self-end inline-block"></span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Seller Atelier Link if Seller */}
          {user?.role === "seller" ? (
            <Link
              to="/seller/products"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#171717] bg-white border border-[#E5E5E5] rounded-full hover:border-[#171717] hover:bg-[#F5F5F4] transition-all shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.75} />
              <span className="hidden sm:inline">Seller Atelier</span>
              <span className="sm:hidden">Seller</span>
            </Link>
          ) : user ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#737373] bg-stone-100/70 rounded-full border border-stone-200/60">
              <User className="w-3.5 h-3.5 text-[#171717]" strokeWidth={1.75} />
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#737373] hover:text-[#171717] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#171717] hover:text-black transition-colors"
              >
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white bg-[#171717] hover:bg-[#262626] rounded-full transition-all shadow-xs"
              >
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
