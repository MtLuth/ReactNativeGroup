import CartItem from "../model/cartItem.js";

class CartService {
  // Get all items in cart by user
  async getCartItemsByUser(userId) {
    return await CartItem.find({ user: userId }).populate("product");
  }

  // Add item to cart
  async addToCart(userId, productId, quantity = 1) {
    const existingItem = await CartItem.findOne({
      user: userId,
      product: productId,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      return await existingItem.save();
    }

    const newItem = new CartItem({
      user: userId,
      product: productId,
      quantity,
    });

    return await newItem.save();
  }

  // Update quantity of cart item
  async updateQuantity(id, quantity) {
    const item = await CartItem.findById(id);

    if (!item) throw new Error("Sản phẩm không có trong giỏ hàng");

    item.quantity = quantity;
    return await item.save();
  }

  // Remove item from cart
  async removeFromCart(id) {
    return await CartItem.findOneAndDelete({
      _id: id,
    });
  }

  // Clear entire cart for user
  async clearCart(userId) {
    return await CartItem.deleteMany({ user: userId });
  }
}

export default new CartService();
