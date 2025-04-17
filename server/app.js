// server/app.js
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
const PORT = process.env.PORT || 8080;

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

// API Routes - Define API routes before static file handling
app.use("/auth", authRoutes);
app.use("/", routes);

// Static file serving in production
if (process.env.NODE_ENV === "production") {
  // Serve the regular user client
  app.use(express.static(join(__dirname, "../client-user/dist")));

  // Serve the admin client assets - make sure this has higher precedence
  app.use(
    "/admin",
    express.static(join(__dirname, "../client-admin/dist"), {
      setHeaders: (res, path) => {
        // Set correct MIME types for JavaScript files
        if (path.endsWith(".js")) {
          res.set("Content-Type", "application/javascript");
        }
      },
    })
  );

  // AFTER static file middleware, handle client-side routing

  // Handle client-side routing for admin paths EXCEPT asset requests
  app.get(/^\/admin(?:\/(?!assets\/).*)?\/?$/, (req, res) => {
    res.sendFile(join(__dirname, "../client-admin/dist/index.html"));
  });

  // Handle client-side routing for regular client
  // Avoid matching paths that should be handled by API or admin routes
  app.get(/^(?!\/admin)(?!\/auth)(?!\/api)(?:\/.*)?$/, (req, res) => {
    res.sendFile(join(__dirname, "../client-user/dist/index.html"));
  });
}

// 404 handler for asset requests that weren't found
app.use((req, res, next) => {
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
    console.log(`404 for asset: ${req.path}`);
    return res.status(404).send("Asset not found");
  }
  next();
});

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
