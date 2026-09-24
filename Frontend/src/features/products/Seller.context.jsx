import { useState } from "react";
import { createContext } from "react";

export const SellerContext = createContext();

export const SellerContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  return (
    <SellerContext.Provider
      value={{
        loading,
        setLoading,
        setSellerProducts,
        sellerProducts,
        variants,
        setVariants,
      }}>
      {children}
    </SellerContext.Provider>
  );
};
