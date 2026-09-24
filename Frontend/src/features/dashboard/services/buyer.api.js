import axios from "axios";

const buyerApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/products",
  withCredentials: true,
});

export const getAllProducts = async () => {
  const response = await buyerApiInstance.get("/");
  return response.data;
};
