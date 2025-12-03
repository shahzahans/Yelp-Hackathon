// src/services/questService.js
import { Quest } from "../models/Quest.js";

export async function maybeGenerateQuestFromIntent(intent, restaurants, user) {
  if (!restaurants || restaurants.length === 0) return null;

  const steps = restaurants.slice(0, 3).map((r, idx) => ({
    order: idx,
    yelpBusinessId: r.id,
    name: r.name,
    address: r.location?.display_address?.join(", "),
    notes: idx === 0 ? "Start here!" : undefined,
    photoUrl: r.image_url,
  }));

  const quest = await Quest.create({
    title: `${intent.mood ?? "Epic"} ${intent.cuisines?.[0] ?? "food"} quest`,
    subtitle: "AI-generated quest based on your vibe",
    description: "Follow these stops for a curated food adventure.",
    city: intent.city,
    country: intent.country,
    moodTag: intent.mood,
    cuisineTags: intent.cuisines,
    difficulty: "easy",
    steps,
    createdBy: user?._id,
    source: "ai_generated",
    isFeatured: false,
  });

  return quest;
}
