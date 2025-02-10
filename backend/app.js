import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./controller/errorController.js";
import { authRouter } from "./routes/authRoute.js";
import dotenv from "dotenv";

dotenv.config();

export const app = express();

const API_PATH = process.env.API_PATH;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(`${API_PATH}/auth`, authRouter);

console.log(API_PATH);

app.use("/*", (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Can't find ${req.originalUrl} in this server!`,
  });
});

app.use(errorHandler);
