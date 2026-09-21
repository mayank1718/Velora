import { useState } from "react";
import { createContext } from "react";

export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  return (
    <ProductContext.Provider
      value={{
        loading,
        setLoading,
        setSellerProducts,
        sellerProducts,
        variants,
        setVariants,
      }}>
      {children}
    </ProductContext.Provider>
  );
};
