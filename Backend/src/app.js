import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import BuyerRouter from "./routes/buyer.route.js";
import sellerRouter from "./routes/seller.route.js";
import productRouter from "./routes/product.route.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
/* routes */
app.use("/api/auth", authRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/buyer", BuyerRouter);
app.use("/api/products", productRouter);

/* Error Middleware */
app.use(errorMiddleware);

export default app;
