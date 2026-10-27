import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";
import { createOrder } from "../services/payment.service.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

const getCartDetails = async (userId) => {
  const cart = (
    await cartModel.aggregate([
      // 1. Find user's cart
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

      // 2. Convert items array into individual documents
      {
        $unwind: {
          path: "$items",
        },
      },

      // 3. Get product details
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "items.product",
        },
      },

      // 4. Convert product array into object
      {
        $unwind: {
          path: "$items.product",
        },
      },

      // 5. Convert variants array into individual documents
      {
        $unwind: {
          path: "$items.product.variants",
        },
      },

      // 6. Keep only selected variant
      {
        $match: {
          $expr: {
            $eq: ["$items.product.variants._id", "$items.variant"],
          },
        },
      },

      // 7. Calculate item total
      {
        $addFields: {
          itemPrice: {
            price: {
              $multiply: [
                "$items.product.variants.price.amount",
                "$items.quantity",
              ],
            },
            currency: "$items.product.variants.price.currency",
          },
        },
      },

      // 8. Put items back together
      {
        $group: {
          _id: "$_id",

          totalPrice: {
            $sum: "$itemPrice.price",
          },

          currency: {
            $first: "$itemPrice.currency",
          },

          items: {
            $push: "$items",
          },
        },
      },
    ])
  )[0];
  return cart;
};

export const getCartController = async (req, res, next) => {
  try {
    let cart = await getCartDetails(req.user.userId);
    if (!cart) {
      cart = await cartModel.create({ user: req.user.userId, items: [] });
    }
    return res.status(200).json({
      message: "cart item fetched successfully",
      success: true,
      cart,
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

export const paymentController = async (req, res, next) => {
  try {
    const cart = await getCartDetails(req.user.userId);
    if (!cart) {
      return res.status(400).json({
        message: "Cart is empty",
        success: false,
      });
    }
    const order = await createOrder({
      amount: cart.totalPrice,
      currency: cart.currency,
    });

    const payment = await paymentModel.create({
      user: req.user.userId,
      razorpay: {
        orderId: order.id,
      },
      price: {
        amount: cart.totalPrice,
        currency: cart.currency,
      },
      orderItems: cart.items.map((item) => ({
        title: item.product.title,
        productId: item.product._id,
        variantId: item.variant,
        quantity: item.quantity,
        images: item.product.variants.images || item.product.images,
        description: item.product.description,
        price: {
          amount:
            item.product.variants.price.amount || item.product.price.amount,
          currency:
            item.product.variants.price.currency || item.product.price.currency,
        },
      })),
    });

    return res.status(200).json({
      message: "Order created successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.log("payment failed", error);
    next(error);
  }
};

export const verifyPaymentController = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const payment = await paymentModel.findOne({
    "razorpay.orderId": razorpay_order_id,
    status: "pending",
  });

  if (!payment) {
    return res.status(400).json({
      message: "Payment not found",
      success: false,
    });
  }

  const isPaymentValid = validatePaymentVerification(
    {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    config.RAZORPAY_SECRET_KEY,
  );

  if (!isPaymentValid) {
    payment.status = "failed";
    await payment.save();

    return res.status(400).json({
      message: "Payment verification failed",
      success: false,
    });
  }

  payment.status = "paid";

  payment.razorpay.paymentId = razorpay_payment_id;
  payment.razorpay.signature = razorpay_signature;

  await payment.save();

  await cartModel.findOneAndDelete({ user: req.user.userId });

  return res.status(200).json({
    message: "Payment verified successfully",
    success: true,
  });
};

export const getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel
      .findOne({
        _id: orderId,
        user: req.user.userId,
      })
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
