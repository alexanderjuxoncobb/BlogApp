import express from "express";
import userRoutes from "./users.js";
import postRoutes from "./posts.js";
import commentRoutes from "./comments.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.use("/users", userRoutes);

// Protected routes
router.use("/posts", authenticateJWT, postRoutes);
router.use("/comments", authenticateJWT, commentRoutes);

export default router;
