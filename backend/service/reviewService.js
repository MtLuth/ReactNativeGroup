import Review from "../model/review.js";
import Product from "../model/product.js";
import Order from "../model/order.js";

class ReviewService {
  async addReview(userId, productId, orderId, rating, comment) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    if (order.status !== "Completed") throw new Error("Order not completed");

    const existing = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId,
    });
    if (existing) throw new Error("You have already reviewed this product");

    const review = new Review({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      comment,
    });
    await review.save();
    return review;
  }

  async getProductReviews(productId) {
    return await Review.find({ product: productId }).populate(
      "user",
      "fullName avatar"
    );
  }

  async deleteReview(reviewId, userId) {
    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) throw new Error("Review not found or unauthorized");
    await review.deleteOne();
    return true;
  }
}

export default new ReviewService();
