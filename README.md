# 3D Game-Style Portfolio — Dev Lab

A futuristic WebGL portfolio where visitors explore a developer lab, click 3D objects to open sections (About, Skills, Projects, Timeline, Contact), and use a hidden terminal to access an admin dashboard.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Three Fiber, Three.js, @react-three/drei, Framer Motion, Zustand
- **Backend:** Node.js, Express, JSON file store
- **3D:** Postprocessing (bloom, depth), HDR environment, particles, emissive lighting

## Run Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

From the project root:

```bash
npm run install:all
```

This installs root, client, and server dependencies.

### Development

Start both the API server and the Vite dev server:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173  
- **API:** http://localhost:3001  

The Vite dev server proxies `/api` and `/uploads` to the backend.

### Build & production

```bash
npm run build
```

Then run the server (serves API; serve the built client with a static server or integrate into Express):

```bash
npm run start
```

To serve the built client from Express, add to `server/index.js`:

```js
app.use(express.static(join(__dirname, '../client/dist')))
app.get('*', (req, res) => res.sendFile(join(__dirname, '../client/dist/index.html')))
```

## Usage

1. **Explore the lab** — Orbit the camera; click glowing objects to open sections.
2. **Sections** — Monitor → Projects, Hologram → Skills, Wall → About, Tablet → Contact, Board → Timeline.
3. **Hidden terminal** — Press **Ctrl+Shift+T** to open the terminal.
4. **Admin access** — In the terminal, type: `ADmin_access=0000` (default code). You will be redirected to `/Admin`.
5. **Admin dashboard** — Edit profile, skills, projects, timeline; upload project images (optional). Not linked in the UI; access only via terminal auth.

### Terminal commands

- `help` — List commands  
- `clear` — Clear terminal  
- `whoami` — Developer info  
- `psd chnge admin <new_code>` — Change admin code (admin only)  
- `exit` — Close terminal  

## Project structure

```
portfolio/
├── client/                 # Vite + React
│   ├── src/
│   │   ├── components/      # Scene, Lab, UI, Terminal, etc.
│   │   ├── sections/       # About, Skills, Projects, Timeline, Contact
│   │   ├── admin/          # AdminDashboard
│   │   ├── store/          # Zustand
│   │   ├── lib/            # API client
│   │   └── App.jsx
│   └── ...
├── server/                 # Express API
│   ├── index.js
│   └── data/db.json        # Created on first run
└── ARCHITECTURE.md
```

## Default admin code

`0000` — change via terminal: `psd chnge admin <new_code>` after authenticating.
