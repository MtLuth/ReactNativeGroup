import express from "express";
import productController from "../controller/productController.js";

export const productRouter = express.Router();

productRouter
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);
