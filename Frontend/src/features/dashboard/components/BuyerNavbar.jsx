import React from "react";
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
import { useEffect } from "react";

const BuyerNavbar = () => {
  const { user, handleLogout } = useAuth();
  const { cart, handleGetCart } = useCart();
  useEffect(() => {
    handleGetCart();
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-canvas)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center select-none group focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-[var(--text-primary)] uppercase transition-opacity group-hover:opacity-80">
            VELORA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] ml-0.5 mb-2 self-end inline-block"></span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Cart Link */}
          <Link
            to="/cart"
            title="Shopping Cart"
            className="relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:shadow-[0_0_14px_rgba(212,175,55,0.18)] transition-all"
          >
            <ShoppingBag
              className="w-4 h-4 text-[var(--text-primary)]"
              strokeWidth={1.75}
            />
            {Array.isArray(cart) && cart[0]?.items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-[var(--btn-primary)] text-[var(--btn-text)] text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[var(--bg-canvas)]">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full hover:border-[var(--accent-gold)] hover:shadow-[0_0_14px_rgba(212,175,55,0.18)] transition-all"
            >
              <Store
                className="w-3.5 h-3.5 text-[var(--accent-gold)]"
                strokeWidth={1.75}
              />
              <span className="hidden sm:inline">Seller Atelier</span>
              <span className="sm:hidden">Seller</span>
            </Link>
          ) : user ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] bg-[var(--bg-muted)] rounded-full border border-[var(--border-subtle)]">
              <User className="w-3.5 h-3.5 text-[var(--text-primary)]" strokeWidth={1.75} />
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-full transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-primary)] hover:opacity-70 transition-opacity"
              >
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] bg-[var(--btn-primary)] text-[var(--btn-text)] hover:opacity-80 rounded-full transition-all"
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
