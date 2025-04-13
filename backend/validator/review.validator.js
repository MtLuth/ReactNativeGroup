import { body } from "express-validator";

export const addReviewValidator = [
  body("product").notEmpty().isMongoId().withMessage("Invalid product ID"),
  body("rating")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isString(),
];
