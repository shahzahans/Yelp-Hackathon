// models/Quest.js
import mongoose from "mongoose";

/**
 * Individual restaurant step inside a quest
 */
const questStepSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true, // 0,1,2,...
      min: 0,
    },

    // Yelp data (cached so UI doesn’t always re-hit Yelp)
    yelpBusinessId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    // Optional extras
    notes: {
      type: String,
      trim: true, // e.g. "Try their spicy miso ramen"
    },

    photoUrl: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Main Quest schema
 */
const questSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Location
    city: {
      type: String,
      trim: true,
      required: true,
    },

    country: {
      type: String,
      trim: true,
      required: true,
    },

    // Discovery & filtering
    moodTag: {
      type: String,
      trim: true,
      default: "",
    },

    cuisineTags: [
      {
        type: String,
        trim: true,
      },
    ],

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    estimatedDurationMinutes: {
      type: Number,
      default: 90,
      min: 10,
    },

    // Restaurants / steps
    steps: {
      type: [questStepSchema],
      required: true,
      validate: {
        validator: (steps) => steps.length > 0,
        message: "A quest must have at least one step",
      },
    },

    // Who created it
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // system / AI quests
    },

    source: {
      type: String,
      enum: ["system", "ai", "user"],
      default: "system",
    },

    // UI flags
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Reward
    badgeReward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
    },

    // Analytics
    timesStarted: {
      type: Number,
      default: 0,
      min: 0,
    },

    timesCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Quest = mongoose.model("Quest", questSchema);

export { Quest };
export default Quest;
