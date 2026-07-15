import React, { useEffect, useRef, useState } from "react";
import { audioService } from "../utils/audioService";

interface LivingQuantumUniverseProps {
  activeModule: string;
  completedLessonsCount: number;
  unlockedBadgesCount: number;
  transitionState?: "idle" | "detection" | "activation" | "assembly" | "transition" | "reconstruction" | "sync";
  selectedTopicId?: string;
  graphicsMode?: "performance" | "balanced" | "ultra";
}

// Particle interface with depth, color, and physical drift parameters
interface SpaceParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  depth: number; // Parallax layers: 1 = far, 2 = mid, 3 = near
  phase: number;
  pulseSpeed: number;
  speedMultiplier: number;
}

// Drifting Cosmic Dust with Brownian Motion
interface CosmicDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
  depth: number;
}

// Interactive Rotating Galaxy representation
interface CosmicGalaxy {
  id: number;
  x: number;
  y: number;
  type: "spiral" | "elliptical" | "irregular";
  size: number;
  angle: number;
  rotSpeed: number;
  color: string;
  coreGlow: string;
  alpha: number;
  armCount?: number;
}

// Large-scale cosmic structure node
interface WebNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

// Interactive Cosmic Events
interface CosmicEvent {
  id: number;
  type: "shooting_star" | "pulsar" | "supernova" | "quasar" | "aurora";
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  angle?: number;
  rotSpeed?: number;
}

export default function LivingQuantumUniverse({
  activeModule,
  completedLessonsCount,
  unlockedBadgesCount,
  transitionState = "idle",
  selectedTopicId,
  graphicsMode = "balanced",
}: LivingQuantumUniverseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track browser/tab activity & motion preferences
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);

  // User experience level based on lesson progression
  const experienceLevel = completedLessonsCount + unlockedBadgesCount;

  // Track coordinates and physics states via refs
  const mouseRef = useRef({ x: -1000, y: -1000, px: -1000, py: -1000, speed: 0, isOver: false, trail: [] as { x: number; y: number; life: number }[] });
  const distortionRef = useRef({ active: false, x: 0, y: 0, radius: 0, force: 0, life: 0, duration: 240 });
  const scrollOffsetRef = useRef(0);
  const scrollInertiaRef = useRef(0);

  // LUBE Layers State References
  const starsRef = useRef<SpaceParticle[]>([]);
  const dustRef = useRef<CosmicDust[]>([]);
  const galaxiesRef = useRef<CosmicGalaxy[]>([]);
  const webNodesRef = useRef<WebNode[]>([]);
  const eventsRef = useRef<CosmicEvent[]>([]);

  // Refs for smooth color state transitioning (Transitions should take several seconds)
  const currentPrimaryRef = useRef({ r: 0, g: 243, b: 255 }); // cyan
  const currentSecondaryRef = useRef({ r: 189, g: 0, b: 255 }); // soft violet
  const currentAccentRef = useRef({ r: 0, g: 94, b: 255 }); // electric blue
  const currentBgGradCenterRef = useRef({ r: 6, g: 10, b: 31 }); // deep midnight

  // Timing refs
  const lastEventTime = useRef(Date.now());
  const lastDistortionTime = useRef(Date.now());

  // App state synchronization refs
  const activeModuleRef = useRef(activeModule);
  const selectedTopicIdRef = useRef(selectedTopicId);
  const transitionStateRef = useRef(transitionState);
  const graphicsModeRef = useRef(graphicsMode);

  useEffect(() => { activeModuleRef.current = activeModule; }, [activeModule]);
  useEffect(() => { selectedTopicIdRef.current = selectedTopicId; }, [selectedTopicId]);
  useEffect(() => { transitionStateRef.current = transitionState; }, [transitionState]);
  useEffect(() => { graphicsModeRef.current = graphicsMode; }, [graphicsMode]);

  // Handle system motion preference and page visibility
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const diff = scrollY - scrollOffsetRef.current;
      scrollInertiaRef.current += diff * 0.08;
      scrollOffsetRef.current = scrollY;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Set up mouse interaction listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const m = mouseRef.current;
      m.px = m.x;
      m.py = m.y;
      m.x = e.clientX;
      m.y = e.clientY;
      m.isOver = true;

      const dx = m.x - m.px;
      const dy = m.y - m.py;
      m.speed = Math.min(Math.sqrt(dx * dx + dy * dy), 40);

      // Add energy trail for nanophotonic visual highlights
      if (m.trail.length < 25) {
        m.trail.push({ x: m.x, y: m.y, life: 1.0 });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.isOver = false;
    };

    const handleMouseDown = () => {
      // Trigger interactive light ripple waves (Warp fields)
      if (distortionRef.current.life <= 0) {
        triggerSpacetimeDistortion(mouseRef.current.x, mouseRef.current.y, 0.48);
        if (audioService.isEnabled()) {
          audioService.playClick("confirm");
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Spacetime distortion ripples (Gravitational Waves)
  const triggerSpacetimeDistortion = (x: number, y: number, force = 0.35) => {
    const d = distortionRef.current;
    d.active = true;
    d.x = x;
    d.y = y;
    d.radius = 0;
    d.force = force;
    d.life = d.duration;
  };

  // Main Canvas Rendering & Physics Pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = containerRef.current?.clientWidth || window.innerWidth;
    let height = canvas.height = containerRef.current?.clientHeight || window.innerHeight;

    const handleResize = () => {
      if (containerRef.current) {
        width = canvas.width = containerRef.current.clientWidth;
        height = canvas.height = containerRef.current.clientHeight;
      } else {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initializer functions for diverse Cosmic Layers
    const initializeStars = (count: number) => {
      const colors = ["#ffffff", "#e0f2fe", "#bae6fd", "#fed7aa", "#fecdd3", "#00f3ff", "#bd00ff"];
      return Array.from({ length: count }, () => {
        const depth = Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15 * (depth === 1 ? 0.4 : depth === 2 ? 1.0 : 1.8),
          vy: (Math.random() - 0.5) * 0.15 * (depth === 1 ? 0.4 : depth === 2 ? 1.0 : 1.8),
          size: Math.random() * 1.4 + (depth === 1 ? 0.2 : depth === 2 ? 0.7 : 1.4),
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.65 + 0.1,
          depth,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          speedMultiplier: depth === 1 ? 0.3 : depth === 2 ? 0.8 : 1.5
        };
      });
    };

    const initializeDust = (count: number) => {
      const colors = ["rgba(0, 243, 255, 0.45)", "rgba(189, 0, 255, 0.35)", "rgba(0, 94, 255, 0.4)"];
      return Array.from({ length: count }, () => {
        const depth = Math.random() < 0.5 ? 1 : 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          size: Math.random() * 1.1 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.3 + 0.05,
          phase: Math.random() * Math.PI * 2,
          depth
        };
      });
    };

    const initializeGalaxies = () => {
      const list: CosmicGalaxy[] = [];
      const types: ("spiral" | "elliptical" | "irregular")[] = ["spiral", "elliptical", "irregular"];
      const colors = ["#00f3ff", "#bd00ff", "#005eff", "#ef4444", "#f59e0b"];
      
      const count = graphicsModeRef.current === "performance" ? 2 : (graphicsModeRef.current === "ultra" ? 6 : 4);
      for (let i = 0; i < count; i++) {
        list.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          type: types[i % types.length],
          size: Math.random() * 45 + 30,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() * 0.002 + 0.0005) * (Math.random() < 0.5 ? 1 : -1),
          color: colors[i % colors.length],
          coreGlow: colors[(i + 1) % colors.length],
          alpha: Math.random() * 0.15 + 0.05,
          armCount: Math.floor(Math.random() * 2) + 2
        });
      }
      return list;
    };

    const initializeWebNodes = () => {
      const list: WebNode[] = [];
      const count = graphicsModeRef.current === "performance" ? 4 : (graphicsModeRef.current === "ultra" ? 12 : 8);
      for (let i = 0; i < count; i++) {
        list.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.2 + 0.05
        });
      }
      return list;
    };

    // Lazy initialization & caching of layers
    const maxStarsCount = prefersReducedMotion ? 60 : (graphicsModeRef.current === "performance" ? 50 : (graphicsModeRef.current === "ultra" ? 280 : 160));
    const maxDustCount = prefersReducedMotion ? 20 : (graphicsModeRef.current === "performance" ? 20 : (graphicsModeRef.current === "ultra" ? 140 : 80));

    starsRef.current = starsRef.current.length > 0 ? starsRef.current : initializeStars(maxStarsCount);
    dustRef.current = dustRef.current.length > 0 ? dustRef.current : initializeDust(maxDustCount);
    galaxiesRef.current = galaxiesRef.current.length > 0 ? galaxiesRef.current : initializeGalaxies();
    webNodesRef.current = webNodesRef.current.length > 0 ? webNodesRef.current : initializeWebNodes();

    let frame = 0;
    let cameraX = 0;
    let cameraY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let currentWarpScale = 1.0;
    let transitionDistortionTriggered = false;

    // Helper functions for Dynamic Coloring based on Scientific context (Adaptive Color System)
    const getTargetColorState = (mod: string, topic: string) => {
      const now = new Date();
      const hour = now.getHours();
      const isMorning = hour >= 6 && hour < 18;

      // Color profile definitions
      const cyan = { r: 0, g: 243, b: 255 };
      const violet = { r: 189, g: 0, b: 255 };
      const blue = { r: 0, g: 94, b: 255 };
      const darkMidnight = { r: 4, g: 6, b: 18 };

      const amber = { r: 245, g: 158, b: 11 };
      const red = { r: 239, g: 68, b: 68 };
      const orange = { r: 217, g: 119, b: 6 };
      const solarBg = { r: 24, g: 14, b: 3 };

      const blackHoleCore = { r: 139, g: 92, b: 246 };
      const deepIndigo = { r: 30, g: 27, b: 75 };
      const spaceVoidBg = { r: 2, g: 2, b: 12 };

      const neutralSlate = { r: 148, g: 163, b: 184 };
      const darkSlate = { r: 71, g: 85, b: 105 };
      const researchBg = { r: 8, g: 12, b: 20 };

      if (mod === "sims" || mod === "simulations") {
        if (topic === "blackhole") {
          return { primary: blackHoleCore, secondary: deepIndigo, accent: violet, bgGrad: spaceVoidBg };
        } else if (topic === "solarsystem" || topic === "solar") {
          return { primary: amber, secondary: red, accent: orange, bgGrad: solarBg };
        } else {
          return { primary: violet, secondary: blackHoleCore, accent: cyan, bgGrad: { r: 12, g: 5, b: 26 } };
        }
      } else if (mod === "playground" || mod === "hub") {
        return { primary: cyan, secondary: { r: 16, g: 185, b: 129 }, accent: blue, bgGrad: { r: 2, g: 16, b: 22 } };
      } else if (mod === "mentor") {
        return { primary: cyan, secondary: blue, accent: { r: 56, g: 189, b: 248 }, bgGrad: { r: 1, g: 12, b: 24 } };
      } else if (mod === "timeline" || mod === "trust") {
        return { primary: neutralSlate, secondary: darkSlate, accent: neutralSlate, bgGrad: researchBg };
      } else {
        // Fallback default diurnal profile
        if (isMorning) {
          return { primary: { r: 56, g: 189, b: 248 }, secondary: { r: 2, g: 132, b: 199 }, accent: blue, bgGrad: { r: 3, g: 20, b: 38 } };
        } else {
          return { primary: cyan, secondary: violet, accent: blue, bgGrad: darkMidnight };
        }
      }
    };

    // Smooth linear color interpolation
    const interpolateColorRef = (current: { r: number; g: number; b: number }, target: { r: number; g: number; b: number }, rate: number) => {
      current.r += (target.r - current.r) * rate;
      current.g += (target.g - current.g) * rate;
      current.b += (target.b - current.b) * rate;
    };

    // Main animation loop
    const tick = () => {
      if (!isTabActive) {
        requestAnimationFrame(tick);
        return;
      }
      frame++;

      // Compute Nanophotonic Transition scale factor and distortion trigger
      let targetWarpScale = 1.0;
      if (transitionStateRef.current === "transition") targetWarpScale = 2.4;
      else if (transitionStateRef.current === "assembly") targetWarpScale = 1.35;
      else if (transitionStateRef.current === "reconstruction") targetWarpScale = 0.82;
      else if (transitionStateRef.current === "activation") targetWarpScale = 1.15;

      currentWarpScale += (targetWarpScale - currentWarpScale) * 0.12;

      if (transitionStateRef.current === "transition" && !transitionDistortionTriggered) {
        triggerSpacetimeDistortion(width / 2, height / 2, 0.95);
        transitionDistortionTriggered = true;
      }
      if (transitionStateRef.current === "idle" || transitionStateRef.current === "sync") {
        transitionDistortionTriggered = false;
      }

      // Trigger active color transitions smoothly (interpolating targets over frames)
      const targetColors = getTargetColorState(activeModuleRef.current, selectedTopicIdRef.current || "");
      const colorLerpRate = 0.006; // Smooth over several seconds
      interpolateColorRef(currentPrimaryRef.current, targetColors.primary, colorLerpRate);
      interpolateColorRef(currentSecondaryRef.current, targetColors.secondary, colorLerpRate);
      interpolateColorRef(currentAccentRef.current, targetColors.accent, colorLerpRate);
      interpolateColorRef(currentBgGradCenterRef.current, targetColors.bgGrad, colorLerpRate);

      const colorP = `rgb(${Math.round(currentPrimaryRef.current.r)}, ${Math.round(currentPrimaryRef.current.g)}, ${Math.round(currentPrimaryRef.current.b)})`;
      const colorS = `rgb(${Math.round(currentSecondaryRef.current.r)}, ${Math.round(currentSecondaryRef.current.g)}, ${Math.round(currentSecondaryRef.current.b)})`;
      const colorA = `rgb(${Math.round(currentAccentRef.current.r)}, ${Math.round(currentAccentRef.current.g)}, ${Math.round(currentAccentRef.current.b)})`;
      const colorBg = `rgb(${Math.round(currentBgGradCenterRef.current.r)}, ${Math.round(currentBgGradCenterRef.current.g)}, ${Math.round(currentBgGradCenterRef.current.b)})`;

      // Slow Continuous Camera Drift (Cinematic Spacecraft Drift)
      const driftSpeed = prefersReducedMotion ? 0.001 : 0.003;
      targetCameraX = Math.sin(frame * driftSpeed) * 35;
      targetCameraY = Math.cos(frame * driftSpeed * 0.8) * 25;

      // Append scroll inertia offsets to camera
      scrollInertiaRef.current *= 0.95; // damp scroll energy
      targetCameraY += scrollInertiaRef.current * 1.5;

      // Interpolate camera matrix displacement
      cameraX += (targetCameraX - cameraX) * 0.08;
      cameraY += (targetCameraY - cameraY) * 0.08;

      // Render Layer 1: Infinite Cosmic Background Space & Nebulae
      ctx.fillStyle = "#030408";
      ctx.fillRect(0, 0, width, height);

      // Deep celestial radial space gradient
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, Math.max(width, height) * 0.95);
      gradient.addColorStop(0, colorBg);
      gradient.addColorStop(0.5, "#020306");
      gradient.addColorStop(1, "#010103");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render Layer 2: Slowly Evolving Volumetric Nebulae
      if (!prefersReducedMotion && graphicsModeRef.current !== "performance") {
        const nebulaCount = graphicsModeRef.current === "ultra" ? 4 : 2;
        for (let i = 0; i < nebulaCount; i++) {
          const shiftPhase = frame * 0.0004 + i * (Math.PI / 2);
          const nebulaX = width / 2 + Math.cos(shiftPhase * 1.2) * (width * 0.22) + cameraX * 0.3;
          const nebulaY = height / 2 + Math.sin(shiftPhase * 0.7) * (height * 0.18) + cameraY * 0.3;
          const nebulaRadius = Math.min(width, height) * (0.35 + Math.sin(frame * 0.0008 + i) * 0.06);

          const nebGrad = ctx.createRadialGradient(nebulaX, nebulaY, 1, nebulaX, nebulaY, nebulaRadius);
          const activeNebColor = i % 2 === 0 ? colorS : colorP;
          
          let nebulaAlphaScale = 0.045;
          let nebulaAccentAlphaScale = 0.015;
          if (transitionStateRef.current === "sync") {
            nebulaAlphaScale = 0.16;
            nebulaAccentAlphaScale = 0.05;
          } else if (transitionStateRef.current === "transition") {
            nebulaAlphaScale = 0.012;
            nebulaAccentAlphaScale = 0.005;
          }

          nebGrad.addColorStop(0, activeNebColor.replace("rgb", "rgba").replace(")", `, ${nebulaAlphaScale})`));
          nebGrad.addColorStop(0.4, colorA.replace("rgb", "rgba").replace(")", `, ${nebulaAccentAlphaScale})`));
          nebGrad.addColorStop(1, "transparent");

          ctx.fillStyle = nebGrad;
          ctx.beginPath();
          ctx.arc(nebulaX, nebulaY, nebulaRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render Layer 6: Dark Matter Filament Grid (Large Scale Structure)
      if (!prefersReducedMotion && graphicsModeRef.current === "ultra") {
        ctx.strokeStyle = colorP.replace("rgb", "rgba").replace(")", ", 0.012)");
        ctx.lineWidth = 1;
        ctx.beginPath();
        const nodes = webNodesRef.current;
        for (let i = 0; i < nodes.length; i++) {
          const n1 = nodes[i];
          n1.x += n1.vx;
          n1.y += n1.vy;

          if (n1.x < 0 || n1.x > width) n1.vx *= -1;
          if (n1.y < 0 || n1.y > height) n1.vy *= -1;

          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dist = Math.hypot(n2.x - n1.x, n2.y - n1.y);
            if (dist < 400) {
              const cpX = (n1.x + n2.x) / 2 + Math.sin(frame * 0.001 + i) * 45;
              const cpY = (n1.y + n2.y) / 2 + Math.cos(frame * 0.001 + j) * 45;
              ctx.moveTo(n1.x + cameraX * 0.2, n1.y + cameraY * 0.2);
              ctx.quadraticCurveTo(cpX + cameraX * 0.2, cpY + cameraY * 0.2, n2.x + cameraX * 0.2, n2.y + cameraY * 0.2);
            }
          }
        }
        ctx.stroke();
      }

      // Render Layer 1 Continued: Infinite Starfield with atmospheric scintillation
      starsRef.current.forEach((star, idx) => {
        // Subtle twinkling based on Atmospheric scintillation
        star.phase += star.pulseSpeed;
        const twinkle = Math.sin(star.phase) * 0.25 + 0.75;
        const finalAlpha = star.alpha * twinkle;

        // Apply camera parallax translations
        const renderX = (star.x + cameraX * star.speedMultiplier + width) % width;
        const renderY = (star.y + cameraY * star.speedMultiplier + height) % height;

        // Apply dynamic radial scaling (Nanophotonic Warp Drive effect)
        const dxFromCenter = renderX - width / 2;
        const dyFromCenter = renderY - height / 2;
        const renderXScaled = width / 2 + dxFromCenter * currentWarpScale;
        const renderYScaled = height / 2 + dyFromCenter * currentWarpScale;

        // Space-time Gravitational Lensing effect
        let displacementX = 0;
        let displacementY = 0;
        const distState = distortionRef.current;

        if (distState.active) {
          const dx = renderXScaled - distState.x;
          const dy = renderYScaled - distState.y;
          const distToRipple = Math.hypot(dx, dy);
          const waveThickness = 120;
          const edgeDistance = Math.abs(distToRipple - distState.radius);

          if (edgeDistance < waveThickness) {
            const bendFactor = Math.sin((1 - edgeDistance / waveThickness) * Math.PI) * distState.force;
            const displacementStrength = bendFactor * 24.0 * (1 - distState.radius / Math.max(width, height));
            displacementX = (dx / (distToRipple || 1)) * displacementStrength;
            displacementY = (dy / (distToRipple || 1)) * displacementStrength;
          }
        }

        // Draw individual twinkling star
        const finalX = renderXScaled + displacementX;
        const finalY = renderYScaled + displacementY;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = finalAlpha;

        if (currentWarpScale > 1.1 && star.depth > 1) {
          // Stretch star into nanophotonic radial line
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.size * (1 + (currentWarpScale - 1) * 0.35);
          ctx.beginPath();
          ctx.moveTo(finalX, finalY);
          // Trail goes back towards the original scaled position closer to center
          const trailLengthFactor = 0.5;
          const trailX = width / 2 + dxFromCenter * (currentWarpScale - (currentWarpScale - 1) * trailLengthFactor) + displacementX;
          const trailY = height / 2 + dyFromCenter * (currentWarpScale - (currentWarpScale - 1) * trailLengthFactor) + displacementY;
          ctx.lineTo(trailX, trailY);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(finalX, finalY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // High-end Nanophotonic Diffraction overlays for foreground stars
        if (star.depth === 3 && graphicsModeRef.current !== "performance" && !prefersReducedMotion && currentWarpScale <= 1.1) {
          ctx.strokeStyle = colorP.replace("rgb", "rgba").replace(")", ", 0.12)");
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(finalX - 4, finalY);
          ctx.lineTo(finalX + 4, finalY);
          ctx.moveTo(finalX, finalY - 4);
          ctx.lineTo(finalX, finalY + 4);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1.0;

      // Render Layer 3: Weightless Cosmic Dust (Brownian Motion)
      dustRef.current.forEach((dust) => {
        // Slow random motion
        dust.phase += 0.005;
        dust.x += Math.sin(dust.phase) * 0.06;
        dust.y += Math.cos(dust.phase * 0.7) * 0.06;

        // Bound constraints
        if (dust.x < 0) dust.x = width;
        if (dust.x > width) dust.x = 0;
        if (dust.y < 0) dust.y = height;
        if (dust.y > height) dust.y = 0;

        const renderX = (dust.x + cameraX * 0.5 + width) % width;
        const renderY = (dust.y + cameraY * 0.5 + height) % height;

        ctx.fillStyle = dust.color;
        ctx.globalAlpha = dust.alpha;
        ctx.beginPath();
        ctx.arc(renderX, renderY, dust.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Render Layer 4: Rotating Galaxy Clusters
      galaxiesRef.current.forEach((galaxy) => {
        galaxy.angle += galaxy.rotSpeed;

        const renderX = (galaxy.x + cameraX * 0.4 + width) % width;
        const renderY = (galaxy.y + cameraY * 0.4 + height) % height;

        const dxFromCenter = renderX - width / 2;
        const dyFromCenter = renderY - height / 2;
        const renderXScaled = width / 2 + dxFromCenter * (1 + (currentWarpScale - 1) * 0.5);
        const renderYScaled = height / 2 + dyFromCenter * (1 + (currentWarpScale - 1) * 0.5);

        ctx.save();
        ctx.translate(renderXScaled, renderYScaled);
        ctx.rotate(galaxy.angle);
        ctx.scale(currentWarpScale, currentWarpScale);

        // Core central stellar illumination
        const coreGlowRad = galaxy.size * 0.7;
        const coreGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, coreGlowRad);
        coreGrad.addColorStop(0, galaxy.color);
        coreGrad.addColorStop(0.3, galaxy.coreGlow.replace("rgb", "rgba").replace(")", ", 0.2)"));
        coreGrad.addColorStop(1, "transparent");

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, coreGlowRad, 0, Math.PI * 2);
        ctx.fill();

        // Render spiral arms or elliptical shells based on galaxy types
        if (galaxy.type === "spiral" && graphicsModeRef.current !== "performance") {
          ctx.fillStyle = galaxy.color;
          const particlesCount = graphicsModeRef.current === "ultra" ? 90 : 45;
          const arms = galaxy.armCount || 2;
          for (let p = 0; p < particlesCount; p++) {
            const ratio = p / particlesCount;
            const spiralAngle = ratio * Math.PI * 3;
            const dist = ratio * galaxy.size;

            for (let a = 0; a < arms; a++) {
              const armOffset = a * (Math.PI * 2 / arms);
              const px = Math.cos(spiralAngle + armOffset) * dist;
              const py = Math.sin(spiralAngle + armOffset) * dist;
              const size = (1 - ratio) * 1.5 + 0.3;

              ctx.globalAlpha = (1 - ratio) * galaxy.alpha * 1.6;
              ctx.beginPath();
              ctx.arc(px, py, size, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (galaxy.type === "elliptical" && graphicsModeRef.current !== "performance") {
          // Draw overlapping rings represent light orbits
          ctx.strokeStyle = galaxy.color;
          for (let r = 1; r <= 3; r++) {
            ctx.globalAlpha = (0.4 / r) * galaxy.alpha;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.ellipse(0, 0, galaxy.size * (r * 0.33), galaxy.size * (r * 0.22), Math.PI / 6, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        ctx.restore();
        ctx.globalAlpha = 1.0;
      });

      // Render Layer 7: Nanophotonic Energy Ribbons
      if (!prefersReducedMotion && graphicsModeRef.current !== "performance") {
        ctx.strokeStyle = colorS.replace("rgb", "rgba").replace(")", ", 0.045)");
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        for (let x = 0; x < width; x += 40) {
          const ribbonY = height * 0.45 + Math.sin(x * 0.0035 + frame * 0.015) * 45 + Math.cos(x * 0.0012 - frame * 0.008) * 20 + cameraY * 0.5;
          if (x === 0) ctx.moveTo(x, ribbonY);
          else ctx.lineTo(x, ribbonY);
        }
        ctx.stroke();

        ctx.strokeStyle = colorP.replace("rgb", "rgba").replace(")", ", 0.03)");
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        for (let x = 0; x < width; x += 50) {
          const ribbonY2 = height * 0.55 + Math.cos(x * 0.004 + frame * 0.02) * 55 + Math.sin(x * 0.002 - frame * 0.01) * 25 + cameraY * 0.5;
          if (x === 0) ctx.moveTo(x, ribbonY2);
          else ctx.lineTo(x, ribbonY2);
        }
        ctx.stroke();
      }

      // Render Layer 5: Spacetime Gravitational Wave ripples
      const dist = distortionRef.current;
      if (dist.active) {
        dist.life--;
        dist.radius = (1 - dist.life / dist.duration) * Math.max(width, height) * 0.95;

        if (dist.life <= 0) {
          dist.active = false;
        }

        // Extremely subtle holographic ripple wavefront border (Curved spacetime projection)
        ctx.strokeStyle = colorP.replace("rgb", "rgba").replace(")", `, ${Math.sin((dist.life / dist.duration) * Math.PI) * 0.03})`);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(dist.x, dist.y, dist.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // CORE ILLUSTRATIONS: Academic physics models (Selected topics)
      // -------------------------------------------------------------
      if (selectedTopicIdRef.current === "relativity") {
        // Render heavy black hole mass with warping grid lines
        ctx.strokeStyle = "rgba(0, 243, 255, 0.065)";
        ctx.lineWidth = 0.5;
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const warpRadius = 260;

        // Vertical lines
        const step = graphicsModeRef.current === "performance" ? 100 : 50;
        for (let gx = 50; gx < width; gx += step) {
          ctx.beginPath();
          for (let gy = 0; gy < height; gy += 15) {
            const dx = gx - centerX;
            const dy = gy - centerY;
            const dist = Math.hypot(dx, dy) || 1;
            let wx = gx;
            let wy = gy;
            if (dist < warpRadius) {
              const pull = Math.pow(1 - dist / warpRadius, 2) * 55;
              wx -= (dx / dist) * pull;
              wy -= (dy / dist) * pull;
            }
            if (gy === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
        }

        // Horizontal lines
        for (let gy = 50; gy < height; gy += step) {
          ctx.beginPath();
          for (let gx = 0; gx < width; gx += 15) {
            const dx = gx - centerX;
            const dy = gy - centerY;
            const dist = Math.hypot(dx, dy) || 1;
            let wx = gx;
            let wy = gy;
            if (dist < warpRadius) {
              const pull = Math.pow(1 - dist / warpRadius, 2) * 55;
              wx -= (dx / dist) * pull;
              wy -= (dy / dist) * pull;
            }
            if (gx === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
        }

        // Heavy mass core halo (Einstein gravity)
        const starGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 65);
        starGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        starGrad.addColorStop(0.12, colorP.replace("rgb", "rgba").replace(")", ", 0.35)"));
        starGrad.addColorStop(0.5, colorS.replace("rgb", "rgba").replace(")", ", 0.1)"));
        starGrad.addColorStop(1, "transparent");
        ctx.fillStyle = starGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 65, 0, Math.PI * 2);
        ctx.fill();

        // Spacetime formulas
        ctx.fillStyle = colorP.replace("rgb", "rgba").replace(")", ", 0.45)");
        ctx.font = "italic 11px monospace";
        ctx.fillText("G_μν + Λ g_μν = 8πG/c⁴ T_μν", centerX - 90, centerY + 90);
        ctx.font = "10px monospace";
        ctx.fillText("Einstein Curved Spacetime Coordinate Grid", centerX - 120, centerY - 80);

        // Orbital particle node
        const orbitSpeed = frame * 0.016;
        const orbitX = centerX + Math.cos(orbitSpeed) * 115;
        const orbitY = centerY + Math.sin(orbitSpeed) * 60;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (selectedTopicIdRef.current === "entanglement") {
        // Paired Entangled Bell State illustration
        const px1 = width * 0.3;
        const py1 = height * 0.5;
        const px2 = width * 0.7;
        const py2 = height * 0.5;

        const breathing = Math.sin(frame * 0.03) * 6;
        const colorPhase = Math.sin(frame * 0.02);
        const syncColor = colorPhase > 0 ? colorP.replace("rgb", "rgba").replace(")", ", 0.45)") : colorS.replace("rgb", "rgba").replace(")", ", 0.45)");

        // Pair 1 node
        ctx.fillStyle = syncColor;
        ctx.beginPath();
        ctx.arc(px1, py1 + breathing, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.stroke();

        // Pair 2 node
        ctx.fillStyle = syncColor;
        ctx.beginPath();
        ctx.arc(px2, py2 - breathing, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Connection Bell filament
        ctx.strokeStyle = syncColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        const steps = 30;
        for (let s = 0; s <= steps; s++) {
          const ratio = s / steps;
          const sx = px1 + (px2 - px1) * ratio;
          const sy = (py1 + breathing) + (py2 - breathing - (py1 + breathing)) * ratio + Math.sin(ratio * Math.PI * 3 + frame * 0.04) * 15;
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = colorS.replace("rgb", "rgba").replace(")", ", 0.4)");
        ctx.font = "italic 11px monospace";
        ctx.fillText("|Ψ⁺⟩ = (|01⟩ + |10⟩) / √2", width * 0.5 - 90, height * 0.5 - 30);
      } else {
        // Telemetry guideline horizontal stripes (Observatory HUD vibe)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.007)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.2); ctx.lineTo(width, height * 0.2);
        ctx.moveTo(0, height * 0.5); ctx.lineTo(width, height * 0.5);
        ctx.moveTo(0, height * 0.8); ctx.lineTo(width, height * 0.8);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // SCIENTIFIC EVENTS: Rare Atmospheric & Orbital Phenonema
      // -------------------------------------------------------------
      const nowTime = Date.now();
      // Periodically trigger a rare event (shooting star, supernova, pulsar) to surprise user
      if (eventsRef.current.length < 2 && nowTime - lastEventTime.current > 25000 && Math.random() < 0.01 && !prefersReducedMotion && graphicsModeRef.current !== "performance") {
        lastEventTime.current = nowTime;
        const types: ("shooting_star" | "pulsar" | "supernova" | "quasar")[] = ["shooting_star", "pulsar", "supernova", "quasar"];
        const selectedType = types[Math.floor(Math.random() * types.length)];
        
        let targetX = Math.random() * width;
        let targetY = Math.random() * height;
        let colorTheme = selectedType === "supernova" ? colorS : (selectedType === "pulsar" ? colorP : "#ffffff");

        eventsRef.current.push({
          id: nowTime + Math.random(),
          type: selectedType,
          x: targetX,
          y: targetY,
          vx: selectedType === "shooting_star" ? (Math.random() * 8 + 6) : 0,
          vy: selectedType === "shooting_star" ? (Math.random() * 4 + 3) : 0,
          life: 0,
          maxLife: selectedType === "supernova" ? 350 : (selectedType === "pulsar" ? 600 : 120),
          size: selectedType === "supernova" ? 3 : (selectedType === "pulsar" ? 6 : 2),
          color: colorTheme,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: selectedType === "pulsar" ? 0.04 : 0
        });

        // Trigger safe acoustic notification synchronization! (Soft cinematic audio balance)
        if (audioService.isEnabled()) {
          if (selectedType === "supernova") {
            audioService.playNotification("completed");
          } else if (selectedType === "pulsar") {
            audioService.playCalibration("sparkle");
          }
        }
      }

      // Animate Active Events
      eventsRef.current = eventsRef.current.map((ev) => {
        ev.life++;

        if (ev.type === "shooting_star") {
          ev.x += ev.vx;
          ev.y += ev.vy;
          const peakAlpha = Math.sin((ev.life / ev.maxLife) * Math.PI) * 0.8;
          ctx.strokeStyle = ev.color;
          ctx.globalAlpha = peakAlpha;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(ev.x, ev.y);
          ctx.lineTo(ev.x - ev.vx * 3.5, ev.y - ev.vy * 3.5);
          ctx.stroke();
        } else if (ev.type === "supernova") {
          const ratio = ev.life / ev.maxLife;
          const peakAlpha = Math.sin(ratio * Math.PI) * 0.95;
          const sizeGrowth = ratio * 150;

          const supernovaGrad = ctx.createRadialGradient(ev.x, ev.y, 2, ev.x, ev.y, sizeGrowth);
          supernovaGrad.addColorStop(0, "#ffffff");
          supernovaGrad.addColorStop(0.15, ev.color);
          supernovaGrad.addColorStop(0.5, colorA.replace("rgb", "rgba").replace(")", ", 0.2)"));
          supernovaGrad.addColorStop(1, "transparent");

          ctx.fillStyle = supernovaGrad;
          ctx.globalAlpha = peakAlpha;
          ctx.beginPath();
          ctx.arc(ev.x, ev.y, sizeGrowth, 0, Math.PI * 2);
          ctx.fill();
        } else if (ev.type === "pulsar") {
          ev.angle = (ev.angle || 0) + (ev.rotSpeed || 0.02);
          const ratio = ev.life / ev.maxLife;
          const peakAlpha = Math.sin(ratio * Math.PI) * 0.75;

          ctx.save();
          ctx.translate(ev.x, ev.y);
          ctx.rotate(ev.angle);

          // Pulsar glowing core
          ctx.fillStyle = ev.color;
          ctx.globalAlpha = peakAlpha;
          ctx.beginPath();
          ctx.arc(0, 0, ev.size, 0, Math.PI * 2);
          ctx.fill();

          // Dual spinning quasar/pulsar jet beams
          ctx.strokeStyle = ev.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = peakAlpha * 0.45;
          ctx.beginPath();
          ctx.moveTo(0, -width);
          ctx.lineTo(0, width);
          ctx.stroke();

          ctx.restore();
        } else if (ev.type === "quasar") {
          const ratio = ev.life / ev.maxLife;
          const peakAlpha = Math.sin(ratio * Math.PI) * 0.7;
          ctx.strokeStyle = colorP.replace("rgb", "rgba").replace(")", ", 0.2)");
          ctx.lineWidth = 1;
          ctx.globalAlpha = peakAlpha;
          ctx.beginPath();
          ctx.moveTo(ev.x, 0);
          ctx.lineTo(ev.x, height);
          ctx.stroke();
        }

        return ev;
      }).filter((ev) => ev.life < ev.maxLife);
      ctx.globalAlpha = 1.0;

      // Render Layer 8: Nanophotonic Glass Reflections (Mouse hover focal spotlight)
      const m = mouseRef.current;
      if (m.isOver && !prefersReducedMotion) {
        // Draw spotlight
        const spotRad = 185;
        const spot = ctx.createRadialGradient(m.x, m.y, 5, m.x, m.y, spotRad);
        spot.addColorStop(0, colorP.replace("rgb", "rgba").replace(")", ", 0.016)"));
        spot.addColorStop(0.5, colorA.replace("rgb", "rgba").replace(")", ", 0.005)"));
        spot.addColorStop(1, "transparent");
        ctx.fillStyle = spot;
        ctx.beginPath();
        ctx.arc(m.x, m.y, spotRad, 0, Math.PI * 2);
        ctx.fill();

        // Render nanophotonic interactive trails
        m.trail.forEach((t) => {
          t.life -= 0.02;
          if (t.life > 0) {
            ctx.fillStyle = colorP.replace("rgb", "rgba").replace(")", `, ${t.life * 0.12})`);
            ctx.beginPath();
            ctx.arc(t.x, t.y, 4 * t.life, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        m.trail = m.trail.filter((t) => t.life > 0);
      }

      // Corner diagnostic tick lines (Academic instrument look)
      const borderMargin = 20;
      const borderLen = 14;
      ctx.strokeStyle = colorP.replace("rgb", "rgba").replace(")", ", 0.015)");
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      // Top Left
      ctx.moveTo(borderMargin, borderMargin + borderLen);
      ctx.lineTo(borderMargin, borderMargin);
      ctx.lineTo(borderMargin + borderLen, borderMargin);
      // Top Right
      ctx.moveTo(width - borderMargin, borderMargin + borderLen);
      ctx.lineTo(width - borderMargin, borderMargin);
      ctx.lineTo(width - borderMargin - borderLen, borderMargin);
      // Bottom Left
      ctx.moveTo(borderMargin, height - borderMargin - borderLen);
      ctx.lineTo(borderMargin, height - borderMargin);
      ctx.lineTo(borderMargin + borderLen, height - borderMargin);
      // Bottom Right
      ctx.moveTo(width - borderMargin, height - borderMargin - borderLen);
      ctx.lineTo(width - borderMargin, height - borderMargin);
      ctx.lineTo(width - borderMargin - borderLen, height - borderMargin);
      ctx.stroke();

      animationId = requestAnimationFrame(tick);
    };

    let animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [prefersReducedMotion, isTabActive]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-slate-950"
      style={{
        transform: "translate3d(0, 0, 0)" // Force GPU Compositor Acceleration
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block" 
        style={{ opacity: 0.85 }}
      />
    </div>
  );
}
