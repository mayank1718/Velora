import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/products",
  withCredentials: true,
});

export const createProduct = async (formData) => {
  const response = await productApiInstance.post("/create", formData);
  return response.data;
};

export const getSellerProduct = async () => {
  const response = await productApiInstance.get("/seller");
  return response.data;
};

export const addVariant = async (productId, formData) => {
  const response = await productApiInstance.post(
    `/add/${productId}/variant`,
    formData,
  );
  return response.data;
};

export const editVariant = async (formData, productId, variantId) => {
  const response = await productApiInstance.patch(
    `/${productId}/variants/${variantId}`,
  );
  return response.data;
};

export const deleteVariant = async (productId, variantId) => {
  const response = await productApiInstance.delete(
    `/${productId}/variants/${variantId}`,
  );
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await productApiInstance.delete(`/${productId}`);
  return response.data;
};
