import axios from "axios";

const authInstanceApi = axios.create({
  baseURL: "https://velora-nmrh.onrender.com/api/auth",
  withCredentials: true,
});

export const googleAuthUrl = `${authInstanceApi.defaults.baseURL}/google`;

export const register = async (userData) => {
  const { fullname, email, contact, password, role, isSeller } = userData;
  const response = await authInstanceApi.post("/register", {
    fullname,
    email,
    contact,
    password,
    role,
    isSeller,
  });
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await authInstanceApi.post("/login", {
    email,
    password,
  });
  return response.data;
};

export const getMe = async () => {
  const response = await authInstanceApi.get("/get-me");
  return response.data;
};

export const logout = async () => {
  const response = await authInstanceApi.post("/logout");
  return response.data;
};
