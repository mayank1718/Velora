import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { AuthContextProvider } from "./features/auth/Auth.Context";
import { ProductContextProvider } from "./features/products/Product.context";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ProductContextProvider>
      <App />
    </ProductContextProvider>
  </AuthContextProvider>,
);
