import mongoose from "mongoose";

const questProgressSchema = new mongoose.Schema(
  {
    quest: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", required: true },

    currentStepIndex: { type: Number, default: 0 },
    completedSteps: [{ type: Number }],

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },

    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    username: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },

    city: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },

    preferences: {
      favoriteCuisines: [{ type: String, trim: true }],
      preferredPriceRange: { type: String, trim: true, default: "" },
      vibeTags: [{ type: String, trim: true }],
      dietaryRestrictions: [{ type: String, trim: true }],
    },

    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],

    stats: {
      questsCompleted: { type: Number, default: 0 },
      totalBadgesEarned: { type: Number, default: 0 },
      restaurantsVisited: { type: Number, default: 0 },
      streakDays: { type: Number, default: 0 },
    },

    questProgress: [questProgressSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User };
export default User;
