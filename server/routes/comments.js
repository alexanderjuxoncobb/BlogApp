import express from "express";
import prisma from "../utils/prisma.js";

const router = express.Router();

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
      },
      select: {
        name: true,
        content: true,
      },
    });
    res.json({
      message: "Here is the first comment:",
      comment: comments[0].content,
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

    await prisma.comment.delete({
      where: { id: commentId },
    });

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

    const newcomment = await prisma.comment.create({
      data: {
        name,
        content,
        postId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: {
        name: newcomment.name,
        content: newcomment.content,
        postId: newcomment.postId,
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
