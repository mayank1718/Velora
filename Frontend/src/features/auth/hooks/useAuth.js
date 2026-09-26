import { useContext } from "react";
import { AuthContext } from "../Auth.Context";
import {
  getMe,
  googleCallback,
  login,
  logout,
  register,
} from "../services/auth.service";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading, error, setError } = context;

  const handleRegister = async ({
    email,
    fullname,
    contact,
    password,
    role = "seller",
    isSeller = true,
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register({
        email,
        fullname,
        contact,
        password,
        role,
        isSeller,
      });

      if (data?.user) {
        setUser(data.user);
      }
      return true;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed. Please verify your details and try again.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Invalid email or password. Please try again.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setLoading(true);
    try {
      const data = await getMe();
      setUser(data.user);
      return data.user;
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await googleCallback();
      setUser(data.user);
      return true;
    } catch (error) {
      console.log("google auth failed", error);
      setError(error);
    }
  };

  return {
    user,
    setUser,
    loading,
    error,
    setError,
    handleGetMe,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGoogleCallback,
  };
};
