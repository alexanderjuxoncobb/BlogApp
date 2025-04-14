import express from "express";
import prisma from "../utils/prisma.js";
import { postsCache } from "../utils/cache.js";
import {
  authenticateJWT,
  optionalAuthenticateJWT,
} from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", optionalAuthenticateJWT, async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === "true";
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

    console.log("Fetching posts from database");
    const whereClause = req.user?.role === "ADMIN" ? {} : { published: true };

    const posts = await prisma.post.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        published: true,
        author: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
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

// Get current user's posts
router.get("/my-posts", authenticateJWT, async (req, res) => {
  console.log("do you read me?");
  try {
    const userId = req.user.id;

    // Check if refresh parameter is present
    const forceRefresh = req.query.refresh === "true";

    // Cache key specific to this user's posts
    const cacheKey = `user_posts_${userId}`;
    const cachedPosts = !forceRefresh ? postsCache.get(cacheKey) : null;

    if (cachedPosts) {
      return res.json({
        success: true,
        message: "Your posts",
        posts: cachedPosts,
      });
    }

    // Fetch posts from database
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true, // Include published status
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Store in cache
    postsCache.set(cacheKey, posts);

    res.json({
      success: true,
      message: "Your posts",
      posts,
    });
  } catch (error) {
    console.error("Error fetching my posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your posts",
      error: error.message,
    });
  }
});

// Get a single post with comments
// Get a single post with comments (updated secure version)
router.get("/:id", optionalAuthenticateJWT, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user?.id; // Optional chaining for safe access
    const userAdmin = req.user?.role === "ADMIN" ? true : false;

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const forceRefresh = req.query.refresh === "true";
    const cacheKey = `post_detail_${postId}`;
    const cachedPost = !forceRefresh ? postsCache.get(cacheKey) : null;

    // Check cached post permissions
    if (cachedPost) {
      const isAuthor = userId === cachedPost.authorId;
      if (!cachedPost.published && !(isAuthor || userAdmin)) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
      return res.json({ success: true, post: cachedPost });
    }

    // If user is admin, they can see any post
    if (userAdmin) {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: { select: { id: true, name: true, email: true } },
          comments: { orderBy: { createdAt: "desc" } },
        },
      });

      if (post) {
        return res.json({ success: true, post });
      }
    } else {
      // Fetch post from database with additional where clause
      const post = await prisma.post.findFirst({
        where: {
          id: postId,
          // Add database-level filtering
          OR: [
            { published: true },
            { authorId: userId || -1 }, // -1 ensures no match if user not logged in
          ],
        },
        include: {
          author: { select: { id: true, name: true, email: true } },
          comments: { orderBy: { createdAt: "desc" } },
        },
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
    }

    // Store in cache with TTL
    postsCache.set(cacheKey, post, 300); // 5 minutes cache

    res.json({ success: true, post });
  } catch (error) {
    console.error("Error fetching post details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post details",
      error: error.message,
    });
  }
});

// Get posts by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if refresh parameter is present
    const forceRefresh = req.query.refresh === "true";

    // Cache key specific to this user's posts
    const cacheKey = `user_posts_${userId}`;
    const cachedPosts = !forceRefresh ? postsCache.get(cacheKey) : null;

    if (cachedPosts) {
      return res.json({
        success: true,
        message: `Posts by ${user.name}`,
        user: { id: user.id, name: user.name },
        posts: cachedPosts,
      });
    }

    // Fetch posts from database
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        OR: [{ published: true }, { authorId: req.user?.id || -1 }],
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true, // Include published status
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Store in cache
    postsCache.set(cacheKey, posts);

    res.json({
      success: true,
      message: `Posts by ${user.name}`,
      user: { id: user.id, name: user.name },
      posts,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user posts",
      error: error.message,
    });
  }
});

// Create new post (for authenticated users)
router.post("/create", authenticateJWT, async (req, res) => {
  try {
    const { title, content, published = false } = req.body;
    const authorId = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Post title is required",
      });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published: Boolean(published),
        authorId,
      },
    });

    // Invalidate relevant caches
    postsCache.del("all_posts");
    postsCache.del(`user_posts_${authorId}`);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
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

// Update a post (for post author only)
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const { title, content, published } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    // Check if post exists and belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (existingPost.authorId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this post",
      });
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = Boolean(published);
    updateData.updatedAt = new Date();

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    // Invalidate relevant caches
    postsCache.del("all_posts");
    postsCache.del(`user_posts_${userId}`);
    postsCache.del(`post_detail_${postId}`);

    res.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    // Check if post exists and belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!existingPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Ensure only the author can delete the post
    if (existingPost.authorId !== userId) {
      return res.status(403).json({
        message: "You do not have permission to delete this post",
      });
    }

    // Delete all comments for this post first
    await prisma.comment.deleteMany({
      where: { postId: postId },
    });

    // Then delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    // Invalidate relevant caches
    postsCache.del("all_posts");
    postsCache.del(`user_posts_${userId}`);
    postsCache.del(`post_detail_${postId}`);

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

// Regular post creation without authentication
router.post("/", async (req, res) => {
  try {
    const { title, content, authorId, published = false } = req.body;

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        published: Boolean(published),
      },
    });

    // Invalidate cache after adding new post
    postsCache.del("all_posts");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        authorId: newPost.authorId,
        published: newPost.published,
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
