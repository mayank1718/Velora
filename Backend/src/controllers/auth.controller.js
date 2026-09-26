import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import redis from "../database/cache.js";

const sendToken = (user, res) => {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    config.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token);
};

export const registerController = async (req, res, next) => {
  try {
    console.log(req.body);
    const { fullname, email, contact, password, isSeller } = req.body;
    const isUser = await userModel.findOne({ $or: [{ email }, { contact }] });
    if (isUser) {
      return res.status(409).json({
        message: "user already registered",
        success: false,
      });
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      fullname,
      email,
      contact,
      password: hash,
      role: isSeller ? "seller" : "buyer",
    });
    sendToken(user, res);
    return res.status(201).json({
      message: "user registration successfully",
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        contact: user.contact,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("registration failed", error);
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "invalid credentials",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "invalid credentials",
        success: false,
      });
    }
    sendToken(user, res);
    return res.status(200).json({
      message: "user logged in successfully",
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        contact: user.contact,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("user logged in failed");
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        sucess: false,
      });
    }
    return res.status(200).json({
      message: "user data fetched sucessfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("failed to fetch user data", error);
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    await redis.set(token, Date.now().toString(), "EX", 60 * 60 * 24);
    res.clearCookie("token");
    return res.status(200).json({
      message: "user log out successfully",
      success: true,
    });
  } catch (error) {
    console.log("failed to log out user", error);
    next(error);
  }
};

export const googleCallback = async (req, res, next) => {
  try {
    const { displayName, id, emails } = req.user;

    const email = emails?.[0]?.value;

    if (!email) {
      return res.status(400).json({
        message: "Google account email not found",
      });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        googleId: id,
        fullname: displayName,
        role: "buyer",
      });
    } else if (!user.googleId) {
      user.googleId = id;
      await user.save();
    }

    sendToken(user._id, res);

    res.redirect("http://localhost:5173/");
  } catch (error) {
    console.log("Google login failed:", error);
    next(error);
  }
};