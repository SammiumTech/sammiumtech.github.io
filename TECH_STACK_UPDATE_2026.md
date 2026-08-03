# Tech Stack Update — August 2026

## Updated files

- `apps/portfolio/src/components/Skills.tsx`
- `apps/portfolio/src/components/Sidebar.tsx`

## What changed

- Replaced the outdated six-card skill list with a nine-domain technology arsenal.
- Added TypeScript, C#, React 19, Tailwind CSS 4, Fastify, OpenAPI, Redis, BullMQ, Unity, Three.js, React Three Fiber, WebGL, Gemini API, D3.js, Recharts, WebSockets, JWT, RBAC, Docker, GitHub Actions, Railway, and Render.
- Removed subjective Expert / Advanced / Intermediate ratings.
- Added evidence-oriented labels: Production, Project-Proven, and Active Build.
- Added expandable descriptions that work with hover, keyboard focus, and touch/click.
- Added live domain and capability counts.
- Updated the compact sidebar skill groups to match the main portfolio section.
- Replaced the old category-completed footer and generic quote with Sammium-focused engineering messaging.

## Validation

- TypeScript validation passed with `tsc --noEmit`.
- A complete Vite production build could not be executed in the editing container because the uploaded `node_modules` directory contains Windows-native binaries while the validation environment is Linux.
- Reinstalling dependencies on the target machine will install the correct native packages.

## Run locally

```bash
npm install
npm run dev:portfolio
```

## Production build

```bash
npm run build:portfolio
```
