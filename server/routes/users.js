import express from "express";
import prisma from "../utils/prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    console.log(users[0]);
    res.json({ message: "Here is the first user:", users: users[0].email });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
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
