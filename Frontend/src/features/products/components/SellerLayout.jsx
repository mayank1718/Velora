import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles, Store } from "lucide-react";

const SellerLayout = ({
  children,
  backTo = "/",
  backLabel = "Back to Store",
  title = "Create Product",
  subtitle = "Add a new basic product to your atelier collection",
}) => {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#171717] flex flex-col justify-between selection:bg-[#171717] selection:text-white">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between border-b border-[#E5E5E5]/60">
        {/* Back / Navigation Action */}
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[#737373] hover:text-[#171717] transition-colors group"
        >
          <ArrowLeft
            className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#737373] group-hover:text-[#171717]"
            strokeWidth={1.75}
          />
          <span className="hidden sm:inline">{backLabel}</span>
          <span className="sm:hidden">Back</span>
        </Link>

        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center select-none group">
          <span className="text-xl md:text-2xl font-semibold tracking-[0.25em] text-[#171717] uppercase pl-1 transition-opacity group-hover:opacity-90">
            VELORA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] ml-0.5 mb-2 self-end inline-block"></span>
        </Link>

        {/* Seller Status Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium bg-[#FFFFFF] border border-[#E5E5E5] text-[#171717]">
            <Store className="w-3 h-3 text-[#D4AF37]" strokeWidth={1.5} />
            <span className="hidden sm:inline">Seller Atelier</span>
            <span className="sm:hidden">Seller</span>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 md:py-12">
        {/* Page Title & Subtitle */}
        <div className="mb-8 md:mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Catalogue Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-[-0.02em] text-[#171717]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-[#737373] font-normal leading-relaxed mt-1.5 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Child Form / Content */}
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>

      {/* Editorial Minimalist Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 mt-auto border-t border-[#E5E5E5]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-[#737373]">
        <div className="flex items-center gap-2 font-normal">
          <span>&copy; {new Date().getFullYear()} VELORA ATELIER</span>
          <span className="text-[#E5E5E5]">•</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#seller-guidelines"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#171717] transition-colors"
          >
            Seller Policy
          </a>
          <a
            href="#support"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#171717] transition-colors"
          >
            Concierge Support
          </a>
          <div className="hidden sm:flex items-center gap-1.5 text-[#737373]/80">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
            <span className="text-[10px]">Encrypted Session</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerLayout;
