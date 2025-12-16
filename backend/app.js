import express from "express";
import cors from "cors";

import questRoutes from "./routes/questRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

/**
 * CORS
 * - Allows localhost for dev
 * - Allows ANY Vercel subdomain for prod
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || // allow server-to-server & Postman
        origin === "http://localhost:5173" ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// MUST be before routes
app.use(express.json());

/**
 * Root route (nice for Render + sanity checks)
 */
app.get("/", (req, res) => {
  res.send("QuestEats API is running 🚀  Try /api/health");
});

/**
 * Health check (Render-friendly)
 */
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

/**
 * API routes
 */
app.use("/api/quests", questRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

export default app;
