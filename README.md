# Sammium Portfolio Suite

A unified portfolio repository containing Sam Lopez's three flagship projects:

- **Sammium QuantumVerse** — immersive quantum learning and scientific visualization
- **Sammium AgriMind AI** — agricultural intelligence and farm operations platform
- **Sammium Research Lab** — AI research, telemetry, simulation, and experimentation environment

The portfolio keeps each application isolated as its own React/Vite workspace. During deployment, the three projects are built independently and embedded into the portfolio as lazy-loaded standalone experiences. This avoids dependency collisions and keeps the initial portfolio bundle smaller.


## Target repository

This package is prepared for `https://github.com/zelop301/Samy-Lopez-Sammium-Tech` and includes a GitHub Pages deployment workflow. See `GITHUB_DEPLOYMENT.md` for the exact upload and activation steps.

## Repository architecture

```text
apps/
  portfolio/       Main portfolio and calibration experience
  quantumverse/    Sammium QuantumVerse source and server
  agrimind-ai/     Sammium AgriMind AI source and server
  research-lab/    Sammium Research Lab source and server
scripts/
  assemble-projects.mjs
.github/workflows/
  deploy-pages.yml
```

## Local setup

Requirements: Node.js 22 or newer.

```bash
npm ci
npm run lint
npm run build:pages
npm run dev
```

The portfolio development server is intended for layout and portfolio work. To run a project with its Express/Gemini API, use one of the workspace commands:

```bash
npm run dev:quantumverse
npm run dev:agrimind
npm run dev:research
```

Each full-stack workspace reads its own environment variables. Copy the relevant `.env.example` file and keep API keys out of Git.

## GitHub Pages deployment

The included GitHub Actions workflow builds all three apps, copies their static distributions into the portfolio, and publishes `apps/portfolio/dist` to GitHub Pages.

After pushing the repository:

1. Open **Settings → Pages** in GitHub.
2. Set **Source** to **GitHub Actions**.
3. Push to the `main` branch or run the **Deploy Sammium Portfolio** workflow manually.

### Static hosting limitation

GitHub Pages serves static files only. The visual interfaces and client-side simulations work there, but features that call Express/Gemini endpoints need a separate backend deployment. For full AI functionality, deploy the corresponding workspace server to a Node-compatible host and configure the frontend API base URL.

## Build pipeline

```bash
npm run build:projects  # builds the three project clients
npm run assemble        # embeds builds into portfolio/public/projects
npm run build:portfolio # builds the final portfolio
npm run build:pages     # runs the complete pipeline
```

## Project routes

The portfolio uses GitHub Pages-safe hash routes:

- `#/projects/quantumverse`
- `#/projects/agrimind-ai`
- `#/projects/research-lab`

Each route loads the project only after the visitor launches it.
