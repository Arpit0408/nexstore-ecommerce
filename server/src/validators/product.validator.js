import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createProductValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be an integer of 0 or greater"),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters"),
];

export const updateProductValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID format"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be an integer of 0 or greater"),
];

export const productIdParamValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID format"),
];
