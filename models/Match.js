// models/Match.js
import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    mode: { type: String, enum: ["mood", "craving"], required: true },
    queryText: { type: String, required: true },

    interpretedIntent: {
      mood: { type: String },
      cuisines: [{ type: String }],
      priceRange: { type: String },
      vibeTags: [{ type: String }],
    },

    // restaurants returned from Yelp
    restaurants: [
      {
        yelpBusinessId: { type: String, required: true },
        name: { type: String },
        address: { type: String },
        imageUrl: { type: String },
        url: { type: String },
      },
    ],

    // maybe connect a generated quest
    generatedQuest: { type: mongoose.Schema.Types.ObjectId, ref: "Quest" },
  },
  { timestamps: true }
);

export const Match = mongoose.model("Match", matchSchema);
