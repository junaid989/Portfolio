# 3D Portfolio — Architecture Plan

## Overview

A game-style WebGL portfolio: users explore a futuristic developer lab, click 3D objects to open content panels (About, Skills, Projects, Timeline, Contact), with a hidden terminal (Ctrl+Shift+T) and admin dashboard.

## Tech Stack

| Layer      | Technology |
|-----------|------------|
| Frontend  | React 18, Vite, Tailwind CSS |
| 3D        | React Three Fiber, Three.js, @react-three/drei |
| UI/UX     | Framer Motion, Zustand |
| Backend   | Node.js, Express |
| Data      | JSON file store (upgradable to MongoDB) |

## High-Level Flow

```
User lands on / 
  → 3D Lab scene loads (R3F)
  → User orbits camera / clicks objects
  → Object click → open section panel (Framer Motion)
  → Terminal: Ctrl+Shift+T → auth "ADmin_access=0000" → /Admin
  → Admin: CRUD projects/skills/profile, images; API persists to JSON
```

## Folder Structure

```
portfolio/
├── client/                 # Vite + React frontend
│   ├── src/
│   │   ├── components/     # Scene, Camera, Objects, UI shell, Terminal
│   │   ├── sections/       # About, Skills, Projects, Timeline, Contact
│   │   ├── admin/          # AdminDashboard (hidden route)
│   │   ├── store/          # Zustand (UI + portfolio data)
│   │   ├── assets/         # models, textures, audio
│   │   ├── hooks/          # useTerminal, useSection, etc.
│   │   ├── lib/            # api client, constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                 # Express API
│   ├── index.js
│   ├── routes/             # projects, skills, profile, auth
│   ├── middleware/         # admin auth
│   └── data/               # db.json
├── package.json            # root scripts
└── ARCHITECTURE.md
```

## State (Zustand)

- `openSection`: null | 'about' | 'skills' | 'projects' | 'timeline' | 'contact'
- `terminalOpen`: boolean
- `isAdmin`: boolean (from terminal auth or session)
- `cameraTarget`: { position, lookAt } for smooth transitions
- `portfolioData`: { profile, skills, projects, timeline } (from API)
- `mobileMode`: boolean (fallback to 2D UI)

## 3D Object → Section Mapping

| Object           | Section   |
|------------------|-----------|
| Computer Monitor | Projects  |
| Floating Hologram| Skills    |
| Wall Screen      | About     |
| Tablet           | Contact   |
| Timeline Board   | Timeline  |

## API (Express)

- GET  /api/profile     → profile (about)
- GET  /api/skills      → skills by category
- GET  /api/projects    → projects
- GET  /api/timeline    → timeline milestones
- POST /api/admin/login → body: { code } → session/token
- CRUD /api/admin/*     → protected; edit profile, skills, projects, upload images

## Security

- Admin route /Admin not linked in UI; only after terminal auth.
- Admin API protected by middleware checking session or token.
- Passwords/codes stored hashed in production (optional enhancement).

## Performance

- Lazy load 3D models (Suspense + useGLTF with path).
- Compressed GLTF (Draco); texture size limits.
- Postprocessing: bloom only when needed; mobile fallback disables heavy effects.
- React.memo on expensive components; R3F frameloop on demand if possible.
