import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import BuyerRouter from "./routes/buyer.route.js";
import sellerRouter from "./routes/seller.route.js";
import productRouter from "./routes/product.route.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";
import helmet from "helmet";
import path from "path";

const app = express();

const frontendPath = path.resolve(process.cwd(), "public", "dist");

app.use(express.static(frontendPath));

app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

/* routes */
app.use("/api/auth", authRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/buyer", BuyerRouter);
app.use("/api/products", productRouter);
// Register your API routes before this fallback.
app.get("/{*path}", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});
/* Error Middleware */
app.use(errorMiddleware);

export default app;
