import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface CalibrationLoaderProps {
  onComplete: () => void;
}

interface CalibrationStage {
  label: string;
  detail: string;
  threshold: number;
}

const STAGES: CalibrationStage[] = [
  {
    label: "Establishing visual field",
    detail: "Viewport geometry and pixel density",
    threshold: 12,
  },
  {
    label: "Mapping interaction layer",
    detail: "Pointer, touch, and keyboard response",
    threshold: 35,
  },
  {
    label: "Tuning motion system",
    detail: "Adaptive animation and reduced-motion rules",
    threshold: 62,
  },
  {
    label: "Synchronizing portfolio core",
    detail: "Interface modules ready for handoff",
    threshold: 86,
  },
];

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const easeOutQuart = (value: number) => 1 - Math.pow(1 - value, 4);

export default function CalibrationLoader({ onComplete }: CalibrationLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0, dpr: 1 });
  const [preferences, setPreferences] = useState(() => ({
    reducedMotion:
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    coarsePointer:
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  }));

  const completedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  const completeCalibration = useCallback(() => {
    if (completedRef.current) return;

    completedRef.current = true;
    setProgress(100);
    setIsExiting(true);

    const exitDuration = preferences.reducedMotion ? 180 : 720;
    exitTimerRef.current = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem("sammium-interface-calibrated", "true");
      } catch {
        // Storage can be unavailable in privacy-focused browser modes.
      }
      onComplete();
    }, exitDuration);
  }, [onComplete, preferences.reducedMotion]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");

    const syncEnvironment = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: Math.round(window.devicePixelRatio * 100) / 100,
      });
      setPreferences({
        reducedMotion: motionQuery.matches,
        coarsePointer: pointerQuery.matches,
      });
    };

    syncEnvironment();
    window.addEventListener("resize", syncEnvironment);
    motionQuery.addEventListener("change", syncEnvironment);
    pointerQuery.addEventListener("change", syncEnvironment);

    return () => {
      window.removeEventListener("resize", syncEnvironment);
      motionQuery.removeEventListener("change", syncEnvironment);
      pointerQuery.removeEventListener("change", syncEnvironment);
    };
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const skipTimer = window.setTimeout(() => setCanSkip(true), 650);
    return () => window.clearTimeout(skipTimer);
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    const duration = preferences.reducedMotion ? 700 : 2850;

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const ratio = clamp(elapsed / duration, 0, 1);
      const nextProgress = Math.round(easeOutQuart(ratio) * 100);
      setProgress(nextProgress);

      if (ratio >= 1) {
        window.clearInterval(interval);
        completeCalibration();
      }
    }, preferences.reducedMotion ? 80 : 42);

    return () => window.clearInterval(interval);
  }, [completeCalibration, preferences.reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && canSkip) completeCalibration();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canSkip, completeCalibration]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  const activeStageIndex = useMemo(() => {
    let index = 0;
    STAGES.forEach((stage, stageIndex) => {
      if (progress >= stage.threshold) index = stageIndex;
    });
    return clamp(index, 0, STAGES.length - 1);
  }, [progress]);

  const currentStage = STAGES[activeStageIndex];
  const displayProgress = progress.toString().padStart(3, "0");
  const ringOffset = 100 - progress;

  return (
    <div
      className={`calibration-loader ${isExiting ? "calibration-loader--exiting" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calibration-title"
      aria-describedby="calibration-status"
      style={{ "--calibration-progress": `${progress}%` } as React.CSSProperties}
    >
      <div className="calibration-loader__atmosphere" aria-hidden="true">
        <div className="calibration-loader__grid" />
        <div className="calibration-loader__scan" />
        <div className="calibration-loader__vignette" />
        <div className="calibration-loader__grain" />
      </div>

      <header className="calibration-loader__header">
        <div className="calibration-brand" aria-label="Sammium interface">
          <span className="calibration-brand__mark" aria-hidden="true">
            <span>S</span>
          </span>
          <span className="calibration-brand__copy">
            <strong>SAMMIUM</strong>
            <small>INTERFACE / PORTFOLIO</small>
          </span>
        </div>

        <div className="calibration-sequence">
          <span className="calibration-sequence__pulse" aria-hidden="true" />
          <span>CALIBRATION SEQUENCE 02</span>
        </div>

        <button
          type="button"
          className="calibration-skip"
          onClick={completeCalibration}
          disabled={!canSkip || isExiting}
          aria-label="Skip interface calibration"
        >
          <span>Skip calibration</span>
          <kbd>ESC</kbd>
        </button>
      </header>

      <main className="calibration-loader__main">
        <aside className="calibration-diagnostics calibration-diagnostics--left" aria-label="Display diagnostics">
          <p className="calibration-eyebrow">ENVIRONMENT</p>
          <dl>
            <div>
              <dt>VIEWPORT</dt>
              <dd>{viewport.width || "—"} × {viewport.height || "—"}</dd>
            </div>
            <div>
              <dt>PIXEL RATIO</dt>
              <dd>{viewport.dpr.toFixed(2)} DPR</dd>
            </div>
            <div>
              <dt>INPUT MODE</dt>
              <dd>{preferences.coarsePointer ? "TOUCH / COARSE" : "POINTER / FINE"}</dd>
            </div>
          </dl>
        </aside>

        <section className="calibration-core" aria-labelledby="calibration-title">
          <div className="calibration-core__halo" aria-hidden="true" />

          <svg
            className="calibration-core__instrument"
            viewBox="0 0 440 440"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="calibration-ring-gradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="54%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <filter id="calibration-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle className="calibration-svg__orbit calibration-svg__orbit--outer" cx="220" cy="220" r="194" />
            <circle className="calibration-svg__orbit calibration-svg__orbit--mid" cx="220" cy="220" r="164" />
            <circle className="calibration-svg__orbit calibration-svg__orbit--inner" cx="220" cy="220" r="129" />

            <path className="calibration-svg__axis" d="M220 12V72M220 368V428M12 220H72M368 220H428" />
            <path className="calibration-svg__ticks" d="M83 83l20 20M337 337l20 20M357 83l-20 20M103 337l-20 20" />

            <circle
              className="calibration-svg__progress-track"
              cx="220"
              cy="220"
              r="176"
              pathLength="100"
            />
            <circle
              className="calibration-svg__progress"
              cx="220"
              cy="220"
              r="176"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={ringOffset}
              transform="rotate(-90 220 220)"
            />

            <g className="calibration-svg__satellites">
              <circle cx="220" cy="26" r="3.8" />
              <circle cx="414" cy="220" r="3.8" />
              <circle cx="220" cy="414" r="3.8" />
              <circle cx="26" cy="220" r="3.8" />
            </g>
          </svg>

          <div className="calibration-core__readout">
            <span className="calibration-core__micro">SYS / CAL</span>
            <div className="calibration-core__number" aria-hidden="true">
              {displayProgress}
              <span>%</span>
            </div>
            <h1 id="calibration-title">Calibrating your interface</h1>
            <p id="calibration-status" aria-live="polite">
              {currentStage.label}
            </p>
          </div>
        </section>

        <aside className="calibration-diagnostics calibration-diagnostics--right" aria-label="Experience diagnostics">
          <p className="calibration-eyebrow">EXPERIENCE</p>
          <dl>
            <div>
              <dt>MOTION</dt>
              <dd>{preferences.reducedMotion ? "REDUCED" : "ADAPTIVE"}</dd>
            </div>
            <div>
              <dt>RENDER MODE</dt>
              <dd>CSS + VECTOR</dd>
            </div>
            <div>
              <dt>STATUS</dt>
              <dd className="calibration-status-online">NOMINAL</dd>
            </div>
          </dl>
        </aside>
      </main>

      <footer className="calibration-loader__footer">
        <div className="calibration-stage-list" aria-label="Calibration stages">
          {STAGES.map((stage, index) => {
            const isComplete = progress >= (STAGES[index + 1]?.threshold ?? 100);
            const isActive = index === activeStageIndex && !isComplete;

            return (
              <div
                key={stage.label}
                className={`calibration-stage ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
              >
                <span className="calibration-stage__index">0{index + 1}</span>
                <span className="calibration-stage__indicator" aria-hidden="true" />
                <span className="calibration-stage__copy">
                  <strong>{stage.label}</strong>
                  <small>{stage.detail}</small>
                </span>
              </div>
            );
          })}
        </div>

        <div className="calibration-progress" aria-hidden="true">
          <span className="calibration-progress__fill" />
          <span className="calibration-progress__head" />
        </div>

        <div className="calibration-footer-meta">
          <span>SL / 2026</span>
          <span>{currentStage.detail}</span>
          <span>{displayProgress}.00</span>
        </div>
      </footer>

      <p className="sr-only" aria-live="assertive">
        {isExiting ? "Calibration complete. Opening portfolio." : ""}
      </p>
    </div>
  );
}
