// src/routes/questRoutes.js
import express from "express";
import {
  listQuests,
  getQuestById,
  joinQuest,
  completeQuestStep,
} from "../controllers/questController.js";

const router = express.Router();

router.get("/", listQuests);
router.get("/:id", getQuestById);
router.post("/:id/join", joinQuest);
router.post("/:id/complete-step", completeQuestStep);

export default router;
