import { validationResult } from "express-validator";
import orderService from "../service/orderService.js";
import catchAsync from "../utils/catchAsync.js";

class OrderController {
  createOrder = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.userId;
    const { items, address } = req.body;
    const order = await orderService.createOrder(userId, items, address);
    res.status(201).json({ status: "success", data: order });
  });

  getOrderHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.userId;
    const orders = await orderService.getOrdersByUser(userId);
    res.status(200).json({ status: "success", data: orders });
  });

  cancelOrder = catchAsync(async (req, res, next) => {
    const orderId = req.params.orderId;
    const userId = req.user.id;
    const canceledOrder = await orderService.cancelOrder(orderId, userId);
    res.status(200).json({ status: "success", data: canceledOrder });
  });

  updateOrderStatus = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const orderId = req.params.id;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({ status: "success", data: updatedOrder });
  });
}

export default new OrderController();
