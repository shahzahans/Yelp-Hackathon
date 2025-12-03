// src/services/aiService.js
export async function generateIntentFromText({ text, userPreferences, locationOverride }) {
  // TODO: call OpenAI here – for now, mock something
  return {
    mood: "comfort",
    cuisines: ["ramen"],
    priceRange: "$$",
    vibeTags: ["cozy"],
    city: locationOverride?.city || "Seattle",
    country: "US",
  };
}
