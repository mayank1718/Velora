import { Link, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
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
  );
}

export default Footer
