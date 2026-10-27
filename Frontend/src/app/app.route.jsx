import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Profile from "../features/auth/pages/Profile";
import Protected from "../features/auth/components/Protected";
import CreateProduct from "../features/products/pages/CreateProduct";
import SellerProduct from "../features/products/pages/SellerProduct";
import AddVariant from "../features/products/pages/AddVariant";
import Dashboard from "../features/dashboard/pages/Dashboard";
import ProductDetails from "../features/dashboard/pages/ProductDetails";
import Cart from "../features/dashboard/pages/Cart";
import OrderSuccess from "../features/dashboard/pages/OrderSuccess";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected role="buyer" authRequired={false}>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/cart",
    element: (
      <Protected role="buyer" authRequired={false}>
        <Cart />
      </Protected>
    ),
  },
  {
    path: "/order-success",
    element: (
      <Protected role="buyer" authRequired={true}>
        <OrderSuccess />
      </Protected>
    ),
  },
  {
    path: "/products/:productId",
    element: (
      <Protected role="buyer" authRequired={false}>
        <ProductDetails />
      </Protected>
    ),
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
    path: "/profile",
    element: (
      <Protected>
        <Profile />
      </Protected>
    ),
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
