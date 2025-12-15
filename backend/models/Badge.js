// models/Badge.js
import mongoose from "mongoose";

const badgeCriteriaSchema = new mongoose.Schema(
  {
    // simple engine: trigger when some stat hits a threshold
    type: {
      type: String,
      enum: [
        "quests_completed",
        "restaurants_visited",
        "cuisine_explorer",
        "city_explorer",
        "streak_days",
      ],
      required: true,
    },
    threshold: { type: Number, required: true }, // e.g. 5 quests completed
    metadata: { type: mongoose.Schema.Types.Mixed }, // extra info (like which cuisine)
  },
  { _id: false }
);

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },

    iconUrl: { type: String },

    criteria: badgeCriteriaSchema,

    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "legendary"],
      default: "common",
    },

    xpReward: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// KEEP all your schema code above the same...

const Badge = mongoose.model("Badge", badgeSchema);

export { Badge };
export default Badge;

