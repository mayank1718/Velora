import mongoose, { model, Schema } from "mongoose";
import { priceSchema } from "./price.schema.js";

const productSchema = new Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
  },
  images: [
    {
      url: { type: String, required: true },
    },
  ],
  variants: [
    {
      attributes: {
        type: Map,
        of: String,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
      },
      price: { type: priceSchema, required: true },
      images: [
        {
          url: { type: String, required: true },
        },
      ],
    },
  ],
});

const productModel = model("products", productSchema);

export default productModel;
