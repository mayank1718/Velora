import { Router } from "express";
import {
  deleteRatingController,
  editRatingController,
  getProductController,
  getProductDetailsController,
  getRatingController,
  getRelatedProductsController,
  ratingController,
  searchProductController,
} from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateRating } from "../validators/rating.validate.js";

const productRouter = Router();

/**
  @access - public
  @desc - to fetch all product
  @api - GET /api/buyer
 */
productRouter.get("/", getProductController);

/**
 * @access - public
 * @desc - to search products
 * @api - GET /api/products/search
 */
productRouter.get("/search", searchProductController);

/**
  @access - public
  @desc - to fetch product details
  @api - GET /api/buyer/:productId
 */
productRouter.get("/:productId", getProductDetailsController);

/**
 * @access - public
 * @desc - to fetch related products
 * @api - GET /api/products/:productId/related
 */
productRouter.get("/:productId/related", getRelatedProductsController);

/**
 * @access - private
 * @desc - rate product
 * @api - POST /api/products/:productId/rating
 */
productRouter.post(
  "/:productId/rating",
  authMiddleware,
  validateRating,
  ratingController,
);

/**
 * @access - private
 * @desc - fetch review data
 * @api - GET /api/products/:productId/rating
 */
productRouter.get("/:productId/rating", getRatingController);

/**
 * @access - private
 * @desc - edit review data
 * @api - PATCH /api/products/:productId/rating/:ratingId
 */
productRouter.patch(
  "/:productId/rating/:ratingId",
  authMiddleware,
  validateRating,
  editRatingController,
);

/**
 * @access - private
 * @desc - edit review data
 * @api - DELETE /api/products/:productId/rating/:ratingId
 */
productRouter.delete(
  "/:productId/rating/:ratingId",
  authMiddleware,
  deleteRatingController,
);

export default productRouter;
