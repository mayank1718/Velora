import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";

export const getCartController = async (req, res, next) => {
  try {
    const cartItem = await cartModel
      .find({ user: req.user.userId })
      .populate("items.product");
    if (!cartItem) {
      return res.status(404).json({
        message: "item not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "cart item fetched successfully",
      success: true,
      cart: cartItem,
    });
  } catch (error) {
    console.log("failed to fetch cart item", error);
    next(error);
  }
};

export const addToCartController = async (req, res, next) => {
  try {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const variant = product.variants.find(
      (v) => v._id.toString() === variantId,
    );

    if (!variant) {
      return res.status(404).json({
        message: "Product variant not found",
        success: false,
      });
    }

    const { quantity = 1 } = req.body;

    let cart = await cartModel.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      cart = await cartModel.create({
        user: req.user.userId,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId,
    );

    if (existingItemIndex !== -1) {
      const existingItem = cart.items[existingItemIndex];

      if (existingItem.quantity >= variant.stock) {
        return res.status(400).json({
          message: "Maximum available stock reached",
          success: false,
        });
      }

      existingItem.quantity += 1;

      // Keep unit price
      existingItem.price = variant.price;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: variant.price,
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Failed to add in cart", error);
    next(error);
  }
};

export const increaseOneController = async (req, res, next) => {
  try {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const variant = product.variants.find(
      (v) => v._id.toString() === variantId,
    );

    if (!variant) {
      return res.status(404).json({
        message: "Product variant not found",
        success: false,
      });
    }

    const cart = await cartModel.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId,
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({
        message: "Cart item not found",
        success: false,
      });
    }

    const item = cart.items[existingItemIndex];

    if (item.quantity + 1 > variant.stock) {
      return res.status(400).json({
        message: `Only ${variant.stock} items are available`,
        success: false,
      });
    }

    item.quantity += 1;

    await cart.save();

    return res.status(200).json({
      message: "Cart item increased successfully",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Failed to increase cart item:", error);
    next(error);
  }
};

export const decreaseOneController = async (req, res, next) => {
  try {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const cart = await cartModel.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId,
    );

    if (existingItemIndex == -1) {
      return res.status(404).json({
        message: "item not found in cart",
        success: false,
      });
    }
    if (cart.items[existingItemIndex].quantity <= 1) {
      return res.status(400).json({
        message: "Minimum quantity is 1",
        success: false,
      });
    }
    cart.items[existingItemIndex].quantity -= 1;
    await cart.save();

    return res.status(200).json({
      message: "cart item decreased successfully",
      success: true,
    });
  } catch (error) {
    console.log("failed to decrease item", error);
    next(error);
  }
};

export const removeCartItemController = async (req, res, next) => {
  try {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const cart = await cartModel.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found in cart",
        success: false,
      });
    }

    cart.items.pull(item._id);

    await cart.save();

    return res.status(200).json({
      message: "Cart item removed successfully",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("failed to remove item from cart", error);
    next(error);
  }
};
