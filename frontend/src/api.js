// API service layer for QuestEats backend
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;


// Demo user ID (in production, this would come from auth)
const DEMO_USER_ID = "6940197e276a67b1c6b74b69";

// Helper function for fetch calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

// ========== AI Endpoints ==========
export const ai = {
  chat: async (query) => {
    return apiCall("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },

  generateQuest: async (query, city = "Seattle") => {
    return apiCall("/ai/generate-quest", {
      method: "POST",
      body: JSON.stringify({ query, city }),
    });
  },
};

// ========== Quest Endpoints ==========
export const quests = {
  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append("city", filters.city);
    if (filters.cuisine) params.append("cuisine", filters.cuisine);
    if (filters.mood) params.append("mood", filters.mood);
    if (filters.featured) params.append("featured", "true");

    const query = params.toString() ? `?${params.toString()}` : "";
    return apiCall(`/quests${query}`);
  },

  getById: async (questId) => {
    return apiCall(`/quests/${questId}`);
  },

  join: async (questId, userId = DEMO_USER_ID) => {
    return apiCall(`/quests/${questId}/join?userId=${userId}`, {
      method: "POST",
    });
  },

  completeStep: async (questId, stepIndex, userId = DEMO_USER_ID) => {
    return apiCall(`/quests/${questId}/complete-step?userId=${userId}`, {
      method: "POST",
      body: JSON.stringify({ stepIndex }),
    });
  },
};

// ========== Badge Endpoints ==========
export const badges = {
  list: async () => {
    return apiCall("/badges");
  },

  getById: async (badgeId) => {
    return apiCall(`/badges/${badgeId}`);
  },
};

// ========== User Endpoints ==========
export const users = {
  getMe: async (userId = DEMO_USER_ID) => {
    return apiCall(`/users/me?userId=${userId}`);
  },

  getProfile: async (userId = DEMO_USER_ID) => {
    return apiCall(`/users/${userId}`);
  },

  updateMe: async (updates, userId = DEMO_USER_ID) => {
    return apiCall(`/users/me?userId=${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },
};

// ========== Health Check ==========
export const health = {
  check: async () => {
    return apiCall("/health");
  },
};

// Export demo user ID for components that need it
export { DEMO_USER_ID };
