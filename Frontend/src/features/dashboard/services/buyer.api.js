import axios from "axios";

const productApiInstanse = axios.create({
  baseURL: "https://velora-nmrh.onrender.com/api/products",
  withCredentials: true,
});

const buyerApiInstance = axios.create({
  baseURL: "https://velora-nmrh.onrender.com/api/buyer",
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

export const createRating = async (productId, review, rating) => {
  const response = await productApiInstanse.post(`/${productId}/rating`, {
    review,
    rating,
  });
  return response.data;
};

export const getRating = async (productId) => {
  const response = await productApiInstanse.get(`/${productId}/rating`);
  return response.data;
};

export const editRating = async (productId, ratingId, review, rating) => {
  const response = await productApiInstanse.patch(
    `/${productId}/rating/${ratingId}`,
    {
      review,
      rating,
    },
  );
  return response.data;
};

export const deleteRating = async (productId, ratingId) => {
  const response = await productApiInstanse.delete(
    `/${productId}/rating/${ratingId}`,
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

export const createOrder = async () => {
  const response = await buyerApiInstance.post("/payment/create/order");
  return response.data;
};

export const verifyOrder = async (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
) => {
  const response = await buyerApiInstance.post("/payment/verify/order", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await buyerApiInstance.get(`/order/${orderId}`);
  return response.data;
};
