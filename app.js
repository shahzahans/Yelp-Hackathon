// app.js
import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import questRoutes from "./routes/questRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import groupQuestRoutes from "./routes/groupQuestRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "QuestEats backend is running 🚀" });
});

app.use("/api/user", userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/group-quests", groupQuestRoutes);

export default app;
