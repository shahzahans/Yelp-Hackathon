import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://*.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// routes
app.use("/api/quests", questRoutes);
app.use("/api/users", userRoutes);

export default app;
