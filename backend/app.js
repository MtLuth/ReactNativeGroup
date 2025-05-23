import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./controller/errorController.js";
import { authRouter } from "./routes/authRoute.js";
import dotenv from "dotenv";
import { categoryRouter } from "./routes/categoryRoute.js";
import { productRouter } from "./routes/productRoute.js";
import { userRouter } from "./routes/userRoute.js";
import { mediaRouter } from "./routes/mediaRouter.js";
import { cartRouter } from "./routes/cartRouter.js";
import { orderRouter } from "./routes/orderRoute.js";
import { reviewRouter } from "./routes/reviewRouter.js";
import { notificationRouter } from "./routes/notificationRouter.js";
dotenv.config();

export const app = express();

const API_PATH = process.env.API_PATH;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(`${API_PATH}/auth`, authRouter);
app.use(`${API_PATH}/category`, categoryRouter);
app.use(`${API_PATH}/product`, productRouter);
app.use(`${API_PATH}/user`, userRouter);
app.use(`${API_PATH}/media`, mediaRouter);
app.use(`${API_PATH}/cart`, cartRouter);
app.use(`${API_PATH}/order`, orderRouter);
app.use(`${API_PATH}/review`, reviewRouter);
app.use(`${API_PATH}/notification`, notificationRouter);

console.log(API_PATH);

app.use("/*", (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Can't find ${req.originalUrl} in this server!`,
  });
});

app.use(errorHandler);
