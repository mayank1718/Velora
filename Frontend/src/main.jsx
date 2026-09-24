import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { AuthContextProvider } from "./features/auth/Auth.Context";
import { BuyerContextProvider } from "./features/dashboard/dashboard.context";
import { SellerContextProvider } from "./features/products/Seller.context";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <SellerContextProvider>
      <BuyerContextProvider>
        <App />
      </BuyerContextProvider>
    </SellerContextProvider>
  </AuthContextProvider>,
);
