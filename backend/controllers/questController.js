// src/controllers/questController.js
import mongoose from "mongoose";
import { Quest } from "../models/Quest.js";
import User from "../models/User.js";


function getUserIdFromRequest(req) {
  return req.query.userId;
}

export const listQuests = async (req, res) => {
  try {
    const { city, featured, cuisine, mood } = req.query;

    const filter = { isActive: true };
    if (city) filter.city = city;
    if (featured === "true") filter.isFeatured = true;
    if (cuisine) filter.cuisineTags = cuisine;
    if (mood) filter.moodTag = mood;

    const quests = await Quest.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(30)
      .lean();

    res.json(quests);
  } catch (err) {
    console.error("listQuests error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getQuestById = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id).lean();
    if (!quest) return res.status(404).json({ error: "Quest not found" });

    res.json(quest);
  } catch (err) {
    console.error("getQuestById error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const joinQuest = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const questId = req.params.id;

    if (!userId) return res.status(400).json({ error: "userId is required (temporary)" });

    const [user, quest] = await Promise.all([
      User.findById(userId),
      Quest.findById(questId),
    ]);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!quest) return res.status(404).json({ error: "Quest not found" });

    const existing = user.questProgress.find(
      (qp) => qp.quest.toString() === questId
    );
    if (existing && existing.status === "in_progress") {
      return res.json({ message: "Quest already in progress", questProgress: existing });
    }

    const progress = {
      quest: new mongoose.Types.ObjectId(questId),
      currentStepIndex: 0,
      completedSteps: [],
      status: "in_progress",
      startedAt: new Date(),
    };

    user.questProgress.push(progress);
    quest.timesStarted += 1;

    await Promise.all([user.save(), quest.save()]);

    res.status(201).json({ message: "Joined quest", questProgress: progress });
  } catch (err) {
    console.error("joinQuest error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const completeQuestStep = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const questId = req.params.id;
    const { stepIndex } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required (temporary)" });
    if (typeof stepIndex !== "number")
      return res.status(400).json({ error: "stepIndex (number) is required" });

    const [user, quest] = await Promise.all([
      User.findById(userId),
      Quest.findById(questId),
    ]);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!quest) return res.status(404).json({ error: "Quest not found" });

    const progress = user.questProgress.find(
      (qp) => qp.quest.toString() === questId
    );
    if (!progress) return res.status(404).json({ error: "Quest not joined yet" });

    if (!progress.completedSteps.includes(stepIndex)) {
      progress.completedSteps.push(stepIndex);
    }

    // move currentStepIndex forward if needed
    if (stepIndex >= progress.currentStepIndex) {
      progress.currentStepIndex = stepIndex + 1;
    }

    const totalSteps = quest.steps.length;
    const uniqueCompletedCount = new Set(progress.completedSteps).size;

    if (uniqueCompletedCount >= totalSteps) {
      progress.status = "completed";
      progress.completedAt = new Date();
      quest.timesCompleted += 1;

      // quick stat bump
      user.stats.questsCompleted = (user.stats.questsCompleted || 0) + 1;
    }

    await Promise.all([user.save(), quest.save()]);

    res.json({
      message: "Step updated",
      questProgress: progress,
      isQuestCompleted: progress.status === "completed",
    });
  } catch (err) {
    console.error("completeQuestStep error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
