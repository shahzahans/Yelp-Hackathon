// models/User.js
import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema(
  {
    // e.g. ['ramen', 'tacos', 'fried chicken']
    favoriteCuisines: [{ type: String, trim: true }],
    // Yelp-style: $, $$, $$$, $$$$
    preferredPriceRange: {
      type: String,
      enum: ["$", "$$", "$$$", "$$$$"],
      default: "$$",
    },
    // e.g. ['spicy', 'cozy', 'late-night', 'dessert']
    vibeTags: [{ type: String, trim: true }],
    // dietary filters
    dietaryRestrictions: [{ type: String, trim: true }],
  },
  { _id: false }
);

const questProgressSchema = new mongoose.Schema(
  {
    quest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quest",
      required: true,
    },
    currentStepIndex: { type: Number, default: 0 },
    completedSteps: { type: [Number], default: [] }, // indices of finished steps
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { _id: false }
);

const userStatsSchema = new mongoose.Schema(
  {
    questsCompleted: { type: Number, default: 0 },
    totalBadgesEarned: { type: Number, default: 0 },
    restaurantsVisited: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // basic identity
    name: { type: String, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      sparse: true,
    },
    avatarUrl: { type: String },

    // auth info (simple for now)
    authProvider: {
      type: String,
      enum: ["magic_link", "google", "github", "anonymous"],
      default: "anonymous",
    },
    authProviderId: { type: String },

    // location for Yelp search
    city: { type: String, trim: true },
    country: { type: String, trim: true },

    preferences: preferenceSchema,

    // progression
    questProgress: [questProgressSchema], // active + past
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],

    stats: userStatsSchema,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

