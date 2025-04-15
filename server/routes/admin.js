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
        _count: {
          select: {
            posts: true,
          },
        },
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

// Get admin dashboard stats
router.get("/dashboard/stats", async (req, res) => {
  try {
    // Count total users
    const totalUsers = await prisma.user.count();

    // Count total posts
    const totalPosts = await prisma.post.count();

    // Count published posts
    const publishedPosts = await prisma.post.count({
      where: { published: true },
    });

    // Count total comments
    const totalComments = await prisma.comment.count();

    // Get recent posts
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Get recent comments
    const recentComments = await prisma.comment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        name: true,
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        publishedPosts,
        totalComments,
      },
      recentActivity: {
        posts: recentPosts,
        comments: recentComments,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
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
