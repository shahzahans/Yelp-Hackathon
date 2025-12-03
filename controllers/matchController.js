// src/controllers/matchController.js
import { Match } from "../models/Match.js";
import { User } from "../models/User.js";
import { generateIntentFromText } from "../services/aiService.js";
import { searchRestaurantsFromIntent } from "../services/yelpService.js";
import { maybeGenerateQuestFromIntent } from "../services/questService.js";

function getUserIdFromRequest(req) {
  return req.query.userId;
}

export const createMatch = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { mode = "mood", text, location } = req.body; // mode: "mood" or "craving"

    if (!text) return res.status(400).json({ error: "text is required" });
    if (!["mood", "craving"].includes(mode))
      return res.status(400).json({ error: "mode must be 'mood' or 'craving'" });

    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }

    // 1) AI: interpret the text → intent
    const intent = await generateIntentFromText({
      text,
      userPreferences: user?.preferences,
      locationOverride: location,
    });
    // expected intent shape example:
    // { mood: "comfort", cuisines: ["ramen"], priceRange: "$$", vibeTags: ["cozy"], city: "Seattle" }

    // 2) Yelp: find restaurants
    const restaurants = await searchRestaurantsFromIntent(intent);

    // 3) Optionally auto-generate a mini quest (3–4 stops)
    const generatedQuest = await maybeGenerateQuestFromIntent(intent, restaurants, user);

    // 4) Save Match document (history)
    const match = await Match.create({
      user: user?._id,
      mode,
      queryText: text,
      interpretedIntent: intent,
      restaurants: restaurants.map((r) => ({
        yelpBusinessId: r.id,
        name: r.name,
        address: r.location?.display_address?.join(", "),
        imageUrl: r.image_url,
        url: r.url,
      })),
      generatedQuest: generatedQuest?._id,
    });

    res.status(201).json({
      matchId: match._id,
      intent,
      restaurants,
      quest: generatedQuest || null,
    });
  } catch (err) {
    console.error("createMatch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
