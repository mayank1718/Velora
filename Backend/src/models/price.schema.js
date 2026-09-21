import { Schema } from "mongoose";

export const priceSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ["INR", "JPY", "USD"],
    default: "INR",
  },
});
