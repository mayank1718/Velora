import { Router } from "express";
import { getProductController, getProductDetailsController, getRelatedProductsController } from "../controllers/product.controller.js";

const productRouter = Router();

/**
  @access - public
  @desc - to fetch all product
  @api - GET /api/buyer
 */
BuyerRouter.get("/", getProductController);

/**
  @access - public
  @desc - to fetch product details
  @api - GET /api/buyer/:productId
 */
BuyerRouter.get("/:productId", getProductDetailsController);

/**
 * @access - public
 * @desc - to fetch related products
 * @api - GET /api/products/:productId/related
 */
BuyerRouter.get(
  "/:productId/related",
  getRelatedProductsController
);

export default productRouter;