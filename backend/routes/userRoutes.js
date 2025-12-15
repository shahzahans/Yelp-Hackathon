import { Router } from "express";
import { getMe, updateMe, getProfile, updateProfile } from "../controllers/userController.js";

const router = Router();

// temporary auth-less endpoints (use query userId)
router.get("/me", getMe);
router.put("/me", updateMe);

// normal REST endpoints
router.get("/:id", getProfile);
router.put("/:id", updateProfile);

export default router;
