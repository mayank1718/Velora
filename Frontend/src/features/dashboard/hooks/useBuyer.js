import { useContext, useCallback } from "react";
import { BuyerContext } from "../dashboard.context";
import { getAllProducts, getProductDetails } from "../services/buyer.api";

export const useBuyer = () => {
  const context = useContext(BuyerContext);

  const {
    loading,
    setLoading,
    allProducts,
    setAllProducts,
    error,
    setError,
    product,
    setProduct,
  } = context;

  const handleGetAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
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

  const handleGetProductDetails = async (productId) => {
    setLoading(true);
    try {
      const data = await getProductDetails(productId);
      setProduct(data.product);
      return data.product;
    } catch (error) {
      console.log("failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    allProducts,
    handleGetProductDetails,
    handleGetAllProducts,
    product,
  };
};
