import { Router } from "express";
import { registerValidation } from "../validators/register.validate.js";
import {
  getMeController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller.js";
import { loginValidation } from "../validators/login.validate.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

/*
 @access - public
 @desc - register user
 @API- POST /api/auth/register
*/
authRouter.post("/register", registerValidation, registerController);

/*
 @access - public
 @desc - login user
 @API- POST /api/auth/login
*/
authRouter.post("/login", loginValidation, loginController);

/*
 @access - private
 @desc - fetch user data
 @API- GET /api/auth/get-me
*/
authRouter.get("/get-me", authMiddleware, getMeController);

/*
 @access - private
 @desc - logout user
 @API- POST /api/auth/logout
*/
authRouter.post("/logout", authMiddleware, logoutController);

export default authRouter;
