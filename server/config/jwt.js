// JWT configuration

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "your-secret-key", // Use environment variable in production
  accessTokenExpiry: "15m", // 15 minutes
  refreshTokenExpiry: "7d", // 7 days
};
