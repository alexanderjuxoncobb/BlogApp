import express from "express";
import prisma from "../utils/prisma.js";
import { usersCache } from "../utils/cache.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Check if refresh parameter is present
    const forceRefresh = req.query.refresh === "true";

    // Check if data exists in cache and no refresh is requested
    const cacheKey = "all_users";
    const cachedUsers = !forceRefresh ? usersCache.get(cacheKey) : null;

    if (cachedUsers) {
      console.log("Serving users from cache");
      return res.json({ message: "Here are the users:", users: cachedUsers });
    }

    // If not in cache or refresh requested, fetch from database
    console.log("Fetching users from database");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Store in cache for future requests
    usersCache.set(cacheKey, users);

    res.json({ message: "Here are the users:", users: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

// Update user profile
router.put("/profile", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Validation
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (name or email) must be provided for update",
      });
    }

    // Check if email already exists if trying to update email
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
    }

    // Build update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    updateData.updatedAt = new Date();

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Invalidate cache for this user
    usersCache.del("all_users");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// Get current user profile
router.get("/profile", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

// Change password
router.put("/change-password", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
});

// Delete user account (self)
router.delete("/account", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    // First delete all user's posts (and their comments via cascade)
    await prisma.post.deleteMany({
      where: { authorId: userId },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    // Invalidate cache
    usersCache.del("all_users");
    postsCache.del(`user_posts_${userId}`);

    // Clear authentication cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
});

// server/routes/users.js
router.delete("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Start a transaction to handle all related deletions
    await prisma.$transaction(async (tx) => {
      // Delete user's comments first
      await tx.comment.deleteMany({
        where: { userId },
      });

      // Get all posts by this user
      const userPosts = await tx.post.findMany({
        where: { authorId: userId },
        select: { id: true },
      });

      // Delete comments on these posts
      if (userPosts.length > 0) {
        const postIds = userPosts.map((post) => post.id);
        await tx.comment.deleteMany({
          where: { postId: { in: postIds } },
        });
      }

      // Delete the posts
      await tx.post.deleteMany({
        where: { authorId: userId },
      });

      // Finally delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    usersCache.del("all_users");
    res.status(204).send();
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

export default router;
