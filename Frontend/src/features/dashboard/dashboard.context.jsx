import React, { useState, createContext } from "react";

export const BuyerContext = createContext();

export const BuyerContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState(null);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState(null);
  const [reviews, setReviews] = useState([]);
  return (
    <BuyerContext.Provider
      value={{
        loading,
        setLoading,
        allProducts,
        setAllProducts,
        error,
        setError,
        reviews,
        setReviews,
        product,
        setProduct,
        relatedProducts,
        setRelatedProducts,
        relatedLoading,
        setRelatedLoading,
        relatedError,
        setRelatedError,
      }}>
      {children}
    </BuyerContext.Provider>
  );
};
