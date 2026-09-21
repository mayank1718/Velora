import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuthHeader = ({ backTo = "/login", backLabel = "Back" }) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
      {/* Back / Navigation Action */}
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[#737373] hover:text-[#171717] transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#737373] group-hover:text-[#171717]" strokeWidth={1.75} />
        <span>{backLabel}</span>
      </Link>

      {/* Brand Wordmark */}
      <Link to="/login" className="flex items-center select-none">
        <span className="text-xl md:text-2xl font-semibold tracking-[0.25em] text-[#171717] uppercase pl-1">
          SNITCH
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] ml-0.5 mb-2 self-end inline-block"></span>
      </Link>

      {/* Auxiliary Help Action */}
      <div className="text-right">
        <a
          href="#help"
          onClick={(e) => e.preventDefault()}
          className="text-xs uppercase tracking-[0.14em] font-medium text-[#737373] hover:text-[#171717] transition-colors"
        >
          Concierge
        </a>
      </div>
    </header>
  );
};

export default AuthHeader;
