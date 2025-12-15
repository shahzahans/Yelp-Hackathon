// backend/services/yelpAiService.js

const YELP_AI_URL = "https://api.yelp.com/ai/chat/v2";

export async function yelpAiChat({ query, chat_id = null, user_context, request_context }) {
  const apiKey = process.env.YELP_API_KEY;
  if (!apiKey) throw new Error("Missing YELP_API_KEY in .env");

  const body = {
    query,
    ...(chat_id ? { chat_id } : {}),
    ...(user_context ? { user_context } : {}),
    request_context: request_context ?? { skip_text_generation: false },
  };

  const resp = await fetch(YELP_AI_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error?.description || data?.error?.code || "Yelp AI API error");
  }
  return data;
}

