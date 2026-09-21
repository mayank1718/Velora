import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

export const sellerMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "token not found",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    if (user.role !== "seller") {
      return res.status(403).json({
        message: "only seller can access this route",
        success: false,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("seller middleware failed", error);

    return res.status(401).json({
      message: "invalid or expired token",
      success: false,
    });
  }
};