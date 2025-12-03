const axios = require("axios");

const yelpClient = axios.create({
  baseURL: "https://api.yelp.com/v3",
  headers: {
    Authorization: `Bearer ${process.env.YELP_API_KEY}`,
  },
});

// Simple helper to search restaurants
async function searchRestaurants({ term, location, limit = 10 }) {
  const response = await yelpClient.get("/businesses/search", {
    params: { term, location, limit },
  });
  return response.data;
}

module.exports = { searchRestaurants };
