import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  createProductValidator,
  updateProductValidator,
  productIdParamValidator,
} from "../validators/product.validator.js";
import { validateRequest } from "../validators/validate.middleware.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllProducts);
router.get("/:id", productIdParamValidator, validateRequest, getProductById);

// Admin-Only Protected Routes
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  createProductValidator,
  validateRequest,
  createProduct,
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  updateProductValidator,
  validateRequest,
  updateProduct,
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  productIdParamValidator,
  validateRequest,
  deleteProduct,
);

export default router;
