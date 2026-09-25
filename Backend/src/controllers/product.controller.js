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

export const getRelatedProductsController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }
    const products = await productModel
      .find({
        category: product.category,
        _id: { $ne: productId },
      })
      .limit(8);
    return res.status(200).json({
      message: "Related products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.log("failed to fetch related product", error);
    next(error);
  }
};

export const searchProductController = async (req, res, next) => {
  try {
    const search = req.query.search?.trim();

    if (!search?.trim()) {
      return res.status(400).json({
        message: "Search query is required",
        success: false,
      });
    }

    const filter = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    };
    const products = await productModel.find(filter);
    return res.status(200).json({
      message: "Products searched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.log("failed to search product", error);
    next(error);
  }
};
