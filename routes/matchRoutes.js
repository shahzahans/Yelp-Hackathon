// src/routes/matchRoutes.js
import express from "express";
import { createMatch } from "../controllers/matchController.js";

const router = express.Router();

// POST /api/match
router.post("/", createMatch);

export default router;
