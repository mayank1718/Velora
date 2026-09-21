import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import redis from "../database/cache.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      message: "authentication required",
      success: false,
    });
  }

  const isTokenBlackListed = await redis.get(token);

  if (isTokenBlackListed) {
    return res.status(401).json({
      message: "authentication required",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "invalid or expired token",
      success: false,
    });
  }
};

export default authMiddleware;
