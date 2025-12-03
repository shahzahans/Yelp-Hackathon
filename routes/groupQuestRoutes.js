import express from "express";
import {
  createGroupQuest,
  joinGroupQuest,
  listGroupQuests,
  completeGroupQuest,
} from "../controllers/groupQuestController.js";

const router = express.Router();

router.get("/", listGroupQuests);
router.post("/create", createGroupQuest);
router.post("/join", joinGroupQuest);
router.post("/:groupId/complete", completeGroupQuest);

export default router;

