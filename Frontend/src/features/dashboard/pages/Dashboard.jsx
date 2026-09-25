import { useEffect, useState, useMemo } from "react";
import BuyerNavbar from "../components/BuyerNavbar";
import DashboardHeader from "../components/DashboardHeader";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import ProductSkeleton from "../components/ProductSkeleton";
import EmptyProductState from "../components/EmptyProductState";
import ErrorState from "../components/ErrorState";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";

const Dashboard = () => {
  const { loading, error, allProducts, handleGetAllProducts, handleSearchProducts } = useProduct()

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch all products on mount
  useEffect(() => {
    handleGetAllProducts();
  }, [handleGetAllProducts]);

  // Safe products array
  const products = useMemo(() => {
    return Array.isArray(allProducts) ? allProducts : [];
  }, [allProducts]);

  // Extract unique categories available from products or provide standard presets
  const availableCategories = useMemo(() => {
    const categorySet = new Set();
    products.forEach((p) => {
      if (p.category && typeof p.category === "string" && p.category.trim()) {
        categorySet.add(p.category.trim());
      }
    });

    // If categories are extracted from products, use them
    if (categorySet.size > 0) {
      return Array.from(categorySet);
    }

    // Default standard categories fallback
    return ["Men", "Women", "Shoes", "Accessories", "Electronics"];
  }, [products]);

  // Combined Search + Category Filtering + Frontend Sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Search filter (case-insensitive on title, category, description)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const categoryMatch = p.category?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        return Boolean(titleMatch || categoryMatch || descMatch);
      });
    }

    // 2. Category filter
    if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
      list = list.filter(
        (p) =>
          p.category &&
          p.category.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase(),
      );
    }

    return list;
  }, [products, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#171717] flex flex-col justify-between selection:bg-[#171717] selection:text-white">
      {/* 1. Header / Navbar */}
      <BuyerNavbar />

      {/* 2. Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <DashboardHeader />

        {/* Search Bar */}
        <SearchBar searchQuery={search} onSearchChange={setSearch} />

        {/* Category Filter */}
        <CategoryFilter
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Dynamic Content States */}
        <div className="mt-2 min-h-[360px]">
          {loading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={handleGetAllProducts} />
          ) : products.length === 0 ? (
            <EmptyProductState isFiltered={false} />
          ) : filteredProducts.length === 0 ? (
            <EmptyProductState isFiltered={true} />
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </main>

      {/* 3. Luxury Minimalist Footer */}
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
    </div>
  );
};

export default Dashboard;
