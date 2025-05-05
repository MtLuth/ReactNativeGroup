import CartItem from "../model/cartItem.js";
import Order from "../model/order.js";
import Product from "../model/product.js";
import notificationService from "./notificationService.js";

class OrderService {
  async createOrder(userId, items, address, recipientName, phoneNumber) {
    try {
      let total = 0;
      const enrichedItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        enrichedItems.push({
          product: item.product,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const newOrder = new Order({
        user: userId,
        items: enrichedItems,
        address,
        total,
        recipientName,
        phoneNumber,
      });
      await CartItem.deleteMany({
        user: userId,
        product: { $in: items.map((item) => item.product) },
      });

      await newOrder.save();

      await notificationService.create(
        userId,
        `Bạn đã đặt hàng thành công! Mã đơn hàng: ${newOrder._id}`,
        "ORDER_PLACED"
      );

      setTimeout(async () => {
        try {
          newOrder.status = "Confirmed";
          await newOrder.save();
          console.log("Order confirmed");
        } catch (err) {
          console.error("Lỗi khi xác nhận đơn hàng sau 30 phút:", err);
        }
      }, 30 * 60 * 1000);

      return newOrder;
    } catch (err) {
      console.error("Lỗi trong createOrder:", err);
      throw err;
    }
  }

  async getOrdersByUser(userId) {
    try {
      return await Order.find({ user: userId }).sort({ createdAt: -1 });
    } catch (err) {
      console.error("Lỗi trong getOrdersByUser:", err);
      throw err;
    }
  }

  async cancelOrder(orderId, userId) {
    try {
      const order = await Order.findOne({ _id: orderId, user: userId });
      if (!order) throw new Error("Order not found");

      const diffMins = (Date.now() - order.createdAt.getTime()) / (1000 * 60);
      if (diffMins > 30 || order.status !== "Pending") {
        throw new Error("Đơn hàng đã quá thời gian hủy hoặc không thể hủy");
      }

      order.status = "Canceled";
      await order.save();

      await notificationService.create(
        userId,
        `Đơn hàng của bạn (mã: ${order._id}) đã bị hủy.`,
        "ORDER_CANCELED"
      );

      return order;
    } catch (err) {
      console.error("Lỗi trong cancelOrder:", err);
      throw err;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findById(orderId);
      if (!order) throw new Error("Order not found");

      order.status = status;
      await order.save();

      if (status === "Delivered") {
        await notificationService.create(
          order.user,
          `Đơn hàng của bạn (mã: ${order._id}) đã giao thành công!`,
          "ORDER_DELIVERED"
        );
      }

      return order;
    } catch (err) {
      console.error("Lỗi trong updateOrderStatus:", err);
      throw err;
    }
  }
  async getAllOrders() {
    try {
      return await Order.find()
        .populate("user", "fullName email")
        .populate("items.product", "name price imageUrl")
        .sort({ createdAt: -1 });
    } catch (err) {
      console.error("Lỗi trong getAllOrders:", err);
      throw err;
    }
  }

  async adminUpdateStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    order.status = status;
    await order.save();

    return order;
  }
  async getOrderById(userId, orderId) {
    try {
      const order = await Order.findOne({ _id: orderId, user: userId })
        .populate("user", "fullName email")
        .populate("items.product", "name price imageUrl");
      if (!order) throw new Error("Order not found");
      return order;
    } catch (err) {
      console.error("Lỗi trong getOrderById (user-specific):", err);
      throw err;
    }
  }
}

export default new OrderService();
