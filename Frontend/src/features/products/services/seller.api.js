import axios from "axios";

const sellerApiInstance = axios.create({
  baseURL: "https://velora-nmrh.onrender.com/api/seller",
  withCredentials: true,
});

export const createProduct = async (formData) => {
  const response = await sellerApiInstance.post("/create", formData);
  return response.data;
};

export const getSellerProduct = async () => {
  const response = await sellerApiInstance.get("/product");
  return response.data;
};

export const addVariant = async (productId, formData) => {
  const response = await sellerApiInstance.post(
    `/add/${productId}/variant`,
    formData,
  );
  return response.data;
};

export const editVariant = async (formData, productId, variantId) => {
  const response = await sellerApiInstance.patch(
    `/${productId}/variants/${variantId}`,
    formData,
  );
  return response.data;
};

export const deleteVariant = async (productId, variantId) => {
  const response = await sellerApiInstance.delete(
    `/${productId}/variants/${variantId}`,
  );
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await sellerApiInstance.delete(`/${productId}`);
  return response.data;
};
