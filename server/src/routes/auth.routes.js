import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import { validateRequest } from "../validators/validate.middleware.js"; // ya '../middlewares/validate.middleware.js'
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/refresh-token", refreshToken);

// Protected Routes (Requires Bearer Access Token)
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;
