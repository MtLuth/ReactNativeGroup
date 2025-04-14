import { body } from "express-validator";

export const addReviewValidator = [
  body("product").notEmpty().not().withMessage("Product is required"),
  body("rating")
    .not()
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isString(),
  body("order").notEmpty().withMessage("Order ID is required"),
];
