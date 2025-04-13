import express from "express";
import cartController from "../controller/cartController.js";
import verifyUser from "../middleware/verifyUser.js";
import {
  addCartItemValidator,
  updateCartItemValidator,
} from "../validator/cart.validator.js";

export const cartRouter = express.Router();

cartRouter
  .route("/")
  .get(verifyUser, cartController.getCart)
  .post(verifyUser, addCartItemValidator, cartController.addToCart);

cartRouter
  .route("/:id")
  .put(verifyUser, updateCartItemValidator, cartController.updateQuantity)
  .delete(verifyUser, cartController.removeFromCart);
