import Order from "../model/order.js";
import Product from "../model/product.js";

class OrderService {
  async createOrder(userId, items, address) {
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
    });

    await newOrder.save();

    setTimeout(async () => {
      newOrder.status = "Confirmed";
      await newOrder.save();
      console.log("Order confirmed");
    }, 30 * 60 * 1000);
    return newOrder;
  }

  async getOrderById(id) {
    const order = await Order.findById(id)
      .populate("user")
      .populate("items.product");
    if (!order) throw new Error("Order not found");
    return order;
  }

  async getOrdersByUser(userId) {
    console.log(userId);
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  async cancelOrder(orderId, userId) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found");

    const diffMins = (Date.now() - order.createdAt.getTime()) / (1000 * 60);
    if (diffMins > 30 || order.status !== "Pending") {
      throw new Error("Đơn hàng đã quá thời gian hủy hoặc không thể hủy");
    }

    order.status = "Canceled";
    await order.save();
    return order;
  }

  async updateOrderStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    order.status = status;
    await order.save();
    return order;
  }

  async getOrderById(userId, orderId) {
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("user", "fullName email")
      .populate("items.product", "name price");
    if (!order) throw new Error("Order not found");
    return order;
  }
}

export default new OrderService();
