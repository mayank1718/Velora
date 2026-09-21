import mongoose from "mongoose";
import { config } from "../config/config.js";

export const connectToDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("database connected");
  } catch (error) {
    console.log("failed to connect database", error);
  }
};
