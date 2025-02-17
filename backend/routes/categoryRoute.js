import express from "express";
import categoryController from "../controller/categoryController.js";
export const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);
