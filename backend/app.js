import express from "express";
import cors from "cors";

import questRoutes from "./routes/questRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json()); // IMPORTANT: must be BEFORE routes

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/quests", questRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes); 

export default app;
