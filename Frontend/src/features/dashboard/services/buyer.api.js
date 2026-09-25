import axios from "axios";

const productApiInstanse = axios.create({
  baseURL: "http://localhost:3000/api/products",
  withCredentials: true,
});

const buyerApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/buyer",
  withCredentials: true,
});

// products api
export const getAllProducts = async () => {
  const response = await productApiInstanse.get("/");
  return response.data;
};

export const getProductDetails = async (productId) => {
  const response = await productApiInstanse.get(`/${productId}`);
  return response.data;
};

export const getRelatedProducts = async (productId) => {
  const response = await productApiInstanse.get(`/${productId}/related`);
  return response.data;
};

export const searchProducts = async (searchQuery) => {
  const response = await productApiInstanse.get(
    `/search?search=${searchQuery}`,
  );
  return response.data;
};

//buyer api
export const getCart = async () => {
  const response = await buyerApiInstance.get("/cart");
  return response.data;
};

export const addToCart = async (productId, variantId, quantity = 1) => {
  const response = await buyerApiInstance.post(
    `/cart/${productId}/${variantId}`,
    { quantity },
  );
  return response.data;
};

export const increaseOneFromCart = async (productId, variantId) => {
  const response = await buyerApiInstance.patch(
    `/cart/${productId}/${variantId}/increase`,
  );
  return response.data;
};

export const decreaseOneFromCart = async (productId, variantId) => {
  const response = await buyerApiInstance.patch(
    `/cart/${productId}/${variantId}/decrease`,
  );
  return response.data;
};

export const removeFromCart = async (productId, variantId) => {
  const response = await buyerApiInstance.delete(
    `/cart/${productId}/${variantId}`,
  );
  return response.data;
};
