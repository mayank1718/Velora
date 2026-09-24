import { Router } from "express";
import {
  getProductController,
  getProductDetailsController,
} from "../controllers/buyer.controller.js";

const BuyerRouter = Router();

/**
  @access - public
  @desc - to fetch all product
  @api - GET /api/products
 */
BuyerRouter.get("/", getProductController);

/**
  @access - public
  @desc - to fetch product details
  @api - GET /api/products/:productId
 */
BuyerRouter.get("/:productId", getProductDetailsController);

export default BuyerRouter;
