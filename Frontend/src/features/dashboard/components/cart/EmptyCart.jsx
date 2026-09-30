import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";

const EmptyCart = () => {
  return (
    <div className="py-16 sm:py-24 px-4 text-center bg-white border border-[var(--border-subtle)] rounded-3xl max-w-xl mx-auto shadow-xs">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--bg-muted)] border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-5">
        <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-stone-400 stroke-[1.5]" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)] mb-2">
        Your cart is empty
      </h2>

      <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-8 leading-relaxed">
        Looks like you haven't added anything to your cart yet. Explore our
        curated collection and discover exceptional pieces.
      </p>

      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--text-primary)] text-white text-xs sm:text-sm font-medium uppercase tracking-[0.14em] rounded-full hover:bg-[#262626] transition-all shadow-xs group"
      >
        <span>Continue Shopping</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default EmptyCart;
