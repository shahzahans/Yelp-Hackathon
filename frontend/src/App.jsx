import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./index.css";

const sampleRecommendations = [
  // placeholder
];

const sampleQuests = [
  { title: "Exploring Seattle", progress: "3 / 7 spots", tag: "City" },
  { title: "A Week in Japan", progress: "1 / 5 bowls", tag: "Cuisine" },
  { title: "Hidden Gems", progress: "0 / 6 bites", tag: "Small Biz" }
];

const sampleBadges = [
  { label: "Night Owl", detail: "Late-night eats" },
  { label: "Noodle Hero", detail: "Ramen lover" },
  { label: "Local Legend", detail: "Supports small biz" }
];

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="page page--landing">
      <nav className="topbar-landing">
        <div className="logo" onClick={() => navigate("/")}>QuestEats</div>
      </nav>

      <header className="title">
        <div className="hero-left">
          <h1>Turn Every Meal Into An <span class="highlight">Adventure</span></h1>
          <p className="subtitle">
            Stop stressing about where to eat. Let AI match your mood <br></br>with the perfect local spot and earn rewards along the way.
          </p>
          <div className="cta-row">
            <button onClick={() => navigate("/dashboard")} class="get-started-button">Get started</button>
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

function DashboardPage() {
  const [mood, setMood] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState(sampleRecommendations);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: call backend/Yelp AI with mood + location, then setResults(response)
    setResults(sampleRecommendations);
  };

  return (
    <div className="page">
      <nav className="topbar-dashboard">
        <div className="logo" onClick={() => navigate("/")}>QuestEats</div>
      </nav>
      <header className="hero">
        <div className="hero__content">
          <h1>What's Your Vibe?</h1>
          <p className="lede">
            Describe your mood, get AI-picked restaurants near you, and collect badges as you clear themed quests.
          </p>
          <form className="mood-form" onSubmit={handleSearch}>
            <div className="field">
              <label>Mood or craving</label>
              <input
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g. cozy rainy-day ramen, spicy tacos, brunch with friends"
                required
              />
            </div>
            <div className="field">
              <label>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Use city or allow geolocation"
              />
            </div>
            <button type="submit">Find my spots</button>
          </form>
        </div>
      </header>

      <main className="grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Quest Board</h2>
            </div>
            <button className="ghost">Generate with AI</button>
          </div>
          <div className="quests">
            {sampleQuests.map((q) => (
              <article className="quest" key={q.title}>
                <div>
                  <p className="pill pill--muted">{q.tag}</p>
                  <h3>{q.title}</h3>
                  <p className="meta">{q.progress}</p>
                </div>
                <button>Open quest</button>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Badges</h2>
            </div>
            <button className="ghost">View profile</button>
          </div>
          <div className="badges">
            {sampleBadges.map((b) => (
              <div className="badge" key={b.label}>
                <div className="badge__icon" />
                <div>
                  <p className="title">{b.label}</p>
                  <p className="meta">{b.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}