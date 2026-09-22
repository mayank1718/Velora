import { useContext } from "react";
import { ProductContext } from "../Product.context";
import {
  addVariant,
  createProduct,
  deleteProduct,
  deleteVariant,
  editVariant,
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
    console.log(formData);
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
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add variant",
      };
    }
  };

  const handleEditVariant = async (formData, productId, variantId) => {
    try {
      const data = await editVariant(formData, productId, variantId);
      setSellerProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? data.product : product,
        ),
      );
      return data.product;
    } catch (error) {
      console.log("failed to edit variant", error);
    }
  };

  const handleDeleteVariant = async (productId, variantId) => {
    try {
      const data = await deleteVariant(productId, variantId);

      setSellerProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? data.product : product,
        ),
      );

      return true;
    } catch (error) {
      console.log("Failed to delete variant:", error);
      return false;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setSellerProducts((prev) =>
        prev.filter((product) => product._id !== productId),
      );
      return true;
    } catch (error) {
      console.log("failed to delete product", error);
    }
  };

  return {
    handleAddVariant,
    handleDeleteProduct,
    handleDeleteVariant,
    loading,
    handleEditVariant,
    variants,
    sellerProducts,
    handleCreateProduct,
    handelGetSellerProduct,
  };
};
