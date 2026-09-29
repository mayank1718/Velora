import productModel from "../models/product.model.js";
import ratingModel from "../models/rating.model.js";

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

export const ratingController = async (req, res, next) => {
  try {
    const { review, rating } = req.body;
    const { productId } = req.params;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (product.seller.toString() === req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Seller cannot review their own product",
      });
    }
    const rate = await ratingModel.create({
      user: req.user.userId,
      product: productId,
      rating,
      review,
    });

    return res.status(201).json({
      message: "Review successfully sent",
      success: true,
      rate,
    });
  } catch (error) {
    console.log("failed to send rate,error");
    next(error);
  }
};

export const getRatingController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const ratings = await ratingModel
      .find({ product: productId })
      .populate("user", "fullname");

    return res.status(200).json({
      message: "review data fetched successfully",
      success: true,
      ratings,
    });
  } catch (error) {
    console.log("failed to fetch review data", error);
    next(error);
  }
};

export const editRatingController = async (req, res, next) => {
  try {
    const { productId, ratingId } = req.params;
    const { review, rating } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const rate = await ratingModel.findOneAndUpdate(
      {
        _id: ratingId,
        product: productId,
        user: req.user.userId,
      },
      {
        review,
        rating,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you are not authorized to edit it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      rate,
    });
  } catch (error) {
    console.log("Failed to edit review:", error);
    next(error);
  }
};

export const deleteRatingController = async (req, res, next) => {
  try {
    const { productId, ratingId } = req.params;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const rate = await ratingModel.findOneAndDelete({
      user: req.user.userId,
      product: productId,
      _id: ratingId,
    });
    if (!rate) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you are not authorized to delete it",
      });
    }
    return res.status(200).json({
      message: "review deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("failed to delete review", error);
    next(error);
  }
};
