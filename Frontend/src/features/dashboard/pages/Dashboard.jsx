import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import BuyerNavbar from "../components/BuyerNavbar";
import DashboardHeader from "../components/DashboardHeader";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import ProductSkeleton from "../components/ProductSkeleton";
import EmptyProductState from "../components/EmptyProductState";
import ErrorState from "../components/ErrorState";

import { useProduct } from "../hooks/useProduct";
import Footer from "../components/Footer";

const Dashboard = () => {
  const {
    loading,
    error,
    allProducts,
    handleGetAllProducts,
    handleSearchProducts,
  } = useProduct();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Initial products + live backend search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        handleSearchProducts(search.trim());
      } else {
        handleGetAllProducts();
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, handleSearchProducts, handleGetAllProducts]);

  // Safe products array
  const products = useMemo(() => {
    return Array.isArray(allProducts) ? allProducts : [];
  }, [allProducts]);

  // Extract available categories
  const availableCategories = useMemo(() => {
    const categorySet = new Set();

    products.forEach((product) => {
      if (
        product.category &&
        typeof product.category === "string" &&
        product.category.trim()
      ) {
        categorySet.add(product.category.trim());
      }
    });

    return Array.from(categorySet);
  }, [products]);

  // Frontend category filtering
  const filteredProducts = useMemo(() => {
    if (selectedCategory.toLowerCase() === "all") {
      return products;
    }

    return products.filter(
      (product) =>
        product.category?.trim().toLowerCase() ===
        selectedCategory.trim().toLowerCase(),
    );
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#171717] flex flex-col justify-between">
      <BuyerNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <DashboardHeader />

        <SearchBar
          searchQuery={search}
          onSearchChange={setSearch}
          loading={loading}
        />

        <CategoryFilter
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="mt-2 min-h-[360px]">
          {loading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={() =>
                search.trim()
                  ? handleSearchProducts(search.trim())
                  : handleGetAllProducts()
              }
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyProductState
              isFiltered={search.trim() !== "" || selectedCategory !== "All"}
              onResetFilters={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            />
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
