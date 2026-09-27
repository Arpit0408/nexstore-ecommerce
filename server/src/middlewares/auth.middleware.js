import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Find user in DB (excluding password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists or session expired.",
      });
    }

    // 4. Attach user object to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired. Please refresh your token.",
        isExpired: true,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid access token. Authentication failed.",
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

