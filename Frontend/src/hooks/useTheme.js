import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Hook to access the global theme state and toggle function.
 * Mirrors the pattern of useAuth.js, useProduct.js, etc.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
};
