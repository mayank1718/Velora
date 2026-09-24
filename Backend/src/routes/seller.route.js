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
} from "../controllers/seller.controller.js";
import { addVariantValidator } from "../validators/variant.validator.js";
import { editVariantValidator } from "../validators/editVariant.validate.js";

const sellerRouter = Router();

/*
 @access = private
 @desc = to create product
 @api = POST /api/seller/create
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
 @api = GET /api/seller
 */
productRouter.get("/product", sellerMiddleware, getSellerProductController);

/* 
 @access = private
 @desc = add variant
 @api = POST /api/seller/add/:productId/variant 
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
 @api = PATCH /seller/:productId/variants/:variantId
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
 @api = DELETE /seller/:productId/variants/:variantId
*/
productRouter.delete(
  "/:productId/variants/:variantId",
  sellerMiddleware,
  deleteVariantController,
);

/*
 @access = private
 @desc =delete product
 @api = DELETE /seller/:productId/
*/
productRouter.delete(
  "/:productId",
  sellerMiddleware,
  deleteProductController,
);

export default sellerRouter;
