import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtConfig } from "../config/jwt.js";
import prisma from "../utils/prisma.js";

// Generate access token
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.accessTokenExpiry }
  );
};

// Generate refresh token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.refreshTokenExpiry }
  );
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Validate password against hashed version
export const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Store refresh token in database
export const storeRefreshToken = async (userId, token) => {
  try {
    // Hash the refresh token before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(token, salt);

    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedToken,
        updatedAt: new Date(),
      },
    });

    // Return success
    return true;
  } catch (error) {
    console.error("Error storing refresh token:", error);
    throw error;
  }
};

// Revoke refresh token
export const revokeRefreshToken = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: null,
      updatedAt: new Date(),
    },
  });

  // Return success
  return true;
};
