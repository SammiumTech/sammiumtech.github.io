# Sammium Interface Calibration Screen

## What was added

- `src/components/CalibrationLoader.tsx`
- Calibration styles appended to `src/index.css`
- First-session integration in `src/App.tsx`
- A regenerated `package-lock.json` for reproducible installs

## Experience behavior

- Runs once per browser tab/session.
- Replays when the URL includes `?calibrate=1`.
- Completes in approximately 2.85 seconds under normal motion settings.
- Uses a shortened sequence when `prefers-reduced-motion: reduce` is enabled.
- Becomes skippable after 650 milliseconds.
- Supports the Escape key.
- Locks background scrolling while active and restores it afterward.
- Measures and displays real viewport size, device-pixel ratio, input mode, and motion preference.
- Uses CSS and SVG only—no canvas, video, audio, or additional package.

## UX principles

The screen is presented as interface calibration rather than fake network/download progress. It provides a branded, immersive transition without delaying repeat visits or pretending to measure assets it does not actually track.

## Adjusting duration

In `CalibrationLoader.tsx`, edit:

```ts
const duration = preferences.reducedMotion ? 700 : 2850;
```

Keep the normal duration below roughly 3 seconds to avoid creating unnecessary friction.

## Resetting during development

Use either method:

1. Open the portfolio with `?calibrate=1`.
2. Run this in the browser console:

```js
sessionStorage.removeItem("sammium-interface-calibrated");
```

## Verification completed

```text
npm run lint   PASS
npm run build  PASS
HTTP root      200 OK
```
