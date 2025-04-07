// server/routes/index.js
import express from "express";
import userRoutes from "./users.js";
import postRoutes from "./posts.js";
import commentRoutes from "./comments.js";
import adminRoutes from "./admin.js"; // Import admin routes
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes - some endpoints are protected within the route file
router.use("/users", userRoutes);

// Admin routes - protected by isAdmin middleware within the admin routes file
router.use("/admin", adminRoutes);

// Post routes - some endpoints are protected within the route file
router.use("/posts", postRoutes);

// Comment routes - some endpoints might be protected within the route file
router.use("/comments", commentRoutes);

export default router;
