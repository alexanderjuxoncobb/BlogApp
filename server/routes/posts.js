import express from "express";
import prisma from "../utils/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        title: true,
        content: true,
      },
    });
    res.json({ message: "Here is the first post:", post: posts[0].title });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    const newpost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: {
        title: newpost.title,
        content: newpost.content,
        authorId: newpost.authorId,
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
});

export default router;
