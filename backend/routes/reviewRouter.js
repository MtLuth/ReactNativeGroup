import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import reviewController from "../controller/reviewController.js";
import { addReviewValidator } from "../validator/review.validator.js";

export const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(verifyUser, addReviewValidator, reviewController.addReview);
reviewRouter.get("/:productId", reviewController.getProductReviews);
reviewRouter.delete("/:reviewId", verifyUser, reviewController.deleteReview);
