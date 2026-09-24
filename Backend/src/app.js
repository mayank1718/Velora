import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.route.js";
import cookieParser from "cookie-parser";
import BuyerRouter from "./routes/buyer.route.js";
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
app.use("/api/products", productRouter);
app.use("/api/products", BuyerRouter);

/* Error Middleware */
app.use(errorMiddleware);

export default app;
