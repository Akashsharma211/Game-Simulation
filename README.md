# Website Adventure Simulator

A browser-based 3D open-world simulation game built with React, React Three Fiber, and Three.js. Explore a procedurally generated city, discover level portals, and prepare for future website security challenges.

## Tech Stack

- **React 19** + **Vite 8**
- **React Three Fiber** + **Three.js** + **Drei**
- **Framer Motion** — UI animations
- **Tailwind CSS 4** — HUD & menus
- **Zustand** — State management
- **React Router** — Routing (ready for level pages)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Controls

| Key | Action |
|-----|--------|
| W A S D | Move |
| SHIFT | Run |
| SPACE | Jump |
| E | Interact (portals) |
| MOUSE | Camera rotation |
| ESC | Pause |

## Project Structure

```
src/
├── components/     # 3D & UI components
├── scenes/         # Three.js scenes
├── hooks/          # Custom React hooks
├── store/          # Zustand state
├── services/       # API placeholders (MERN-ready)
├── levels/         # Future level pages (Level1–10)
├── utils/          # Constants, helpers, city generator
└── pages/          # Route pages
```

## Future MERN Integration

Service files in `src/services/` define placeholder methods for:

- `GET /api/player`
- `POST /api/player/save`
- `GET /api/player/progress`
- `POST /api/player/unlock`
- `GET /api/levels`
- `POST /api/levels/start`
- `POST /api/levels/complete`

Set `VITE_API_URL` in `.env` when backend is ready.

## Features

- Welcome screen with animated background
- Third-person character controller with physics
- Procedural city with 8 distinct areas
- 10 glowing level portals
- Live minimap with player tracking
- Day/night cycle with dynamic lighting
- Bloom post-processing
- Notification system
- Pause menu & settings
- Save data structure (localStorage + API-ready)
- Achievement & multiplayer placeholders

## Build

```bash
npm run build
npm run preview
```

## License

MIT
