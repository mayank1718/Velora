import { useContext } from "react";
import { ProductContext } from "../Product.context";
import {
  addVariant,
  createProduct,
  getSellerProduct,
} from "../services/product.api";

export const useProduct = () => {
  const context = useContext(ProductContext);
  const {
    loading,
    setLoading,
    setSellerProducts,
    variants,
    setVariants,
    sellerProducts,
  } = context;

  const handleCreateProduct = async (formData) => {
    setLoading(true);
    try {
      const data = await createProduct(formData);
      setSellerProducts((prev) => [...prev, data.product]);
      return {
        success: true,
        product: data.product,
      };
    } catch (error) {
      console.log("failed to create product", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handelGetSellerProduct = async () => {
    setLoading(true);
    try {
      const data = await getSellerProduct();
      const productList = data?.products || [];
      setSellerProducts(productList);
      return productList;
    } catch (error) {
      console.log("failed to fetch seller product ", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = async (productId, formData) => {
    console.log(formData)
    try {
      const data = await addVariant(productId, formData);
      const newVariant = data?.variant || data;
      if (newVariant) {
        setVariants((prev) => [...prev, newVariant]);
      }
      return { success: true, variant: newVariant };
    } catch (error) {
      console.log("Failed to add variant:", error);
      return {
        success: false,
        error: error?.response?.data?.message || error?.message || "Failed to add variant",
      };
    }
  };

  return {
    handleAddVariant,
    loading,
    variants,
    sellerProducts,
    handleCreateProduct,
    handelGetSellerProduct,
  };
};
