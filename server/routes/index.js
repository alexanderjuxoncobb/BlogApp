import express from "express";
import userRoutes from "./users.js";
import postRoutes from "./posts.js";
import commentRoutes from "./comments.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.use("/users", authenticateJWT, userRoutes);

// Public routes
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

export default router;
