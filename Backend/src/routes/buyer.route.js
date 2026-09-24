import { Router } from "express";
import {
  addToCartController,
  decreaseOneController,
  increaseOneController,
  removeCartItemController,
} from "../controllers/buyer.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const BuyerRouter = Router();

/**
 * @access - private
 * @desc - to add product variant to cart
 * @api - POST /api/buyer/cart/:productId/:variantId
 */
BuyerRouter.post(
  "/cart/:productId/:variantId",
  authMiddleware,
  addToCartController
);

/**
 * @access - private
 * @desc - to increase cart item quantity
 * @api - PATCH /api/buyer/cart/:productId/:variantId/increase
 */
BuyerRouter.patch(
  "/cart/:productId/:variantId/increase",
  authMiddleware,
  increaseOneController
);

/**
 * @access - private
 * @desc - to decrease cart item quantity
 * @api - PATCH /api/buyer/cart/:productId/:variantId/decrease
 */
BuyerRouter.patch(
  "/cart/:productId/:variantId/decrease",
  authMiddleware,
  decreaseOneController
);

/**
 * @access - private
 * @desc - to remove product variant from cart
 * @api - DELETE /api/buyer/cart/:productId/:variantId
 */
BuyerRouter.delete(
  "/cart/:productId/:variantId",
  authMiddleware,
  removeCartItemController
);

export default BuyerRouter;
