import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    console.log("Starting server...");
    await connectDB();
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`QuestEats backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

startServer();
