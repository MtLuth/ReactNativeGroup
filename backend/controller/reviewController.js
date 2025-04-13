import { validationResult } from "express-validator";
import reviewService from "../service/reviewService.js";
import catchAsync from "../utils/catchAsync.js";

class ReviewController {
  addReview = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const { product, rating, comment } = req.body;
    const review = await reviewService.addReview(
      userId,
      product,
      rating,
      comment
    );
    res.status(201).json({ status: "success", data: review });
  });

  getProductReviews = catchAsync(async (req, res, next) => {
    const productId = req.params.productId;
    const reviews = await reviewService.getProductReviews(productId);
    res.status(200).json({ status: "success", data: reviews });
  });

  deleteReview = catchAsync(async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;
    await reviewService.deleteReview(reviewId, userId);
    res.status(200).json({ status: "success", message: "Review deleted" });
  });
}

export default new ReviewController();
