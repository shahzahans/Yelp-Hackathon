// server.js
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";

// Connect to MongoDB
await connectDB();

// Start server
const PORT = process.env.PORT || 4000; // use 4000 since you were curling that
app.listen(PORT, () => {
  console.log(`QuestEats backend running on port ${PORT} 🚀`);
});
    