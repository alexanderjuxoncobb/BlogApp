import express from "express";
import prisma from "../utils/prisma.js";
import { commentsCache } from "../utils/cache.js";

const router = express.Router();

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const cacheKey = `comments_${postId}`;

  try {
    // Check if refresh parameter is present
    const forceRefresh = req.query.refresh === "true";

    // Check if data exists in cache and no refresh is requested
    const cachedComments = !forceRefresh ? commentsCache.get(cacheKey) : null;

    if (cachedComments) {
      console.log("Serving comments from cache");
      return res.json({
        message:
          cachedComments.length > 0
            ? "Here is the first comment:"
            : "No comments found",
        comment: cachedComments[0]?.content,
        comments: cachedComments,
      });
    }

    // If not in cache or refresh requested, fetch from database
    console.log("Fetching comments from database");
    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
      },
      select: {
        id: true,
        name: true,
        content: true,
        postId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Store in cache for future requests
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
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const postId = existingComment.postId;

    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Invalidate specific cache for this post's comments
    commentsCache.del(`comments_${postId}`);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, content, postId } = req.body;

    const newComment = await prisma.comment.create({
      data: {
        name,
        content,
        postId,
      },
    });

    // Invalidate specific cache for this post's comments
    commentsCache.del(`comments_${postId}`);

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: {
        name: newComment.name,
        content: newComment.content,
        postId: newComment.postId,
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message,
    });
  }
});

export default router;
