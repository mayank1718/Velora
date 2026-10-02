import Razorpay from "razorpay";
import { config } from "../config/config.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_SECRET_ID,
  key_secret: config.RAZORPAY_SECRET_KEY,
});

export const createOrder = async ({ amount, currency = "INR" }) => {
  const options = {
    amount: amount * 100,
    currency,
  };
  const order = razorpay.orders.create(options);
  return order;
};
