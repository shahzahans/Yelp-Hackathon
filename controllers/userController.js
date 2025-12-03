// src/controllers/userController.js
import { User } from "../models/User.js";
import { Quest } from "../models/Quest.js";
import { Badge } from "../models/Badge.js";

// Helper until you have auth middleware
function getUserIdFromRequest(req) {
  // later: const userId = req.user.id
  return req.query.userId; // /api/user/me?userId=...
}

export const getMe = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(400).json({ error: "userId is required (temporary)" });

    const user = await User.findById(userId).select("-__v");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPreferences = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(400).json({ error: "userId is required (temporary)" });

    const user = await User.findById(userId).select("preferences");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.preferences || {});
  } catch (err) {
    console.error("getPreferences error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(400).json({ error: "userId is required (temporary)" });

    const { favoriteCuisines, preferredPriceRange, vibeTags, dietaryRestrictions } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.preferences = {
      ...user.preferences?.toObject(),
      ...(favoriteCuisines && { favoriteCuisines }),
      ...(preferredPriceRange && { preferredPriceRange }),
      ...(vibeTags && { vibeTags }),
      ...(dietaryRestrictions && { dietaryRestrictions }),
    };

    await user.save();
    res.json({ message: "Preferences updated", preferences: user.preferences });
  } catch (err) {
    console.error("updatePreferences error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(400).json({ error: "userId is required (temporary)" });

    const user = await User.findById(userId)
      .populate("badges")
      .populate("questProgress.quest")
      .lean();

    if (!user) return res.status(404).json({ error: "User not found" });

    const completedQuests =
      user.questProgress?.filter((qp) => qp.status === "completed") || [];

    const profile = {
      name: user.name,
      city: user.city,
      country: user.country,
      preferences: user.preferences,
      stats: {
        questsCompleted: user.stats?.questsCompleted ?? completedQuests.length,
        totalBadgesEarned: user.stats?.totalBadgesEarned ?? (user.badges?.length || 0),
        restaurantsVisited: user.stats?.restaurantsVisited ?? 0,
        streakDays: user.stats?.streakDays ?? 0,
      },
      recentQuests: completedQuests
        .slice(-5)
        .map((qp) => ({
          questId: qp.quest?._id,
          title: qp.quest?.title,
          completedAt: qp.completedAt,
        })),
      badges: (user.badges || []).map((b) => ({
        id: b._id,
        name: b.name,
        description: b.description,
        iconUrl: b.iconUrl,
        rarity: b.rarity,
      })),
    };

    res.json(profile);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
