import { Router } from "express";
import { getProductController, getProductDetailsController, getRelatedProductsController, searchProductController } from "../controllers/product.controller.js";

const productRouter = Router();

/**
  @access - public
  @desc - to fetch all product
  @api - GET /api/buyer
 */
productRouter.get("/", getProductController);

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
productRouter.get(
  "/:productId/related",
  getRelatedProductsController
);

/**
 * @access - public
 * @desc - to search products 
 * @api - GET /api/products/search
 */
productRouter.get(
  "/search",
  searchProductController
);

export default productRouter;