import React, { useState, createContext } from "react";

export const BuyerContext = createContext();

export const BuyerContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState(null);
  const [error, setError] = useState(null);

  return (
    <BuyerContext.Provider
      value={{
        loading,
        setLoading,
        allProducts,
        setAllProducts,
        error,
        setError,
      }}
    >
      {children}
    </BuyerContext.Provider>
  );
};
