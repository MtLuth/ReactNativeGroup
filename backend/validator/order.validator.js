import { body } from "express-validator";

export const createOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),

  body("items.*.product")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("address").notEmpty().withMessage("Address is required"),
];

export const updateOrderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "Pending",
      "Confirmed",
      "Preparing",
      "Shipping",
      "Completed",
      "Canceled",
    ])
    .withMessage(
      "Status must be one of the following: Pending, Confirmed, Preparing, Shipping, Completed, Canceled"
    ),
];
