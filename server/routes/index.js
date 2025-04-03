import express from "express";
import userRoutes from "./users.js";

const router = express.Router();

router.use("/api/users", userRoutes);

export default router;
