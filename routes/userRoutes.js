// src/routes/userRoutes.js
import express from "express";
import {
  getMe,
  getPreferences,
  updatePreferences,
  getProfile,
} from "../controllers/userController.js";

const router = express.Router();

// TEMP: using ?userId= until you have real auth
router.get("/me", getMe);
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);
router.get("/profile", getProfile);

export default router;
