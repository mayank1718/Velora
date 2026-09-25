import { Link, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 mt-12 border-t border-[#E5E5E5]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-[#737373]">
      <div className="flex items-center gap-2">
        <span>&copy; {new Date().getFullYear()} VELORA</span>
        <span className="text-[#E5E5E5]">•</span>
        <span>CURATED SHOPPING</span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          to="/seller/products"
          className="hover:text-[#171717] transition-colors">
          Seller Atelier
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-[#737373]/80">
          <ShieldCheck
            className="w-3.5 h-3.5 text-[#D4AF37]"
            strokeWidth={1.5}
          />
          <span className="text-[10px]">Secure Experience</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer
