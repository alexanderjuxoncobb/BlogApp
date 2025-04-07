// server/middleware/adminMiddleware.js
import { authenticateJWT } from "./authMiddleware.js";

// Middleware to check if user has ADMIN role
export const isAdmin = [
  authenticateJWT, // First authenticate the user
  (req, res, next) => {
    // Check if user exists and has ADMIN role
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Authentication required",
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    // User is authenticated and is an admin
    next();
  },
];

// More flexible middleware for checking various roles
export const hasRole = (requiredRole) => [
  authenticateJWT,
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Authentication required",
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: ${requiredRole} role required`,
      });
    }

    next();
  },
];
