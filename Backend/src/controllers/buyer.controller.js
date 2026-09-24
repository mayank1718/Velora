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

export const getProductDetailsController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "product not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "product details fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log("failed to fetch product details", error);
    next(error);
  }
};

