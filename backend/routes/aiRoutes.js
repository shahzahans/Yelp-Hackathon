import { Router } from "express";
import { chat, generateQuest } from "../controllers/aiController.js";

const router = Router();

// already working:
router.post("/chat", chat);

// new:
router.post("/generate-quest", generateQuest);

export default router;
    
