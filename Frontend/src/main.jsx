import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { AuthContextProvider } from "./features/auth/Auth.Context";
import { BuyerContextProvider } from "./features/dashboard/dashboard.context";
import { SellerContextProvider } from "./features/products/Seller.context";
import { CartContextProvider } from "./features/dashboard/cart.context";
import { ThemeContextProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <ThemeContextProvider>
    <AuthContextProvider>
      <SellerContextProvider>
        <BuyerContextProvider>
          <CartContextProvider>
            <App />
          </CartContextProvider>
        </BuyerContextProvider>
      </SellerContextProvider>
    </AuthContextProvider>
  </ThemeContextProvider>,
);
