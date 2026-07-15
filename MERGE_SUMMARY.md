# Sammium Portfolio Merge Summary

## Main portfolio

The existing Gitfolio portfolio remains the shell and includes the immersive calibration loader.

## Integrated flagship projects

1. Sammium QuantumVerse
2. Sammium AgriMind AI
3. Sammium Research Lab

Each project remains isolated in its own npm workspace to avoid dependency and styling collisions. The portfolio builds them independently and embeds their static builds under `apps/portfolio/public/projects/` during deployment.

## Navigation

GitHub Pages-safe hash routes are used:

- `#/projects/quantumverse`
- `#/projects/agrimind-ai`
- `#/projects/research-lab`

Each project opens inside a dedicated portfolio experience with reload and full-screen controls.

## Build and deployment

- npm workspaces coordinate all four applications.
- `npm run lint` type-checks every workspace.
- `npm run build:pages` builds and assembles the final Pages artifact.
- `.github/workflows/deploy-pages.yml` deploys `apps/portfolio/dist`.

## Validation completed

- Dependency lockfile generated and valid.
- TypeScript checks pass for all workspaces.
- Production GitHub Pages build passes.
- No real API keys were found in the source package.

## Static hosting note

AI features that depend on Express or Gemini are not available from GitHub Pages alone. Their backend source remains in each workspace for later deployment to a Node host.
