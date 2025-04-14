// comments.js - MINIMAL CHANGES APPLIED

import express from "express";
import prisma from "../utils/prisma.js";
import { commentsCache } from "../utils/cache.js";
// >>> CHANGE 1: Ensure correct import path for your middleware <<<
import { authenticateJWT } from "../middleware/authMiddleware.js"; // Verify this path

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
// >>> CHANGE 4: Add authentication and save userId <<<
router.post("/", authenticateJWT, async (req, res) => {
  // Added authenticateJWT
  try {
    // Keep taking name from body as per original code
    const { name, content, postId: postIdParam } = req.body;
    const currentUser = req.user; // User from middleware

    // Check if middleware provided user data (basic check)
    if (!currentUser || !currentUser.id) {
      console.error("Authentication middleware problem in POST:", currentUser);
      return res
        .status(401)
        .json({ success: false, message: "Authentication error." }); // Generic message
    }

    // Basic validation
    if (!name || !content || !postIdParam) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, content, postId",
      });
    }
    if (isNaN(parseInt(postIdParam))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid postId format" });
    }
    const postId = parseInt(postIdParam);

    // Create comment, saving name from body AND userId from authenticated user
    const newComment = await prisma.comment.create({
      data: {
        name: name, // Use name from request body
        content: content,
        postId: postId,
        userId: currentUser.id, // Save the ID of the user making the comment
      },
      // Select fields consistent with GET request + userId
      select: {
        id: true,
        name: true,
        content: true,
        postId: true,
        createdAt: true,
        userId: true,
      },
    });

    // Invalidate Cache
    commentsCache.del(`comments_${postId}`);

    // Send original success response structure
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    // Handle specific known errors
    if (error.code === "P2003" && error.meta?.field_name?.includes("postId")) {
      return res.status(400).json({
        success: false,
        message: "Invalid postId: The specified post does not exist.",
      });
    }
    // Generic server error for other issues
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
    });
  }
});

export default router;
