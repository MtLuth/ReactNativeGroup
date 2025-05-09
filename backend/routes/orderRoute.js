import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import {
  createOrderValidator,
  updateOrderStatusValidator,
} from "../validator/order.validator.js";
import orderController from "../controller/orderController.js";
export const orderRouter = express.Router();

orderRouter
  .route("/")
  .post(verifyUser, createOrderValidator, orderController.createOrder)
  .get(verifyUser, orderController.getOrderHistory);

orderRouter
  .route("/:id")
  .put(updateOrderStatusValidator, orderController.updateOrderStatus)
  .get(verifyUser, orderController.getOrderById);

orderRouter.route("/cancel/:id").put(verifyUser, orderController.cancelOrder);
orderRouter.get("/admin/all", orderController.getAllOrders);
orderRouter.put("/admin/:id/status", orderController.adminUpdateStatus);
