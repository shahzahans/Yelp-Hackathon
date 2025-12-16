# QuestEATS 
### Yelp AI Hackathon 2025

QuestEATS turns eating out into a game. Users receive **AI-generated food quests** based on their mood, cravings, and goals — earning badges, streaks, and rewards along the way.

---

## Team
- **Shadman Shahzahan**
- **Conner Ngadisastara**
- **Jaden Dang**

---

## Inspiration
Choosing what to eat is often overwhelming. We wanted to transform that friction into **fun** by combining:
- AI-powered recommendations
- Gamification (quests, badges, streaks)
- Daily motivation and social engagement

QuestEATS reframes food discovery as an adventure rather than a decision.

---

## Core Features
- Natural language mood & craving input
- AI-generated food quests using Yelp data
- Three quest modes:
  - Solo mood-based quests
  - Craving-driven recommendations
  - Daily challenges
- Quest cards with badge rewards
- User profiles with streak & badge tracking
- Group quests and friend connections (future)

---

## Project Structure
```text
QuestEATS/
├─ backend/                 # Node.js + Express API
│  ├─ config/               # Database configuration
│  ├─ controllers/          # API route handlers
│  ├─ models/               # MongoDB schemas
│  ├─ routes/               # Express routes
│  ├─ services/             # Yelp + AI integrations
│  ├─ app.js                # Express app setup
│  └─ server.js             # Server entry point
│
├─ frontend/                # React + Vite frontend
│  ├─ src/
│  │  ├─ App.jsx            # Main app with routing
│  │  ├─ api.js             # Backend API client
│  │  └─ main.jsx           # React entry point
│  └─ package.json
│
└─ README.md
```

---

## Live Deployment

### Backend (API)
- **Platform:** Render  
- **Base URL:**  
https://yelp-hackathon.onrender.com

- Health check:  
https://yelp-hackathon.onrender.com/api/health

---

### Frontend (Web App)
- **Platform:** Vercel  
- **URL:**  
https://yelp-hackathon-steel.vercel.app/


---

## Environment Variables

### Backend (Render)
PORT=4000
MONGODB_URI=your_mongodb_connection_string
YELP_API_KEY=your_yelp_api_key
NODE_ENV=production


---

## How to Run Locally

### Clone the Repository
```bash
git clone https://github.com/shahzahans/Yelp-Hackathon.git
cd Yelp-Hackathon
```

### Run the Backend
```bash
cd backend
npm install
npm run dev
```

Backend will run at:
- http://localhost:4000

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:
- http://localhost:5173

Make sure frontend/.env contains:
- VITE_API_URL=http://localhost:4000

### API Examples
```js
fetch(`${import.meta.env.VITE_API_URL}/api/quests`)
  .then(res => res.json())
  .then(data => console.log(data));
```
---
### What We Learned
- Designing a full-stack system under hackathon time constraints
- Deploying a production-ready backend using Render
- Deploying a modern Vite frontend with Vercel
- Managing environment variables across multiple platforms
- Proper CORS configuration for production environments
- Integrating third-party APIs (Yelp + AI services)
- Structuring scalable Express applications
- Debugging cloud deployment issues efficiently

### Future Improvements
- user authentication & accounts
- Real-time group quests
- Social leaderboards
- Mobile first UI enhancements
- Smarter personalization using user history

### Hackathon Notes
- QuestEATS was built during the Yelp AI Hackathon 2025 with a focus on:
- Real deployments
- Clean architecture
- Scalable design
- Strong core user value
----
If you have questions or want to contribute, feel free to open an issue or reach out!







