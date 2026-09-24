import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Protected from "../features/auth/components/Protected";
import CreateProduct from "../features/products/pages/CreateProduct";
import SellerProduct from "../features/products/pages/SellerProduct";
import AddVariant from "../features/products/pages/AddVariant";
import Dashboard from "../features/dashboard/pages/Dashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/create-product",
        element: (
          <Protected role="seller">
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "/seller/products",
        element: (
          <Protected role="seller">
            <SellerProduct />
          </Protected>
        ),
      },
      {
        path: "/seller/products/:productId/variants",
        element: (
          <Protected role="seller">
            <AddVariant />
          </Protected>
        ),
      },
      {
        path: "/seller/:productId/variants",
        element: (
          <Protected role="seller">
            <AddVariant />
          </Protected>
        ),
      },
      {
        path: "/seller/products/:productId",
        element: (
          <Protected role="seller">
            <SellerProduct />
          </Protected>
        ),
      },
    ],
  },
]);
