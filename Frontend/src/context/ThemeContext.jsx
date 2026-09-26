import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

/**
 * Resolves the initial theme from localStorage or system preference.
 * Called once at module level so the value is ready synchronously.
 */
function resolveInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch {
    /* localStorage not available */
  }
  return "light";
}

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(resolveInitialTheme);

  // Apply the theme class to <html> and persist on every change
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
