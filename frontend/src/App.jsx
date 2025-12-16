import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { ai, quests, badges, users, DEMO_USER_ID } from "./api";

// ==================== Landing Page ====================
function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page page--landing">
      <nav className="topbar-landing">
        <div className="logo" onClick={() => navigate("/")}>
          QuestEats
        </div>
      </nav>

      <header className="title">
        <div className="hero-left">
          <h1>
            Turn Every Meal Into An{" "}
            <span className="highlight">Adventure</span>
          </h1>

          <p className="subtitle">
            Stop stressing about where to eat. Let AI match your mood <br />
            with the perfect local spot and earn rewards along the way.
          </p>

          <div className="cta-row">
            <button
              onClick={() => navigate("/dashboard")}
              className="get-started-button"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <article className="step">
            <div className="step__icon">1</div>
            <h3>Share your mood</h3>
            <p>Tell us the vibe: cozy noodles, neon tacos, brunch with friends.</p>
          </article>

          <article className="step">
            <div className="step__icon">2</div>
            <h3>Get matched</h3>
            <p>Yelp AI pairs you with a balanced list of nearby spots.</p>
          </article>

          <article className="step">
            <div className="step__icon">3</div>
            <h3>Earn rewards</h3>
            <p>Clear quests, collect badges, and build your foodie streak.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

// ==================== Dashboard Page ====================
function DashboardPage() {
  const [mood, setMood] = useState("");
  const [location, setLocation] = useState("Seattle");
  const [restaurants, setRestaurants] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [questsList, setQuestsList] = useState([]);
  const [badgesList, setBadgesList] = useState([]);
  const [loadingQuests, setLoadingQuests] = useState(true);
  const [loadingBadges, setLoadingBadges] = useState(true);

  const navigate = useNavigate();

  // Load quests and badges on mount
  useEffect(() => {
    loadQuests();
    loadBadges();
  }, []);

  const loadQuests = async () => {
    try {
      setLoadingQuests(true);
      const data = await quests.list({ featured: false });
      setQuestsList(data.slice(0, 5)); // Show top 5
    } catch (err) {
      console.error("Failed to load quests:", err);
    } finally {
      setLoadingQuests(false);
    }
  };

  const loadBadges = async () => {
    try {
      setLoadingBadges(true);
      const data = await badges.list();
      setBadgesList(data);
    } catch (err) {
      console.error("Failed to load badges:", err);
    } finally {
      setLoadingBadges(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRestaurants([]);
    setAiResponse("");

    try {
      const query = location ? `${mood} in ${location}` : mood;
      const response = await ai.chat(query);

      setAiResponse(response.response?.text || "");
      const businesses = response.entities?.[0]?.businesses || [];
      setRestaurants(businesses);

      if (businesses.length === 0) {
        setError("No restaurants found. Try a different mood or location!");
      }
    } catch (err) {
      setError(err.message || "Failed to search. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuest = async () => {
    if (!mood) {
      alert("Please enter a mood or craving first!");
      return;
    }

    try {
      setLoading(true);
      const query = location ? `${mood} in ${location}` : mood;
      const response = await ai.generateQuest(query, location || "Seattle");

      if (response.quest) {
        alert(`Quest created: ${response.quest.title}!`);
        loadQuests(); // Reload quests to show new one
      }
    } catch (err) {
      alert(err.message || "Failed to generate quest. Please try again.");
      console.error("Quest generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <nav className="topbar-dashboard">
        <div className="logo" onClick={() => navigate("/")}>
          QuestEats
        </div>
        <button
          className="ghost"
          onClick={() => navigate(`/profile/${DEMO_USER_ID}`)}
        >
          Profile
        </button>
      </nav>

      <header className="hero">
        <div className="hero__content">
          <h1>What's Your Vibe?</h1>
          <p className="lede">
            Describe your mood, get AI-picked restaurants near you, and collect
            badges as you clear themed quests.
          </p>

          <form className="mood-form" onSubmit={handleSearch}>
            <div className="field">
              <label>Mood or craving</label>
              <input
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g. cozy rainy-day ramen, spicy tacos, brunch with friends"
                required
                disabled={loading}
              />
            </div>

            <div className="field">
              <label>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City name (e.g. Seattle, Portland)"
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Find my spots"}
            </button>
          </form>

          {error && (
            <div style={{ color: "#ff4444", marginTop: "1rem", padding: "1rem", background: "#fff", borderRadius: "8px" }}>
              {error}
            </div>
          )}

          {aiResponse && (
            <div className="aiResponse">
              <p className="aiResponse__text">{aiResponse}</p>
            </div>
          )}
          <div className="results-panel">
            <div className="results-head">
              <div>
                <p className="pill pill--muted" style={{ margin: 0 }}>Recommended</p>
                <h3 style={{ margin: "6px 0 4px" }}>Recommended Restaurants</h3>
                <p className="meta">Curated by AI from your vibe and location.</p>
              </div>
              {location && (
                <p className="meta" style={{ margin: 0, fontWeight: 700 }}>
                  {location}
                </p>
              )}
            </div>

            {loading && (
              <div className="results-grid">
                {[1, 2, 3].map((idx) => (
                  <div className="result-card result-card--skeleton" key={idx}>
                    <div className="result-media skeleton-block" />
                    <div className="result-body">
                      <div className="skeleton-line w-60" />
                      <div className="skeleton-line w-40" />
                      <div className="skeleton-tags">
                        <span className="skeleton-pill" />
                        <span className="skeleton-pill" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && restaurants.length === 0 && (
              <div className="results-empty">
                <p className="meta">Run a search to see AI-picked spots here.</p>
                <div className="tips">
                  <span className="pill pill--peach">Try: cozy ramen in Seattle</span>
                  <span className="pill pill--peach">Use a neighborhood</span>
                  <span className="pill pill--peach">Add a cuisine + vibe</span>
                </div>
              </div>
            )}

            {!loading && restaurants.length > 0 && (
              <div className="results-grid">
                {restaurants.map((restaurant) => {
                  const address =
                    restaurant.location?.formatted_address ||
                    restaurant.location?.display_address?.join(", ") ||
                    restaurant.address ||
                    "Address unavailable";
                  const category = restaurant.categories?.[0]?.title;
                  const rating = restaurant.rating || "New";
                  const price = restaurant.price || "";
                  const image = restaurant.image_url;
                  const fallback = restaurant.name ? restaurant.name.charAt(0) : "Q";

                  return (
                    <article className="result-card" key={restaurant.id || restaurant.url}>
                      <div className="result-body">
                        <div className="result-header">
                          <h4>{restaurant.name}</h4>
                          <div className="result-badges">
                            <span className="badge-chip">★ {rating}</span>
                            {price && <span className="badge-chip badge-chip--muted">{price}</span>}
                          </div>
                        </div>
                        <p className="result-meta">{address}</p>
                        <div className="result-tags">
                          {category && <span className="pill pill--muted">{category}</span>}
                          {restaurant.distance && (
                            <span className="pill pill--muted">
                              {(restaurant.distance / 1000).toFixed(1)} km away
                            </span>
                          )}
                        </div>
                        {restaurant.url && (
                          <a
                            className="ghost result-link"
                            href={restaurant.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on Yelp
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Quest Board</h2>
            </div>
            <button className="ghost" onClick={handleGenerateQuest} disabled={loading}>
              Generate with AI
            </button>
          </div>

          <div className="quests">
            {loadingQuests ? (
              <p style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
                Loading quests...
              </p>
            ) : questsList.length === 0 ? (
              <p style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
                No quests available. Generate one above!
              </p>
            ) : (
              questsList.map((quest) => (
                <article className="quest" key={quest._id}>
                  <div>
                    <p className="pill pill--muted">{quest.moodTag || "Quest"}</p>
                    <h3>{quest.title}</h3>
                    <p className="meta">{quest.steps?.length || 0} stops</p>
                  </div>
                  <button onClick={() => navigate(`/quest/${quest._id}`)}>
                    Open quest
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Badges</h2>
            </div>
            <button
              className="ghost"
              onClick={() => navigate(`/profile/${DEMO_USER_ID}`)}
            >
              View profile
            </button>
          </div>

          <div className="badges">
            {loadingBadges ? (
              <p style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
                Loading badges...
              </p>
            ) : badgesList.length === 0 ? (
              <p style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
                No badges available yet.
              </p>
            ) : (
              badgesList.map((badge) => (
                <div className="badge" key={badge._id}>
                  <div className="badge__icon" />
                  <div>
                    <p className="title">{badge.name}</p>
                    <p className="meta">{badge.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// ==================== Quest Detail Page ====================
function QuestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuest();
  }, [id]);

  const loadQuest = async () => {
    try {
      setLoading(true);
      const data = await quests.getById(id);
      setQuest(data);
    } catch (err) {
      setError(err.message || "Failed to load quest");
      console.error("Quest load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQuest = async () => {
    try {
      setJoining(true);
      await quests.join(id);
      alert("Quest joined successfully! Check your profile for progress.");
    } catch (err) {
      alert(err.message || "Failed to join quest");
      console.error("Join quest error:", err);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <nav className="topbar-dashboard">
          <div className="logo" onClick={() => navigate("/")}>
            QuestEats
          </div>
        </nav>
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p>Loading quest...</p>
        </div>
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="page">
        <nav className="topbar-dashboard">
          <div className="logo" onClick={() => navigate("/")}>
            QuestEats
          </div>
        </nav>
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p style={{ color: "#ff4444" }}>{error || "Quest not found"}</p>
          <button onClick={() => navigate("/dashboard")} style={{ marginTop: "1rem" }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <nav className="topbar-dashboard">
        <div className="logo" onClick={() => navigate("/")}>
          QuestEats
        </div>
        <button className="ghost" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span className="pill pill--muted" style={{ display: "inline-block", marginBottom: "1rem" }}>
            {quest.moodTag || "Quest"}
          </span>
          <h1 style={{ margin: "0 0 0.5rem 0" }}>{quest.title}</h1>
          {quest.subtitle && (
            <p style={{ fontSize: "1.1rem", color: "#666", margin: "0 0 1rem 0" }}>
              {quest.subtitle}
            </p>
          )}
          {quest.description && (
            <p style={{ color: "#666" }}>{quest.description}</p>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "8px", flex: "1", minWidth: "150px" }}>
            <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>
              Difficulty
            </div>
            <div style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {quest.difficulty || "Easy"}
            </div>
          </div>
          <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "8px", flex: "1", minWidth: "150px" }}>
            <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>
              Duration
            </div>
            <div style={{ fontWeight: "bold" }}>
              ~{quest.estimatedDurationMinutes || 90} min
            </div>
          </div>
          <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "8px", flex: "1", minWidth: "150px" }}>
            <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>
              Stops
            </div>
            <div style={{ fontWeight: "bold" }}>
              {quest.steps?.length || 0} locations
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: "1rem" }}>Quest Steps</h2>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
          {quest.steps?.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#5469d4",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  {step.order + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{step.name}</h3>
                  {step.address && (
                    <p style={{ margin: "0 0 0.5rem 0", color: "#666", fontSize: "0.9rem" }}>
                      📍 {step.address}
                    </p>
                  )}
                  {step.notes && (
                    <p style={{ margin: "0.5rem 0 0 0", color: "#666", fontSize: "0.9rem", fontStyle: "italic" }}>
                      {step.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleJoinQuest}
          disabled={joining}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            fontWeight: "bold",
            background: "#5469d4",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {joining ? "Joining..." : "Join Quest"}
        </button>
      </div>
    </div>
  );
}

// ==================== Profile Page ====================
function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await users.getProfile(id);
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to load profile");
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <nav className="topbar-dashboard">
          <div className="logo" onClick={() => navigate("/")}>
            QuestEats
          </div>
        </nav>
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page">
        <nav className="topbar-dashboard">
          <div className="logo" onClick={() => navigate("/")}>
            QuestEats
          </div>
        </nav>
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p style={{ color: "#ff4444" }}>{error || "Profile not found"}</p>
          <button onClick={() => navigate("/dashboard")} style={{ marginTop: "1rem" }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <nav className="topbar-dashboard">
        <div className="logo" onClick={() => navigate("/")}>
          QuestEats
        </div>
        <button className="ghost" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: "0 0 0.5rem 0" }}>{profile.name || "User"}</h1>
          {profile.city && (
            <p style={{ color: "#666", margin: 0 }}>
              📍 {profile.city}{profile.country ? `, ${profile.country}` : ""}
            </p>
          )}
        </div>

        <h2 style={{ marginBottom: "1rem" }}>Stats</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#5469d4" }}>
              {profile.stats?.questsCompleted || 0}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
              Quests Completed
            </div>
          </div>
          <div style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#5469d4" }}>
              {profile.badges?.length || 0}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
              Badges Earned
            </div>
          </div>
          <div style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#5469d4" }}>
              {profile.stats?.restaurantsVisited || 0}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
              Restaurants Visited
            </div>
          </div>
          <div style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#5469d4" }}>
              {profile.stats?.streakDays || 0}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
              Day Streak
            </div>
          </div>
        </div>

        {profile.badges && profile.badges.length > 0 && (
          <>
            <h2 style={{ marginBottom: "1rem" }}>Badges Collection</h2>
            <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
              {profile.badges.map((badge) => (
                <div
                  key={badge._id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "#5469d4",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem 0" }}>{badge.name}</h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                      {badge.description}
                    </p>
                  </div>
                  {badge.rarity && (
                    <span
                      style={{
                        marginLeft: "auto",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "12px",
                        background: "#f0f0f0",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      {badge.rarity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {profile.questProgress && profile.questProgress.length > 0 && (
          <>
            <h2 style={{ marginBottom: "1rem" }}>Quest Progress</h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {profile.questProgress.map((qp, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "1rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0" }}>
                        Quest: {qp.quest.title}
                      </h3>
                      <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                        Status: <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>
                          {qp.status}
                        </span>
                      </p>
                      <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
                        Steps completed: {qp.completedSteps?.length || 0}
                      </p>
                      <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
                        Started: {qp.startedAt.substring(0,10)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ==================== Main App Router ====================
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/quest/:id" element={<QuestDetailPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
    </Routes>
  );
}


