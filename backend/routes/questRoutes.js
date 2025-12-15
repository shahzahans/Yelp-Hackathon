import { Router } from "express";
import {
  listQuests,
  getQuestById,
  joinQuest,
  completeQuestStep,
} from "../controllers/questController.js";

const router = Router();

router.get("/", listQuests);
router.get("/:id", getQuestById);
router.post("/:id/join", joinQuest);
router.post("/:id/complete-step", completeQuestStep);

export default router;
