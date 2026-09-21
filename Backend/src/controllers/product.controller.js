import productModel from "../models/product.model.js";
import { uploadFiles } from "../services/storage.service.js";

export const createProductController = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "At least one image is required",
        success: false,
      });
    }

    const uploadImages = await Promise.all(
      files.map((file) =>
        uploadFiles({
          filename: file.originalname,
          buffer: file.buffer,
        }),
      ),
    );

    const images = uploadImages.map((url) => ({
      url,
    }));

    const product = await productModel.create({
      seller: req.user._id,
      title,
      description,
      category,
      images,
    });

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log("failed to create product", error);
    next(error);
  }
};

export const getSellerProductController = async (req, res, next) => {
  try {
    const products = await productModel.find({ seller: req.user._id });
    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "product data fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.log("failed to fetch data", error);
    next(error);
  }
};

export const addVariantController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const { attributes, price, stock } = req.body;
    const parsedAttributes = JSON.parse(attributes);
    const parsedPrice = JSON.parse(price);
    const files = req.files || [];
    const uploadImages = await Promise.all(
      files.map((image) =>
        uploadFiles({
          buffer: image.buffer,
          filename: image.originalname,
        }),
      ),
    );

    const images = uploadImages.map((url) => ({ url }));

    const product = await productModel.findOne({
      _id: productId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    product.variants.push({
      stock,
      images,
      price: parsedPrice,
      attributes: parsedAttributes,
    });

    await product.save();

    return res.status(201).json({
      message: "Variant added successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log("Failed to add variant:", error);
    next(error);
  }
};

export const editVariantController = async (req, res, next) => {
  try {
    const { productId, variantId } = req.params;
    const { attributes, stock, price } = req.body;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user.userId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product or variant not found",
        success: false,
      });
    }

    const variant = product.variants.id(variantId);

    const parsedAttributes = JSON.parse(attributes);
    const parsedPrice = JSON.parse(price);

    variant.attributes = parsedAttributes;
    variant.price = parsedPrice;
    variant.stock = stock;

    const files = req.files || [];

    if (files.length > 0) {
      const uploadImages = await Promise.all(
        files.map((image) =>
          uploadFiles({
            buffer: image.buffer,
            filename: image.originalname,
          }),
        ),
      );

      variant.images = uploadImages.map((url) => ({ url }));
    }

    await product.save();

    return res.status(200).json({
      message: "Product variant updated successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log("Edit variant failed:", error);
    next(error);
  }
};

export const deleteVariantController = async (req, res, next) => {
  try {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user.userId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product or variant not found",
        success: false,
      });
    }

    product.variants.pull(variantId);

    await product.save();

    return res.status(200).json({
      message: "Variant deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Failed to delete variant:", error);
    next(error);
  }
};

export const deleteProductController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findOneAndDelete({
      _id: productId,
      seller: req.user.userId,
    });
    if (!product) {
      return res.status(404).json({
        message: "product not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("failed to delete product", error);
    next(error);
  }
};
