// comments.js - WITH RATE LIMITING AND SPAM PROTECTION

import express from "express";
import prisma from "../utils/prisma.js";
import { commentsCache } from "../utils/cache.js";
import {
  authenticateJWT,
  optionalAuthenticateJWT,
} from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit"; // Add this import

const router = express.Router();

// Configure rate limiting middleware
const commentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 3, // Limit each IP to 3 comment creations per minute
  message: {
    success: false,
    message: "Too many comments created. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Simple spam detection function
function isSpam(content, name, postId) {
  // Check for extremely repetitive submissions
  // You can expand this with more sophisticated checks
  if (name === "qassd" || name === "qassdwade") {
    return true;
  }
  return false;
}

router.get("/", async (req, res) => {
  const cacheKey = `top_20_comments`;

  try {
    const forceRefresh = req.query.refresh === "true";
    const cachedComments = !forceRefresh ? commentsCache.get(cacheKey) : null;

    if (cachedComments) {
      console.log(`Serving top 20 comments from cache`);
      return res.json({
        comments: cachedComments,
      });
    }

    console.log(`Fetching top 20 comments from database`);
    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        name: true,
        content: true,
        postId: true,
        createdAt: true,
        userId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    commentsCache.set(cacheKey, comments);

    res.json({
      comments: comments,
    });
  } catch (error) {
    console.error(`Error fetching comments`, error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// GET /:postId - Fetch comments for a post
router.get("/:postId", async (req, res) => {
  const postIdParam = req.params.postId;

  if (isNaN(parseInt(postIdParam))) {
    return res.status(400).json({ error: "Invalid post ID format." });
  }
  const postId = parseInt(postIdParam);
  const cacheKey = `comments_${postId}`;

  try {
    const forceRefresh = req.query.refresh === "true";
    const cachedComments = !forceRefresh ? commentsCache.get(cacheKey) : null;

    if (cachedComments) {
      console.log(`Serving comments for post ${postId} from cache`);
      return res.json({
        message:
          cachedComments.length > 0
            ? "Here is the first comment:"
            : "No comments found",
        comment: cachedComments[0]?.content,
        comments: cachedComments,
      });
    }

    console.log(`Fetching comments for post ${postId} from database`);
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      select: {
        id: true,
        name: true,
        content: true,
        postId: true,
        createdAt: true,
        userId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    commentsCache.set(cacheKey, comments);

    res.json({
      message:
        comments.length > 0
          ? "Here is the first comment:"
          : "No comments found",
      comment: comments[0]?.content,
      comments: comments,
    });
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// DELETE /:id - Delete a specific comment
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const commentIdParam = req.params.id;
    const currentUser = req.user;

    if (isNaN(parseInt(commentIdParam))) {
      return res.status(400).json({ message: "Invalid comment ID format" });
    }
    const commentId = parseInt(commentIdParam);

    if (!currentUser || !currentUser.id || !currentUser.role) {
      console.error(
        "Authentication middleware problem in DELETE:",
        currentUser
      );
      return res.status(401).json({ message: "Authentication error." });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAdmin = currentUser.role === "ADMIN";
    const isOwner =
      comment.userId !== null && comment.userId === currentUser.id;

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot delete this comment" });
    }

    const postId = comment.postId;

    await prisma.comment.delete({
      where: { id: commentId },
    });

    if (postId) {
      commentsCache.del(`comments_${postId}`);
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

// POST / - Create a new comment with rate limiting and spam protection
router.post("/", commentLimiter, optionalAuthenticateJWT, async (req, res) => {
  const GUEST_USER_ID = 4;

  try {
    const { name, content, postId: postIdParam } = req.body;
    const currentUser = req.user;
    const clientIP = req.ip || req.headers["x-forwarded-for"] || "unknown";

    // Log incoming comment attempt
    console.log(`Comment attempt from IP ${clientIP} for post ${postIdParam}`);

    // Basic validation
    if (!name || !content || !postIdParam) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, content, postId",
      });
    }
    if (typeof name !== "string" || name.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Name cannot be empty." });
    }
    if (typeof content !== "string" || content.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Content cannot be empty." });
    }
    if (isNaN(parseInt(postIdParam))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid postId format" });
    }
    const postId = parseInt(postIdParam);

    // Spam detection
    if (isSpam(content, name, postId)) {
      console.warn(
        `Spam comment detected from IP ${clientIP} for post ${postId}`
      );
      return res.status(403).json({
        success: false,
        message:
          "Comment identified as potential spam. Please try again later.",
      });
    }

    // Check if post actually exists before trying to comment
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: "The post you're trying to comment on doesn't exist.",
      });
    }

    // Count existing comments from this user/IP for this post in last hour
    // (Additional protection against automated posting)
    const recentCommentCount = await prisma.comment.count({
      where: {
        postId: postId,
        name: name,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
    });

    if (recentCommentCount >= 5 && currentUser?.role !== "ADMIN") {
      console.warn(`Comment frequency limit hit for post ${postId} by ${name}`);
      return res.status(429).json({
        success: false,
        message:
          "You've commented too frequently on this post. Please try again later.",
      });
    }

    // Determine the User ID to Save
    const userIdToSave =
      currentUser && currentUser.id ? currentUser.id : GUEST_USER_ID;

    // Create comment with connection timeout handling
    const newComment = await prisma.$transaction(
      async (tx) => {
        return await tx.comment.create({
          data: {
            name: name.trim(),
            content: content.trim(),
            postId: postId,
            userId: userIdToSave,
          },
          select: {
            id: true,
            name: true,
            content: true,
            postId: true,
            createdAt: true,
            userId: true,
          },
        });
      },
      {
        timeout: 5000, // 5 second timeout for transaction
      }
    );

    // Log successful comment
    console.log(
      `Comment created successfully: ID ${newComment.id} for post ${postId}`
    );

    // Invalidate Cache
    if (typeof commentsCache.del === "function") {
      commentsCache.del(`comments_${postId}`);
    } else {
      console.warn(
        "commentsCache.del is not defined. Cache not invalidated for post",
        postId
      );
    }

    // Send original success response structure
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);

    // Handle specific known errors
    if (error.code === "P2003") {
      if (error.meta?.field_name?.includes("userId")) {
        console.error(
          `Foreign key constraint failed for userId. Ensure the hardcoded GUEST_USER_ID (${GUEST_USER_ID}) exists in the User table.`
        );
        return res.status(500).json({
          success: false,
          message:
            "Failed to create comment due to a server configuration issue (Guest user ID might be invalid).",
        });
      } else if (error.meta?.field_name?.includes("postId")) {
        return res.status(400).json({
          success: false,
          message: "Invalid postId: The specified post does not exist.",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Invalid reference to related data.",
      });
    }
    if (error.code === "P2002") {
      const target = error.meta?.target
        ? ` on field(s): ${error.meta.target.join(", ")}`
        : "";
      return res.status(409).json({
        success: false,
        message: `A unique constraint was violated${target}.`,
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Required related record not found.",
      });
    }
    if (error.code === "P2024") {
      return res.status(503).json({
        success: false,
        message:
          "The server is currently experiencing high load. Please try again later.",
      });
    }

    // Generic server error for other issues
    res.status(500).json({
      success: false,
      message: "Failed to create comment due to an unexpected server error.",
    });
  }
});

export default router;
