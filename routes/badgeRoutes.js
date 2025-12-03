import express from "express";
import {
  listBadges,
  getBadgeById,
} from "../controllers/badgeController.js";

const router = express.Router();

router.get("/", listBadges);
router.get("/:id", getBadgeById);

export default router;
