import User from "../models/User.js";


// helper until real auth middleware exists
function getUserIdFromRequest(req) {
  return req.query.userId; // /api/users/me?userId=...
}

export async function getMe(req, res) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(400).json({ error: "userId is required (temporary)" });

    const user = await User.findById(userId)
      .select("-__v")
      .populate("badges")
      .populate("questProgress.quest");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateMe(req, res) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(400).json({ error: "userId is required (temporary)" });

    const allowed = ["name", "username", "email", "city", "country", "preferences"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    })
      .select("-__v")
      .populate("badges")
      .populate("questProgress.quest");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// REST-style
export async function getProfile(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-__v")
      .populate("badges")
      .populate("questProgress.quest");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { id } = req.params;

    const allowed = ["name", "username", "email", "city", "country", "preferences", "badges", "questProgress"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-__v")
      .populate("badges")
      .populate("questProgress.quest");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
