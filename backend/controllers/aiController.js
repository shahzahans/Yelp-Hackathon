// controllers/aiController.js
import { Quest } from "../models/Quest.js";

const YELP_AI_URL = "https://api.yelp.com/ai/chat/v2";

/**
 * POST /api/ai/chat
 * Body: { query: string }
 */
export const chat = async (req, res) => {
  try {
    const query = (req.body?.query || "").trim();
    if (!query) return res.status(400).json({ error: "query is required" });

    const r = await fetch(YELP_AI_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        request_context: { skip_text_generation: false },
      }),
    });

    const data = await r.json().catch(() => null);

    if (!r.ok) {
      return res.status(r.status).json(
        data ?? { error: "Yelp AI request failed", status: r.status }
      );
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "AI chat failed", details: err.message });
  }
};

/**
 * POST /api/ai/generate-quest
 * Body: { query: string, city?: string, country?: string }
 */
export const generateQuest = async (req, res) => {
  try {
    const query = (req.body?.query || "").trim();
    const city = (req.body?.city || "Seattle").trim();
    const country = (req.body?.country || "US").trim();

    if (!query) return res.status(400).json({ error: "query is required" });

    // 1) Call Yelp AI
    const r = await fetch(YELP_AI_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        request_context: { skip_text_generation: false },
      }),
    });

    const data = await r.json().catch(() => null);

    if (!r.ok) {
      return res.status(r.status).json(
        data ?? { error: "Yelp AI request failed", status: r.status }
      );
    }

    // 2) Extract businesses
    const businesses = data?.entities?.[0]?.businesses ?? [];
    if (businesses.length === 0) {
      return res.status(404).json({ error: "No businesses returned from Yelp AI" });
    }

    // ✅ Reuse existing quest (prevents duplicates)
    const existing = await Quest.findOne({
      title: `AI Quest: ${query}`,
      city,
      country,
      source: "ai",
    });

    if (existing) {
      return res.status(200).json({
        quest: existing,
        ai: {
          chat_id: data?.chat_id,
          text: data?.response?.text,
        },
        reused: true,
      });
    }

    // very simple keyword tagging (you can improve later)
    const q = query.toLowerCase();

    const cuisineTags = [];
    if (q.includes("pizza")) cuisineTags.push("pizza");
    if (q.includes("ramen")) cuisineTags.push("ramen");
    if (q.includes("tacos")) cuisineTags.push("tacos");
    if (q.includes("sushi")) cuisineTags.push("sushi");
    if (q.includes("bbq")) cuisineTags.push("bbq");
    if (q.includes("thai")) cuisineTags.push("thai");
    if (q.includes("korean")) cuisineTags.push("korean");
    if (q.includes("burger")) cuisineTags.push("burgers");
    if (q.includes("coffee")) cuisineTags.push("coffee");

    if (cuisineTags.length === 0) cuisineTags.push("food");

    const moodTag =
      q.includes("date") ? "date-night" :
      q.includes("cheap") ? "budget" :
      q.includes("spicy") ? "spicy" :
      "explore";

    // 3) Convert businesses -> Quest steps
    const steps = businesses.slice(0, 5).map((b, idx) => ({
      order: idx,
      yelpBusinessId: b.id,
      name: b.name,
      address: b.location?.formatted_address || "",
      notes: `Stop #${idx + 1}: try their top-rated item.`,
    }));

    // 4) Create Quest doc
    const questDoc = await Quest.create({
      title: `AI Quest: ${query}`,
      subtitle: `Generated quest for ${city}`,
      description: data?.response?.text || "AI-generated quest",
      city,
      country,
      moodTag,
      cuisineTags,
      difficulty: "easy",
      estimatedDurationMinutes: 120,
      steps,
      source: "ai",
      isFeatured: false,
      isActive: true,
    });

    return res.status(201).json({
      quest: questDoc,
      ai: {
        chat_id: data?.chat_id,
        text: data?.response?.text,
      },
      reused: false,
    });
  } catch (err) {
    return res.status(500).json({ error: "Generate quest failed", details: err.message });
  }
};

