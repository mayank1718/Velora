import { Router } from "express";
import { getProductController } from "../controllers/buyer.controller.js";

const BuyerRouter = Router();

/**
  @access - public
  @desc - to fetch all product
  @api - GET /api/products
 */
BuyerRouter.get("/", getProductController);

export default BuyerRouter;
