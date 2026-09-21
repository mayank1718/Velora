import React from "react";
import AuthHeader from "./AuthHeader";
import { ShieldCheck } from "lucide-react";

const AuthLayout = ({ children, backTo = "/login", backLabel = "Back" }) => {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#171717] flex flex-col justify-between selection:bg-[#171717] selection:text-white">
      {/* Top Header */}
      <AuthHeader backTo={backTo} backLabel={backLabel} />

      {/* Main Form Centerpiece */}
      <main className="flex-1 flex items-center justify-center px-6 py-6 md:py-10">
        <div className="w-full max-w-[420px] mx-auto animate-fadeIn">
          {children}
        </div>
      </main>

      {/* Subtle Editorial Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-8 mt-auto border-t border-[#E5E5E5]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-[#737373]">
        <div className="flex items-center gap-2 font-normal">
          <span>&copy; {new Date().getFullYear()} SNITCH ATELIER</span>
          <span className="text-[#E5E5E5]">•</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#171717] transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#171717] transition-colors">
            Terms of Service
          </a>
          <div className="hidden sm:flex items-center gap-1.5 text-[#737373]/80">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
            <span className="text-[10px]">Encrypted</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
