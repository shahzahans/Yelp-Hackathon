// src/services/yelpService.js
import axios from "axios";

const YELP_API_KEY = process.env.YELP_API_KEY;
const YELP_BASE_URL = "https://api.yelp.com/v3";

const yelpClient = axios.create({
  baseURL: YELP_BASE_URL,
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`,
  },
});

export async function searchRestaurantsFromIntent(intent) {
  const { cuisines, priceRange, city } = intent;

  const params = {
    term: cuisines?.join(" ") || "food",
    location: city || "Seattle",
    limit: 10,
    price: priceRange ? priceRange.length : undefined, // rough mapping: "$$" → 2
  };

  const res = await yelpClient.get("/businesses/search", { params });
  return res.data.businesses || [];
}
