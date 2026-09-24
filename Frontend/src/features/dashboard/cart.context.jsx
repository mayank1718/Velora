import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);

  return (
    <CartContext.Provider value={{ loading, setLoading, cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
