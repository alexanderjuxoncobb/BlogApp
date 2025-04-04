import express from "express";
import prisma from "../utils/prisma.js";
import { usersCache } from "../utils/cache.js";

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

router.delete("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    // Invalidate cache after deletion
    usersCache.del("all_users");

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Note: In production, you should hash passwords
      },
    });

    // Invalidate cache after adding new user
    usersCache.del("all_users");

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
});

export default router;
