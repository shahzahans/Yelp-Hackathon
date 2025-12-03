import { GroupQuest } from "../models/GroupQuest.js";
import { Quest } from "../models/Quest.js";
import { User } from "../models/User.js";
import crypto from "crypto";

function uid() {
  return crypto.randomBytes(4).toString("hex");
}

function getUserId(req) {
  return req.query.userId;
}

export const createGroupQuest = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { questId } = req.body;

    if (!userId || !questId) {
      return res.status(400).json({ error: "userId and questId are required" });
    }

    const quest = await Quest.findById(questId);
    if (!quest) return res.status(404).json({ error: "Quest not found" });

    const group = await GroupQuest.create({
      quest: questId,
      host: userId,
      members: [userId],
      inviteCode: uid(),
      status: "pending",
    });

    res.status(201).json(group);
  } catch (err) {
    console.error("createGroupQuest error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const joinGroupQuest = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { inviteCode } = req.body;

    if (!inviteCode || !userId)
      return res.status(400).json({ error: "inviteCode and userId required" });

    const group = await GroupQuest.findOne({ inviteCode });
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
    }

    group.status = "active";
    group.startedAt = group.startedAt ?? new Date();

    await group.save();

    res.json(group);
  } catch (err) {
    console.error("joinGroupQuest error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const listGroupQuests = async (req, res) => {
  try {
    const userId = getUserId(req);

    const groups = await GroupQuest.find({
      members: userId,
    })
      .populate("quest")
      .populate("members")
      .populate("host");

    res.json(groups);
  } catch (err) {
    console.error("listGroupQuests error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const completeGroupQuest = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { groupId } = req.params;

    const group = await GroupQuest.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.members.includes(userId))
      return res.status(403).json({ error: "Not a group member" });

    group.status = "completed";
    group.completedAt = new Date();

    await group.save();

    res.json({ message: "Group quest completed", group });
  } catch (err) {
    console.error("completeGroupQuest error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
