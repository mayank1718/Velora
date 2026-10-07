import { useContext, useCallback } from "react";
import { BuyerContext } from "../dashboard.context";
import {
  createRating,
  deleteRating,
  editRating,
  getAllProducts,
  getProductDetails,
  getRelatedProducts,
  searchProducts,
} from "../services/buyer.api";

export const useProduct = () => {
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
    relatedProducts,
    setRelatedProducts,
    relatedLoading,
    setRelatedLoading,
    relatedError,
    setRelatedError,
    reviews,
    setReviews,
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

  const handleGetProductDetails = useCallback(
    async (productId) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductDetails(productId);
        const prod = data?.product || data;
        setProduct(prod);
        return prod;
      } catch (err) {
        console.error("failed to fetch product details", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load product details. Please try again.";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setProduct],
  );

  const handleGetRelatedProducts = useCallback(
    async (productId) => {
      setRelatedLoading(true);
      setRelatedError(null);
      try {
        const data = await getRelatedProducts(productId);
        const relatedList = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
            ? data
            : [];

        setRelatedProducts(relatedList);
        return relatedList;
      } catch (err) {
        console.error("Failed to fetch related products:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load related products. Please try again.";
        setRelatedError(errorMessage);
        setRelatedProducts([]);
        return [];
      } finally {
        setRelatedLoading(false);
      }
    },
    [setRelatedLoading, setRelatedProducts, setRelatedError],
  );

  const handleSearchProducts = useCallback(
    async (searchQuery) => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchProducts(searchQuery);
        const productList = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
            ? data
            : [];
        setAllProducts(productList);
        return productList;
      } catch (err) {
        console.error("Failed to search products:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to search products. Please try again.";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setAllProducts],
  );

  const handleRating = async (productId, review, rating) => {
    try {
      const data = await createRating(productId, review, rating);
      return data?.rate || data;
    } catch (error) {
      console.error("failed to send review", error);
      throw error;
    }
  };

  const handleEditRating = async (productId, ratingId, review, rating) => {
    try {
      const data = await editRating(productId, ratingId, review, rating);
      return data?.rate || data;
    } catch (error) {
      console.error("failed to edit review", error);
      throw error;
    }
  };

  const handleDeleteRating = async (productId, ratingId) => {
    try {
      const data = await deleteRating(productId, ratingId);
      return data?.success ?? true;
    } catch (error) {
      console.error("failed to delete rating", error);
      throw error;
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
    handleGetRelatedProducts,
    relatedProducts,
    relatedLoading,
    relatedError,
    setRelatedError,
    handleSearchProducts,
    handleDeleteRating,
    handleEditRating,
    handleRating,
    reviews,
    setReviews,
  };
};
