import express from "express";
import cors from "cors";

import questRoutes from "./routes/questRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// CORS — supports localhost + ANY Vercel subdomain
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin === "http://localhost:5173" ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// IMPORTANT: must be BEFORE routes
app.use(express.json());

// Health check (Render-friendly)
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/quests", questRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

export default app;

