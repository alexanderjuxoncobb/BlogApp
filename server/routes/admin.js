// server/routes/admin.js
import express from "express";
import prisma from "../utils/prisma.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes here are protected by the isAdmin middleware
router.use(isAdmin);

// Get all users (admin only)
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// Change user role to ADMIN
router.patch("/users/:id/make-admin", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: "ADMIN",
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.json({
      success: true,
      message: "User successfully promoted to admin",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
});

// Change user role to USER
router.patch("/users/:id/revoke-admin", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Prevent revoking admin status from the logged-in admin
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot revoke your own admin privileges",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: "USER",
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.json({
      success: true,
      message: "Admin privileges revoked successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
});

export default router;
