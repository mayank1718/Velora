import { useContext } from "react";
import { CartContext } from "../cart.context";
import {
  addToCart,
  createOrder,
  decreaseOneFromCart,
  getCart,
  increaseOneFromCart,
  removeFromCart,
  verifyOrder,
} from "../services/buyer.api";

export const useCart = () => {
  const Context = useContext(CartContext);
  const { loading, setLoading, cart, setCart } = Context;

  const handleAddItemToCart = async (productId, variantId, quantity = 1) => {
    setLoading(true);
    try {
      const data = await addToCart(productId, variantId, quantity);

      const cartData = Array.isArray(data?.cart) ? data.cart : [];

      await handleGetCart();

      return cartData;
    } catch (error) {
      console.log("Failed to add item in cart:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseItem = async (productId, variantId) => {
    setLoading(true);

    try {
      const data = await increaseOneFromCart(productId, variantId);

      const cartData = Array.isArray(data?.cart) ? data.cart : [];

      await handleGetCart();

      return cartData;
    } catch (error) {
      console.log("Failed to increase item:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleDecreaseItem = async (productId, variantId) => {
    setLoading(true);

    try {
      const data = await decreaseOneFromCart(productId, variantId);

      const cartData = Array.isArray(data?.cart) ? data.cart : [];

      await handleGetCart();

      return cartData;
    } catch (error) {
      console.log("Failed to increase item:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId, variantId) => {
    setLoading(true);
    try {
      const data = await removeFromCart(productId, variantId);

      const cartData = Array.isArray(data?.cart) ? data.cart : [];

      await handleGetCart();

      return cartData;
    } catch (error) {
      console.log("failed to remove item from cart", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGetCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();

      const item = data.cart;

      setCart(item);

      return item;
    } catch (error) {
      console.log("failed to fetch cart item", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const result = await createOrder();
      return result.order;
    } catch (error) {
      console.log("failed to create order", error);
    }
  };

  const handleVerifyOrder = async (
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  ) => {
    try {
      const result = await verifyOrder(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      );
      return result;
    } catch (error) {
      console.log("failed to verify payment", error);
      return { success: false, error };
    }
  };

  return {
    loading,
    cart,
    handleAddItemToCart,
    handleIncreaseItem,
    handleDecreaseItem,
    handleRemoveItem,
    handleGetCart,
    handleCreateOrder,
    handleVerifyOrder,
  };
};
