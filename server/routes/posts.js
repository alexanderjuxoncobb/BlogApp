import express from "express";
import prisma from "../utils/prisma.js";
import { postsCache } from "../utils/cache.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Check if refresh parameter is present
    const forceRefresh = req.query.refresh === "true";

    // Check if data exists in cache and no refresh is requested
    const cacheKey = "all_posts";
    const cachedPosts = !forceRefresh ? postsCache.get(cacheKey) : null;

    if (cachedPosts) {
      console.log("Serving posts from cache");
      return res.json({
        message: "Here is the first post:",
        post: cachedPosts[0]?.title,
        posts: cachedPosts,
      });
    }

    // If not in cache or refresh requested, fetch from database
    console.log("Fetching posts from database");
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
      },
    });

    // Store in cache for future requests
    postsCache.set(cacheKey, posts);

    res.json({
      message: "Here is the first post:",
      post: posts[0]?.title,
      posts: posts,
    });
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

    // Invalidate cache after deletion
    postsCache.del("all_posts");

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

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    // Invalidate cache after adding new post
    postsCache.del("all_posts");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: {
        title: newPost.title,
        content: newPost.content,
        authorId: newPost.authorId,
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
