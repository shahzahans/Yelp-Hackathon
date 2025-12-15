// seed.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Quest } from "./models/Quest.js";
import { Badge } from "./models/Badge.js";

async function main() {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Promise.all([User.deleteMany({}), Quest.deleteMany({}), Badge.deleteMany({})]);

    console.log("Creating badges...");
    const badges = await Badge.insertMany([
      {
        name: "First Quest",
        slug: "first-quest",
        description: "Complete your first QuestEats quest.",
        criteria: { type: "quests_completed", threshold: 1 },
        rarity: "common",
      },
      {
        name: "Spice Seeker",
        slug: "spice-seeker",
        description: "Finish a spicy-themed quest.",
        criteria: {
          type: "cuisine_explorer",
          threshold: 3,
          metadata: { cuisine: "spicy" },
        },
        rarity: "uncommon",
      },
    ]);

    console.log("Creating sample quests...");
    const quests = await Quest.insertMany([
      {
        title: "Comfort Ramen Crawl",
        subtitle: "Slurp your way through cozy noodle spots.",
        description: "A warm, comforting ramen quest for chilly evenings.",
        city: "Seattle",
        country: "US",
        moodTag: "comfort",
        cuisineTags: ["ramen", "japanese"],
        difficulty: "easy",
        estimatedDurationMinutes: 90,
        steps: [
          {
            order: 0,
            yelpBusinessId: "fake-id-ramen-1",
            name: "Ramen House One",
            address: "123 Noodle St, Seattle, WA",
            notes: "Start with a classic tonkotsu.",
          },
          {
            order: 1,
            yelpBusinessId: "fake-id-ramen-2",
            name: "Ramen House Two",
            address: "456 Broth Ave, Seattle, WA",
            notes: "Try their spicy miso.",
          },
        ],
        isFeatured: true,
      },
      {
        title: "Spicy Street Food Adventure",
        subtitle: "For those who live for heat.",
        description: "Hit up some of the best spicy bites in town.",
        city: "Seattle",
        country: "US",
        moodTag: "adventurous",
        cuisineTags: ["thai", "korean", "bbq"],
        difficulty: "medium",
        estimatedDurationMinutes: 120,
        steps: [
          {
            order: 0,
            yelpBusinessId: "fake-id-spicy-1",
            name: "Bangkok Heat",
            address: "789 Chili Rd, Seattle, WA",
          },
          {
            order: 1,
            yelpBusinessId: "fake-id-spicy-2",
            name: "Seoul Fire",
            address: "321 Pepper Ln, Seattle, WA",
          },
        ],
      },
    ]);

    console.log("Creating demo user...");
    const demoUser = await User.create({
      name: "Demo User",
      email: "demo@example.com",
      city: "Seattle",
      country: "US",
      preferences: {
        favoriteCuisines: ["ramen", "thai"],
        preferredPriceRange: "$$",
        vibeTags: ["cozy", "spicy"],
        dietaryRestrictions: [],
      },
      badges: [badges[0]._id],
      stats: {
        questsCompleted: 1,
        totalBadgesEarned: 1,
        restaurantsVisited: 3,
        streakDays: 2,
      },
      questProgress: [
        {
          quest: quests[0]._id,
          currentStepIndex: 2,
          completedSteps: [0, 1],
          status: "completed",
          startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          completedAt: new Date(),
        },
      ],
    });

    console.log("Seed complete ✅");
    console.log("Demo user ID:", demoUser._id.toString());

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

main();
