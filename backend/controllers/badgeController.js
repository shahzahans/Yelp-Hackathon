// controllers/badgeController.js
import Badge from "../models/Badge.js";

export const listBadges = async (req, res) => {
  try {
    const badges = await Badge.find().lean();
    res.json(badges);
  } catch (err) {
    console.error("listBadges error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id).lean();
    if (!badge) return res.status(404).json({ error: "Badge not found" });
    res.json(badge);
  } catch (err) {
    console.error("getBadgeById error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
