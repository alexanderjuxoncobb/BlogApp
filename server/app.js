// server/app.js - FIXED
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173", // Regular client URL
    process.env.ADMIN_CLIENT_URL || "http://localhost:5174", // Admin client URL
  ],
  credentials: true, // Allow cookies to be sent with requests
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/", routes);

// Serve admin and user clients from different directories in production
if (process.env.NODE_ENV === "production") {
  // Serve the regular user client
  app.use(express.static(join(__dirname, "../client-user/dist")));

  // Serve the admin client on a specific route
  app.use("/admin", express.static(join(__dirname, "../client-admin/dist")));

  // Handle client-side routing for admin client - simplified approach
  app.get("/admin*:rest", (req, res) => {
    res.sendFile(join(__dirname, "../client-admin/dist/index.html"));
  });

  // Handle client-side routing for regular client - catch-all route
  app.get("*:rest", (req, res) => {
    res.sendFile(join(__dirname, "../client-user/dist/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
