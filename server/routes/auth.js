import express from "express";
import passport from "passport";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
  storeRefreshToken,
  revokeRefreshToken,
} from "../services/authService.js";
import prisma from "../utils/prisma.js";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new user with default role USER
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Default role is USER
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Store refresh token
    await storeRefreshToken(newUser.id, refreshToken);

    // Set tokens in HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success with user data but no tokens in response body
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
});

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      try {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: info.message || "Authentication failed",
          });
        }

        // Get full user details including role
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        // Generate tokens with role info
        const accessToken = generateAccessToken(fullUser);
        const refreshToken = generateRefreshToken(fullUser);

        // Store refresh token
        await storeRefreshToken(fullUser.id, refreshToken);

        // Set tokens in HTTP-only cookies
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Determine redirect based on role
        const redirect = fullUser.role === "ADMIN" ? "/admin" : "/";

        // Return user info but no tokens in response body
        return res.json({
          success: true,
          message: "Login successful",
          user: {
            id: fullUser.id,
            name: fullUser.name,
            email: fullUser.email,
            role: fullUser.role,
          },
          redirect: redirect,
        });
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
});

// Refresh token route
router.post("/refresh-token", async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Get user from the token
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        refreshToken: true,
      },
    });

    if (!user || !user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "User not found or refresh token revoked",
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Store new refresh token
    await storeRefreshToken(user.id, newRefreshToken);

    // Set new tokens in HTTP-only cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success
    return res.json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh token",
      error: error.message,
    });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  console.log("i've been hit");
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Verify the token to get the user ID
      const decoded = verifyRefreshToken(refreshToken);

      if (decoded) {
        // Revoke the refresh token
        await revokeRefreshToken(decoded.sub);
      }
    }

    // Clear both cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error.message,
    });
  }
});

// Protected route example
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const postCount = await prisma.post.count({
      where: { authorId: req.user.id },
    });

    req.user.postCount = postCount;

    return res.json({
      success: true,
      message: "Protected route accessed successfully",
      user: req.user,
    });
  }
);

export default router;
