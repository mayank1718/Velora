import { useContext, useCallback } from "react";
import { BuyerContext } from "../dashboard.context";
import { getAllProducts } from "../services/buyer.api";

export const useBuyer = () => {
  const context = useContext(BuyerContext);

  const {
    loading,
    setLoading,
    allProducts,
    setAllProducts,
    error,
    setError,
  } = context;

  const handleGetAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      // Handle both { success: true, products: [...] } and direct array
      const productList = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data)
        ? data
        : [];
      setAllProducts(productList);
      return productList;
    } catch (err) {
      console.error("Failed to fetch products:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load products. Please try again.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setAllProducts]);

  return {
    loading,
    error,
    setError,
    allProducts,
    handleGetAllProducts,
  };
};
