import productModel from "../models/product.model.js";

export const getProductController = async (req, res, next) => {
  try {
    const products = await productModel.find();

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.log("Failed to fetch product data:", error);
    next(error);
  }
};