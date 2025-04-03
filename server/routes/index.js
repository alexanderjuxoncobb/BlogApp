import express from "express";
import userRoutes from "./users.js";
import postRoutes from "./posts.js";
import commentRoutes from "./comments.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

export default router;
