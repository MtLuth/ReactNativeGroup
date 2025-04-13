import Review from "../model/review.js";
import Product from "../model/product.js";

class ReviewService {
  async addReview(userId, productId, rating, comment) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const existing = await Review.findOne({ user: userId, product: productId });
    if (existing) throw new Error("You have already reviewed this product");

    const review = new Review({
      user: userId,
      product: productId,
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
