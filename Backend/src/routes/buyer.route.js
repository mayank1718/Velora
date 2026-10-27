import { Router } from "express";
import {
  addToCartController,
  decreaseOneController,
  getCartController,
  getOrder,
  increaseOneController,
  paymentController,
  removeCartItemController,
  verifyPaymentController,
} from "../controllers/buyer.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const BuyerRouter = Router();

/**
 * @access - private
 * @desc - to fetch user's cart
 * @api - GET /api/buyer/cart
 */
BuyerRouter.get("/cart", authMiddleware, getCartController);

/**
 * @access - private
 * @desc - to add product variant to cart
 * @api - POST /api/buyer/cart/:productId/:variantId
 */
BuyerRouter.post(
  "/cart/:productId/:variantId",
  authMiddleware,
  addToCartController,
);

/**
 * @access - private
 * @desc - to increase cart item quantity
 * @api - PATCH /api/buyer/cart/:productId/:variantId/increase
 */
BuyerRouter.patch(
  "/cart/:productId/:variantId/increase",
  authMiddleware,
  increaseOneController,
);

/**
 * @access - private
 * @desc - to decrease cart item quantity
 * @api - PATCH /api/buyer/cart/:productId/:variantId/decrease
 */
BuyerRouter.patch(
  "/cart/:productId/:variantId/decrease",
  authMiddleware,
  decreaseOneController,
);

/**
 * @access - private
 * @desc - to remove product variant from cart
 * @api - DELETE /api/buyer/cart/:productId/:variantId
 */
BuyerRouter.delete(
  "/cart/:productId/:variantId",
  authMiddleware,
  removeCartItemController,
);


/**
 * @access - private
 * @desc - to create payment order
 * @api - POST /api/buyer/ppayment/create/order
 */
BuyerRouter.post("/payment/create/order", authMiddleware, paymentController);


/**
 * @access - private
 * @desc - to verify user payment
 * @api - POST /api/buyer/payment/varify/order
 */
BuyerRouter.post(
  "/payment/verify/order",
  authMiddleware,
  verifyPaymentController,
);

/**
 * @access - private
 * @desc - to get order details
 * @api - GET /api/buyer/order/:orderId
 */
BuyerRouter.get("/order/:orderId",authMiddleware,getOrder)


export default BuyerRouter;
