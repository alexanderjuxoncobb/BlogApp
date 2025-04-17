// comments.js - MINIMAL CHANGES APPLIED

import express from "express";
import prisma from "../utils/prisma.js";
import { commentsCache } from "../utils/cache.js";
// >>> CHANGE 1: Ensure correct import path for your middleware <<<
import {
  authenticateJWT,
  optionalAuthenticateJWT,
} from "../middleware/authMiddleware.js"; // Verify this path

const router = express.Router();

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
        name: true, // Keep selecting name
        content: true,
        postId: true,
        createdAt: true,
        // >>> CHANGE 2: Select the userId (will be null for old comments) <<<
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
    // Log the actual error on the server for debugging
    console.error(`Error fetching comments`, error);
    // Send generic error to client
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// GET /:postId - Fetch comments for a post
router.get("/:postId", async (req, res) => {
  const postIdParam = req.params.postId;

  // Basic input validation
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
        name: true, // Keep selecting name
        content: true,
        postId: true,
        createdAt: true,
        // >>> CHANGE 2: Select the userId (will be null for old comments) <<<
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
    // Log the actual error on the server for debugging
    console.error(`Error fetching comments for post ${postId}:`, error);
    // Send generic error to client
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// DELETE /:id - Delete a specific comment
// >>> CHANGE 3: Add authentication and authorization <<<
router.delete("/:id", authenticateJWT, async (req, res) => {
  // Added authenticateJWT
  try {
    const commentIdParam = req.params.id;
    const currentUser = req.user; // User from middleware

    if (isNaN(parseInt(commentIdParam))) {
      return res.status(400).json({ message: "Invalid comment ID format" });
    }
    const commentId = parseInt(commentIdParam);

    // Check if middleware provided user data (basic check)
    if (!currentUser || !currentUser.id || !currentUser.role) {
      console.error(
        "Authentication middleware problem in DELETE:",
        currentUser
      );
      return res.status(401).json({ message: "Authentication error." }); // Generic message
    }

    // Fetch comment including userId to check ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true }, // Select only needed fields
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Authorization Check
    const isAdmin = currentUser.role === "ADMIN";
    // Check ownership, ensuring comment.userId is not null before comparing
    const isOwner =
      comment.userId !== null && comment.userId === currentUser.id;

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot delete this comment" });
    }

    // --- Authorized: Proceed ---
    const postId = comment.postId; // Store before delete for cache invalidation

    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Invalidate Cache
    if (postId) {
      commentsCache.del(`comments_${postId}`);
    }

    res.status(204).send(); // Success, No Content
  } catch (error) {
    console.error("Error deleting comment:", error);
    // Handle specific Prisma error for record not found during delete
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Comment not found" });
    }
    // Generic server error for other issues
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

// POST / - Create a new comment
router.post("/", optionalAuthenticateJWT, async (req, res) => {
  // --- Hardcoded Guest User ID ---
  // ID 4 is designated for guests.
  const GUEST_USER_ID = 4;

  try {
    const { name, content, postId: postIdParam } = req.body;
    const currentUser = req.user; // User from middleware (might be undefined)

    // --- Basic validation ---
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

    // --- Determine the User ID to Save ---
    const userIdToSave =
      currentUser && currentUser.id ? currentUser.id : GUEST_USER_ID;

    // --- Create comment ---
    const newComment = await prisma.comment.create({
      data: {
        name: name.trim(), // Use name from request body
        content: content.trim(),
        postId: postId,
        userId: userIdToSave, // Use determined userId (real user or guest)
      },
      select: {
        // Select fields consistent with GET request + userId
        id: true,
        name: true,
        content: true,
        postId: true,
        createdAt: true,
        userId: true,
      },
    });

    // --- Invalidate Cache ---
    if (typeof commentsCache.del === "function") {
      commentsCache.del(`comments_${postId}`);
    } else {
      console.warn(
        "commentsCache.del is not defined. Cache not invalidated for post",
        postId
      );
    }

    // --- Send original success response structure ---
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);

    // Handle specific known errors
    if (error.code === "P2003") {
      // Foreign key constraint failed
      if (error.meta?.field_name?.includes("userId")) {
        console.error(
          `Foreign key constraint failed for userId. Ensure the hardcoded GUEST_USER_ID (${GUEST_USER_ID}) exists in the User table.`
        );
        return res.status(500).json({
          // Internal server error because config (hardcoded value) might be wrong
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
      // Unique constraint violation
      const target = error.meta?.target
        ? ` on field(s): ${error.meta.target.join(", ")}`
        : "";
      return res.status(409).json({
        success: false,
        message: `A unique constraint was violated${target}.`,
      });
    }
    if (error.code === "P2025") {
      // Required record not found
      return res.status(404).json({
        success: false,
        message: "Required related record not found.",
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
