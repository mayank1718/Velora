import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "../../../components/ThemeToggle";

const AuthHeader = ({ backTo = "/login", backLabel = "Back" }) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
      {/* Back / Navigation Action */}
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
      >
        <ArrowLeft
          className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
          strokeWidth={1.75}
        />
        <span>{backLabel}</span>
      </Link>

      {/* Brand Wordmark */}
      <Link to="/login" className="flex items-center select-none group">
        <span className="text-xl md:text-2xl font-semibold tracking-[0.25em] text-[var(--text-primary)] uppercase pl-1 group-hover:opacity-80 transition-opacity">
          VELORA
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] ml-0.5 mb-2 self-end inline-block"></span>
      </Link>

      {/* Right: Theme Toggle + Concierge */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href="#help"
          onClick={(e) => e.preventDefault()}
          className="hidden sm:block text-xs uppercase tracking-[0.14em] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Concierge
        </a>
      </div>
    </header>
  );
};

export default AuthHeader;
