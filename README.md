# QuestEATS
## Yelp AI Hackathon 2025
### Shadman Shahzahan, Conner Ngadisastra, Jaden Dang

## Core Features
- Natural language mood/ craving input
- 3 modes: Solo mood/ Cravings/ Daily quests
- Every meal = quest card + badge
- Profile with streak & badge collection
- Group quests and friend connections

## Project Structure

QuestEats/
├── backend/               # Node.js + Express API
│   ├── controllers/      # API route handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # Express routes
│   ├── services/        # Yelp AI integration
│   └── server.js        # Entry point
│
└── frontend/             # React + Vite
    ├── src/
    │   ├── App.jsx     # Main app with routing
    │   ├── api.js      # Backend API client
    │   └── main.jsx    # React entry point
    └── package.json