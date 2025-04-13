import { validationResult } from "express-validator";
import cartService from "../service/cartService.js";
import catchAsync from "../utils/catchAsync.js";

const cartController = {
  getCart: catchAsync(async (req, res) => {
    const { userId } = req.user;
    const items = await cartService.getCartItemsByUser(userId);
    res.status(200).json({ status: "success", data: items });
  }),

  addToCart: catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "fail", errors: errors.array() });
    }
    const { productId, quantity } = req.body;
    const { userId } = req.user;
    const item = await cartService.addToCart(userId, productId, quantity);
    res.status(200).json({ status: "success", data: item });
  }),

  updateQuantity: catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "fail", errors: errors.array() });
    }
    const { quantity } = req.body;
    const { id } = req.params;
    const updatedItem = await cartService.updateQuantity(id, quantity);
    res.status(200).json({ status: "success", data: updatedItem });
  }),

  removeFromCart: catchAsync(async (req, res) => {
    const { id } = req.params;
    await cartService.removeFromCart(id);
    res
      .status(200)
      .json({ status: "success", message: "Đã xóa sản phẩm khỏi giỏ hàng" });
  }),

  clearCart: catchAsync(async (req, res) => {
    const { userId } = req.user;
    await cartService.clearCart(userId);
    res
      .status(200)
      .json({ status: "success", message: "Đã xóa toàn bộ giỏ hàng" });
  }),
};

export default cartController;
