// server/routes/index.js
import express from "express";
import userRoutes from "./users.js";
import postRoutes from "./posts.js";
import commentRoutes from "./comments.js";
import adminRoutes from "./admin.js"; // Import admin routes
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.use("/users", authenticateJWT, userRoutes);

// Admin routes - protected by isAdmin middleware within the admin routes file
router.use("/admin", adminRoutes);

// Public routes
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

export default router;
