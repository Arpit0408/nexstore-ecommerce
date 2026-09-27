import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

// 1. CORS Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// 2. Body & Cookie Parsers (Sirf ek baar)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 4. Health Check
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "NexStore API is running fine" });
});

export default app;
