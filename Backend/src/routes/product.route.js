import { Router } from "express";
import { sellerMiddleware } from "../middlewares/seller.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { createProductValidator } from "../validators/product.validate.js";
import {
  addVariantController,
  createProductController,
  deleteProductController,
  deleteVariantController,
  editVariantController,
  getSellerProductController,
} from "../controllers/product.controller.js";
import { addVariantValidator } from "../validators/variant.validator.js";
import { editVariantValidator } from "../validators/editVariant.validate.js";

const productRouter = Router();

/*
 @access = private
 @desc = to create product
 @api = POST /api/products/create
 */
productRouter.post(
  "/create",
  sellerMiddleware,
  upload.array("images", 6),
  createProductValidator,
  createProductController,
);

/*
 @access = private
 @desc = to get seller product
 @api = GET /api/products/seller
 */
productRouter.get("/seller", sellerMiddleware, getSellerProductController);

/* 
 @access = private
 @desc = add variant
 @api = POST /api/products/add/:productId/variant 
*/
productRouter.post(
  "/add/:productId/variant",
  sellerMiddleware,
  upload.array("images", 6),
  addVariantValidator,
  addVariantController,
);

/*
 @access = private
 @desc = edit variant
 @api = PATCH /products/:productId/variants/:variantId
*/
productRouter.patch(
  "/:productId/variants/:variantId",
  sellerMiddleware,
  upload.array("images", 6),
  editVariantValidator,
  editVariantController,
);

/*
 @access = private
 @desc = delete variant
 @api = DELETE /products/:productId/variants/:variantId
*/
productRouter.patch(
  "/:productId/variants/:variantId",
  sellerMiddleware,
  deleteVariantController,
);

/*
 @access = private
 @desc =delete product
 @api = DELETE /products/:productId/
*/
productRouter.patch(
  "/:productId/variants/:variantId",
  sellerMiddleware,
  deleteProductController,
);

export default productRouter;
