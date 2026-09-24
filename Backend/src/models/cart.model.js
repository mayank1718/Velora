import mongoose, { model, Schema } from "mongoose";
import { priceSchema } from "./price.schema.js";

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },

        variant: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: priceSchema,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const cartModel = model("carts", cartSchema);

export default cartModel;
