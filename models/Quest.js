// models/Quest.js
import mongoose from "mongoose";

const questStepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true }, // 0,1,2,...
    // Yelp data (cache important bits so UI doesn’t always re-hit Yelp)
    yelpBusinessId: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String },
    // optional extras
    notes: { type: String }, // e.g. "Try their spicy miso ramen"
    photoUrl: { type: String },
  },
  { _id: false }
);

const questSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true }, // tagline shown on cards
    description: { type: String, trim: true },

    city: { type: String, trim: true }, // main city this quest is for
    country: { type: String, trim: true },

    // For filtering in the quest browser
    moodTag: { type: String, trim: true }, // e.g. "comfort", "spicy adventure"
    cuisineTags: [{ type: String, trim: true }], // ['ramen', 'bbq']
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    estimatedDurationMinutes: { type: Number, default: 90 },

    // Steps = restaurants
    steps: { type: [questStepSchema], required: true },

    // who created it
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null/system for pre-seeded
    source: {
      type: String,
      enum: ["system", "ai_generated", "user_generated"],
      default: "system",
    },

    // UI flags
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Reward for completing
    badgeReward: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },

    // analytics-ish
    timesStarted: { type: Number, default: 0 },
    timesCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Quest = mongoose.model("Quest", questSchema);

