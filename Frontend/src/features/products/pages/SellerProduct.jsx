import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Store, ShieldCheck } from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import ProductToolbar from "../components/ProductToolbar";
import ProductGrid from "../components/ProductGrid";
import EmptyProductState from "../components/EmptyProductState";
import ProductSkeleton from "../components/ProductSkeleton";
import ErrorState from "../components/ErrorState";
import { useSeller } from "../hooks/useSeller";

const SellerProduct = () => {
  const {
    handelGetSellerProduct,
    handleDeleteProduct,
    loading,
    sellerProducts,
  } = useSeller();
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch seller products on mount
  const fetchProducts = useCallback(async () => {
    setError(null);
    try {
      const res = await handelGetSellerProduct();
      if (res === false) {
        setError("Failed to fetch your products. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching seller products:", err);
      setError("An unexpected error occurred while loading products.");
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Safe products array
  const products = Array.isArray(sellerProducts) ? sellerProducts : [];

  // Extract unique category values from the actual products
  const availableCategories = useMemo(() => {
    const categories = new Set();
    products.forEach((p) => {
      if (p.category) {
        categories.add(p.category);
      }
    });
    return Array.from(categories);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        return titleMatch || descMatch || catMatch;
      });
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "newest") {
        // Fallback to original order reverse or created timestamp
        return (b._id || "").localeCompare(a._id || "");
      }
      if (sortBy === "oldest") {
        return (a._id || "").localeCompare(b._id || "");
      }
      if (sortBy === "title-asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "title-desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      if (sortBy === "variants-desc") {
        const aCount = Array.isArray(a.variants) ? a.variants.length : 0;
        const bCount = Array.isArray(b.variants) ? b.variants.length : 0;
        return bCount - aCount;
      }
      return 0;
    });

    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const isFiltered = Boolean(searchQuery.trim() || selectedCategory !== "all");

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  const handleProductDelete = async (productId) => {
    if (!window.confirm("Delete this product and all of its variants?")) {
      return false;
    }

    const deleted = await handleDeleteProduct(productId);
    if (!deleted) {
      setError("Failed to delete the product. Please try again.");
    }
    return deleted;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[var(--text-primary)] selection:text-[var(--btn-text)] dark:bg-[var(--bg-canvas)] dark:text-[var(--text-primary)]">
      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between border-b border-[var(--border-subtle)]/60">
        {/* Back / Navigation Action */}
        <Link
          to="/seller/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group">
          <ArrowLeft
            className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            strokeWidth={1.75}
          />
          <span className="hidden sm:inline">Back to Store</span>
          <span className="sm:hidden">Back</span>
        </Link>

        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center select-none group">
          <span className="text-xl md:text-2xl font-semibold tracking-[0.25em] text-[var(--text-primary)] uppercase pl-1 transition-opacity group-hover:opacity-90">
            VELORA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] ml-0.5 mb-2 self-end inline-block"></span>
        </Link>

        {/* Seller Status Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
            <Store className="w-3 h-3 text-[var(--accent-gold)]" strokeWidth={1.5} />
            <span className="hidden sm:inline">Seller Atelier</span>
            <span className="sm:hidden">Seller</span>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 md:py-10">
        {/* 1. Page Header */}
        <DashboardHeader totalCount={products.length} />

        {/* 2. Top Controls / Toolbar (Visible when not loading and no top error) */}
        {!loading && !error && products.length > 0 && (
          <ProductToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            availableCategories={availableCategories}
          />
        )}

        {/* Dynamic Content Views */}
        <div className="mt-4">
          {loading ? (
            /* Loading Skeleton State (6 cards) */
            <ProductSkeleton count={6} />
          ) : error ? (
            /* Error State */
            <ErrorState onRetry={fetchProducts} message={error} />
          ) : products.length === 0 ? (
            /* Empty State (No Products Created) */
            <EmptyProductState />
          ) : filteredProducts.length === 0 ? (
            /* Empty Search/Filter State */
            <EmptyProductState
              isFiltered={true}
              onResetFilters={handleResetFilters}
            />
          ) : (
            /* Product Grid */
            <ProductGrid products={filteredProducts} onDeleteProduct={handleProductDelete} />
          )}
        </div>
      </main>

      {/* Editorial Minimalist Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 mt-auto border-t border-[var(--border-subtle)]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
        <div className="flex items-center gap-2 font-normal">
          <span>&copy; {new Date().getFullYear()} VELORA ATELIER</span>
          <span className="text-[var(--border-subtle)]">•</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/seller/create-product"
            className="hover:text-[var(--text-primary)] transition-colors">
            Create Product
          </Link>
          <a
            href="#seller-guidelines"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[var(--text-primary)] transition-colors">
            Seller Policy
          </a>
          <div className="hidden sm:flex items-center gap-1.5 text-[var(--text-secondary)]/80">
            <ShieldCheck
              className="w-3.5 h-3.5 text-[var(--accent-gold)]"
              strokeWidth={1.5}
            />
            <span className="text-[10px]">Encrypted Session</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerProduct;
