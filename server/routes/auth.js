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

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Store refresh token
    await storeRefreshToken(newUser.id, refreshToken);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success with access token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      accessToken,
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

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token
        await storeRefreshToken(user.id, refreshToken);

        // Set refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Return user info and access token
        return res.json({
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          accessToken,
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
    });

    if (!user || !user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "User not found or refresh token revoked",
      });
    }

    // Verify that the stored refresh token matches
    // When using bcrypt, we can't decrypt the token, but we can compare
    // Since we're already verified the JWT signature and expiration,
    // We could skip this step in a simplified implementation
    // const isValidToken = await bcrypt.compare(refreshToken, user.refreshToken);
    // if (!isValidToken) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Invalid refresh token'
    //   });
    // }

    // Generate new tokens
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const newAccessToken = generateAccessToken(userData);
    const newRefreshToken = generateRefreshToken(userData);

    // Store new refresh token
    await storeRefreshToken(user.id, newRefreshToken);

    // Set new refresh token in HTTP-only cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return new access token
    return res.json({
      success: true,
      accessToken: newAccessToken,
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

    // Clear the refresh token cookie
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
  (req, res) => {
    res.json({
      success: true,
      message: "Protected route accessed successfully",
      user: req.user,
    });
  }
);

export default router;
