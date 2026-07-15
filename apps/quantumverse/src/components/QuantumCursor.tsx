import React, { useEffect, useRef, useState } from "react";
import { audioService } from "../utils/audioService";

interface QuantumCursorProps {
  isLoading?: boolean;
  activeModule?: string;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  type: "trail" | "burst" | "ripple" | "orbit";
  angle?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
}

interface EchoRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  color: string;
}

interface StateRipple {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  color: string;
}

// Premium Color Palette
const PALETTE = {
  electricBlue: "#00D4FF",
  quantumCyan: "#00FFF7",
  emeraldGreen: "#00FF88",
  neonLime: "#7CFF00",
  quantumRed: "#FF3B5C",
  softViolet: "#8A6CFF",
  whiteEnergy: "#F8FDFF"
};

export default function QuantumCursor({ isLoading = false, activeModule = "dashboard" }: QuantumCursorProps) {
  const [hoverType, setHoverType] = useState<"default" | "button" | "card" | "link" | "map">("default");
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [ripples, setRipples] = useState<StateRipple[]>([]);

  // Position references
  const mousePosRef = useRef({ x: -200, y: -200 });
  const corePosRef = useRef({ x: -200, y: -200 });
  const ringPosRef = useRef({ x: -200, y: -200 });
  
  // Element references for direct style updates
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction tracking
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const isMouseDownRef = useRef(false);
  const lastMousePosRef = useRef({ x: -200, y: -200 });
  const lastMouseMoveTimeRef = useRef(0);

  // Sound cooldowns
  const lastHoverSoundTimeRef = useRef(0);
  const lastClickSoundTimeRef = useRef(0);

  // Active state synchronization refs
  const isLoadingRef = useRef(isLoading);
  const hoverTypeRef = useRef(hoverType);
  const isDraggingRef = useRef(isDragging);
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  const isTabActiveRef = useRef(isTabActive);
  const activeModuleRef = useRef(activeModule);

  // Interaction weights for dynamic RGB spectrum core
  const targetWeightsRef = useRef({ r: 0.1, g: 0.2, b: 0.7, w: 0.0 });
  const currentWeightsRef = useRef({ r: 0.1, g: 0.2, b: 0.7, w: 0.0 });
  const clickPulseRef = useRef(0);
  const quantumJumpTimerRef = useRef(0);

  // Nearby Glass Panels Caching for real-time reflections
  const glassPanelsRef = useRef<DOMRect[]>([]);

  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { hoverTypeRef.current = hoverType; }, [hoverType]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { prefersReducedMotionRef.current = prefersReducedMotion; }, [prefersReducedMotion]);
  useEffect(() => { isTabActiveRef.current = isTabActive; }, [isTabActive]);
  useEffect(() => { activeModuleRef.current = activeModule; }, [activeModule]);

  // Check accessibility and document active status
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Animation loop for state-managed ripples using requestAnimationFrame (60FPS GPU accelerated)
  useEffect(() => {
    if (ripples.length === 0) return;

    let animId: number;

    const animate = () => {
      setRipples((prev) => {
        const next = prev
          .map((r) => ({
            ...r,
            scale: r.scale + 0.07, // smooth dispersion rate
            opacity: r.opacity - 0.025, // smooth fading rate
          }))
          .filter((r) => r.opacity > 0);

        if (next.length > 0) {
          animId = requestAnimationFrame(animate);
        }
        return next;
      });
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [ripples.length]);

  // Define module-specific colors matching the premium theme
  const getColors = (module: string | undefined) => {
    switch (module) {
      case "mentor":
        return {
          primary: PALETTE.whiteEnergy,
          secondary: PALETTE.quantumCyan,
          glow: "rgba(0, 255, 247, 0.45)",
          trail: "rgba(0, 255, 247, 0.65)"
        };
      case "sims":
        return {
          primary: PALETTE.quantumCyan,
          secondary: PALETTE.softViolet,
          glow: "rgba(138, 108, 255, 0.5)",
          trail: "rgba(138, 108, 255, 0.65)"
        };
      case "playground":
        return {
          primary: PALETTE.neonLime,
          secondary: PALETTE.emeraldGreen,
          glow: "rgba(0, 255, 136, 0.5)",
          trail: "rgba(124, 255, 0, 0.65)"
        };
      case "quiz":
        return {
          primary: "#FFD700",
          secondary: PALETTE.quantumRed,
          glow: "rgba(255, 59, 92, 0.45)",
          trail: "rgba(255, 215, 0, 0.65)"
        };
      case "hub":
        return {
          primary: PALETTE.emeraldGreen,
          secondary: PALETTE.neonLime,
          glow: "rgba(0, 255, 136, 0.4)",
          trail: "rgba(124, 255, 0, 0.6)"
        };
      case "dashboard":
      default:
        return {
          primary: PALETTE.electricBlue,
          secondary: PALETTE.quantumCyan,
          glow: "rgba(0, 212, 255, 0.45)",
          trail: "rgba(0, 255, 247, 0.65)"
        };
    }
  };

  // Event handler for mouse movement and delegation (registered once, zero memory leak or tearing)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveTimeRef.current = Date.now();

      // Handle dragging threshold
      if (isMouseDownRef.current && !isDraggingRef.current) {
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        if (Math.sqrt(dx * dx + dy * dy) > 4) {
          setIsDragging(true);
          isDraggingRef.current = true;
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      const now = Date.now();
      if (now - lastClickSoundTimeRef.current > 40) {
        lastClickSoundTimeRef.current = now;
        audioService.playClick("tap");
        
        // Lower frequency tactile sound on click
        setTimeout(() => {
          audioService.playPressed("haptic");
        }, 12);
      }

      // 1. Click Ripple (Click Animation)
      const baseId = Date.now() + Math.random();
      const clickColor = getColors(activeModuleRef.current).secondary;
      const newRipple: StateRipple = {
        id: baseId,
        x: e.clientX,
        y: e.clientY,
        scale: 0.1,
        opacity: 1.0,
        color: clickColor,
      };

      setRipples((prev) => [...prev, newRipple]);

      // Set Click Red Pulse interaction trigger
      clickPulseRef.current = 1.0;

      // Spawn physics particles (Photon explosion)
      triggerClickPhysics(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      setIsDragging(false);
      isDraggingRef.current = false;
    };

    // Global Event Delegation for Interactive Element Hovers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Classify the hovered element using hierarchical traversal
      let current: HTMLElement | null = target;
      let depth = 0;
      let detectedType: "default" | "button" | "card" | "link" | "map" = "default";
      let matchedElement: HTMLElement | null = null;

      while (current && depth < 4) {
        if (
          current.tagName === "BUTTON" ||
          current.getAttribute("role") === "button" ||
          current.classList.contains("btn") ||
          current.classList.contains("clickable") ||
          current.classList.contains("nav-item") ||
          current.classList.contains("tab-selector")
        ) {
          detectedType = "button";
          matchedElement = current;
          break;
        }
        if (
          current.tagName === "A" ||
          current.classList.contains("cursor-pointer") ||
          current.classList.contains("hover:underline")
        ) {
          detectedType = "link";
          matchedElement = current;
          break;
        }
        if (
          current.classList.contains("card") ||
          current.classList.contains("rounded-xl") ||
          current.classList.contains("border-white/5") ||
          current.classList.contains("quantum-glass") ||
          current.classList.contains("glass-panel")
        ) {
          detectedType = "card";
          matchedElement = current;
          break;
        }
        if (
          current.tagName === "CANVAS" ||
          current.classList.contains("quantum-map") ||
          current.classList.contains("interactive-grid") ||
          current.classList.contains("particle-stage")
        ) {
          detectedType = "map";
          matchedElement = current;
          break;
        }
        current = current.parentElement;
        depth++;
      }

      if (detectedType !== "default" && matchedElement) {
        setHoverType(detectedType);

        // Play refined hover audio only once per transition to prevent spamming
        if (hoveredElementRef.current !== matchedElement) {
          hoveredElementRef.current = matchedElement;
          
          const now = Date.now();
          if (now - lastHoverSoundTimeRef.current > 150) {
            lastHoverSoundTimeRef.current = now;

            if (detectedType === "button") {
              audioService.playHover("shimmer", 0.55);
              audioService.playHover("tick", 0.85);
            } else if (detectedType === "link") {
              audioService.playHover("sparkle", 0.65);
            } else if (detectedType === "card") {
              audioService.playHover("tick", 0.4);
            } else if (detectedType === "map") {
              audioService.playHover("shimmer", 0.4);
            }
          }

          // Emit a mini particle burst at current mouse position to draw focus
          emitMiniBurst(e.clientX, e.clientY, detectedType);
          
          if (detectedType === "button") {
            matchedElement.classList.add("cursor-hover-active-btn");
          } else if (detectedType === "card") {
            matchedElement.classList.add("cursor-hover-active-card");
          }
        }
      } else {
        // Reset state
        if (hoveredElementRef.current) {
          hoveredElementRef.current.classList.remove("cursor-hover-active-btn");
          hoveredElementRef.current.classList.remove("cursor-hover-active-card");
          hoveredElementRef.current = null;
        }
        setHoverType("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Click physics particle spawner & Mini bursts
  const particlesRef = useRef<TrailParticle[]>([]);
  const echoRingsRef = useRef<EchoRing[]>([]);

  const emitMiniBurst = (x: number, y: number, type: string) => {
    if (prefersReducedMotionRef.current) return;
    const colors = getColors(activeModuleRef.current);
    const count = type === "button" ? 8 : 5;
    const color = type === "button" ? colors.secondary : colors.primary;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.8 + 0.6;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2 + 1,
        alpha: 0.95,
        decay: Math.random() * 0.04 + 0.02,
        color,
        type: "burst"
      });
    }
  };

  const triggerClickPhysics = (x: number, y: number) => {
    const colors = getColors(activeModuleRef.current);

    // Spawn quantum echo rings
    echoRingsRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius: prefersReducedMotionRef.current ? 40 : 80,
      alpha: 1.0,
      speed: prefersReducedMotionRef.current ? 3.0 : 4.5,
      color: colors.primary
    });

    // Spawn expanding click particles (Photon Explosion - 15 to 20 photons)
    const particleCount = prefersReducedMotionRef.current ? 6 : 18;
    const palette = [PALETTE.quantumRed, PALETTE.quantumCyan, PALETTE.electricBlue, "#ffffff"];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 3.5 + 2.0;
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.8 + 1.2,
        alpha: 1.0,
        decay: Math.random() * 0.03 + 0.015,
        color: palette[i % palette.length],
        type: "ripple"
      });
    }
  };

  // High performance Canvas and DOM render loops running at maximum monitor FPS with Retina display adaptation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initializer position setup
    corePosRef.current = { ...mousePosRef.current };
    ringPosRef.current = { ...mousePosRef.current };

    let frameCount = 0;
    let animationId: number;

    const tick = () => {
      if (!isTabActiveRef.current) {
        animationId = requestAnimationFrame(tick);
        return;
      }
      frameCount++;

      ctx.clearRect(0, 0, width, height);

      // Cache / query glass panel rects on screen periodically
      if (frameCount % 60 === 1) {
        const elements = document.querySelectorAll(".quantum-glass, .glass-panel, .card, button");
        const rects: DOMRect[] = [];
        elements.forEach((el) => {
          rects.push(el.getBoundingClientRect());
        });
        glassPanelsRef.current = rects;
      }

      // 1. POSITION INTERPOLATION (Weighted double-element inertia)
      const targetX = mousePosRef.current.x;
      const targetY = mousePosRef.current.y;

      const isInteractive = hoverTypeRef.current !== "default";
      const coreEase = prefersReducedMotionRef.current ? 1.0 : (isInteractive ? 0.22 : 0.36);
      const ringEase = prefersReducedMotionRef.current ? 1.0 : (isInteractive ? 0.08 : 0.12);

      corePosRef.current.x += (targetX - corePosRef.current.x) * coreEase;
      corePosRef.current.y += (targetY - corePosRef.current.y) * coreEase;

      ringPosRef.current.x += (targetX - ringPosRef.current.x) * ringEase;
      ringPosRef.current.y += (targetY - ringPosRef.current.y) * ringEase;

      // Calculate moving velocity & sweep direction for cursor warp and hyperdrive trail stretching
      const dx = targetX - lastMousePosRef.current.x;
      const dy = targetY - lastMousePosRef.current.y;
      const distMoved = Math.hypot(dx, dy);

      // Trigger Quantum Jump (all merge to white energy core on swift sweep)
      if (distMoved > 25 && quantumJumpTimerRef.current === 0) {
        quantumJumpTimerRef.current = 20; // 20 frames of white warp
      }
      if (quantumJumpTimerRef.current > 0) {
        quantumJumpTimerRef.current--;
      }

      // Handle click pulse decay
      if (clickPulseRef.current > 0) {
        clickPulseRef.current -= 0.05;
        if (clickPulseRef.current < 0) clickPulseRef.current = 0;
      }

      // 2. ADAPTIVE RGB ENERGY CORE WEIGHT INTERPOLATION
      // Setup dynamic ratio target
      let targetWeights = { r: 0.1, g: 0.2, b: 0.7, w: 0.0 };

      if (isLoadingRef.current || isDraggingRef.current || quantumJumpTimerRef.current > 0) {
        targetWeights = { r: 0.0, g: 0.0, b: 0.0, w: 1.0 }; // Merge to brilliant white core
      } else if (clickPulseRef.current > 0) {
        // Red dominant transition on click
        const clickRatio = clickPulseRef.current;
        const baseR = hoverTypeRef.current !== "default" ? 0.05 : 0.10;
        const baseG = hoverTypeRef.current !== "default" ? 0.85 : 0.20;
        const baseB = hoverTypeRef.current !== "default" ? 0.10 : 0.70;

        targetWeights = {
          r: 0.95 * clickRatio + baseR * (1 - clickRatio),
          g: 0.03 * clickRatio + baseG * (1 - clickRatio),
          b: 0.02 * clickRatio + baseB * (1 - clickRatio),
          w: 0.0
        };
      } else if (hoverTypeRef.current !== "default") {
        targetWeights = { r: 0.05, g: 0.85, b: 0.10, w: 0.0 }; // Green dominant hover
      } else {
        targetWeights = { r: 0.10, g: 0.20, b: 0.70, w: 0.0 }; // Blue dominant idle (70% Blue, 20% Green, 10% Red)
      }

      // Smooth weight interpolation
      const weightEase = 0.12;
      currentWeightsRef.current.r += (targetWeights.r - currentWeightsRef.current.r) * weightEase;
      currentWeightsRef.current.g += (targetWeights.g - currentWeightsRef.current.g) * weightEase;
      currentWeightsRef.current.b += (targetWeights.b - currentWeightsRef.current.b) * weightEase;
      currentWeightsRef.current.w += (targetWeights.w - currentWeightsRef.current.w) * weightEase;

      const weightSum = currentWeightsRef.current.r + currentWeightsRef.current.g + currentWeightsRef.current.b + currentWeightsRef.current.w || 1.0;
      const rw = currentWeightsRef.current.r / weightSum;
      const gw = currentWeightsRef.current.g / weightSum;
      const bw = currentWeightsRef.current.b / weightSum;
      const ww = currentWeightsRef.current.w / weightSum;

      // Nucleus smooth color blend
      const nr = Math.round(255 * rw + 0 * gw + 0 * bw + 248 * ww);
      const ng = Math.round(59 * rw + 255 * gw + 212 * bw + 253 * ww);
      const nb = Math.round(92 * rw + 136 * gw + 255 * bw + 255 * ww);
      const nucleusColor = `rgb(${nr}, ${ng}, ${nb})`;

      // 3. DYNAMIC GLASS REFLECTIONS
      if (!prefersReducedMotionRef.current && mousePosRef.current.x > 0) {
        glassPanelsRef.current.forEach((rect) => {
          const distanceToPanel = Math.hypot(
            targetX - Math.max(rect.left, Math.min(targetX, rect.right)),
            targetY - Math.max(rect.top, Math.min(targetY, rect.bottom))
          );
          
          if (distanceToPanel < 160) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(rect.left, rect.top, rect.width, rect.height);
            ctx.clip();

            const grad = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 150);
            grad.addColorStop(0, `rgba(${nr}, ${ng}, ${nb}, 0.12)`);
            grad.addColorStop(0.5, `rgba(${nr}, ${ng}, ${nb}, 0.03)`);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
            
            ctx.restore();
          }
        });
      }

      // 4. QUANTUM AURA (Overlapping smooth plasma & volumetric energy fog)
      if (!prefersReducedMotionRef.current && mousePosRef.current.x > 0) {
        const auraRadius = 35 + Math.sin(frameCount * 0.04) * 4;
        
        // Blue plasma component
        if (bw > 0.02) {
          const bx = corePosRef.current.x + Math.cos(frameCount * 0.025) * 3;
          const by = corePosRef.current.y + Math.sin(frameCount * 0.025) * 3;
          const gradB = ctx.createRadialGradient(bx, by, 0, bx, by, auraRadius);
          gradB.addColorStop(0, `rgba(0, 212, 255, ${0.16 * bw})`);
          gradB.addColorStop(0.5, `rgba(0, 212, 255, ${0.05 * bw})`);
          gradB.addColorStop(1, "transparent");
          ctx.fillStyle = gradB;
          ctx.beginPath();
          ctx.arc(bx, by, auraRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Green plasma component
        if (gw > 0.02) {
          const gx = corePosRef.current.x + Math.cos(frameCount * 0.03 + Math.PI * 0.6) * 3;
          const gy = corePosRef.current.y + Math.sin(frameCount * 0.03 + Math.PI * 0.6) * 3;
          const gradG = ctx.createRadialGradient(gx, gy, 0, gx, gy, auraRadius * 0.95);
          gradG.addColorStop(0, `rgba(0, 255, 136, ${0.14 * gw})`);
          gradG.addColorStop(0.5, `rgba(0, 255, 136, ${0.04 * gw})`);
          gradG.addColorStop(1, "transparent");
          ctx.fillStyle = gradG;
          ctx.beginPath();
          ctx.arc(gx, gy, auraRadius * 0.95, 0, Math.PI * 2);
          ctx.fill();
        }

        // Red plasma component
        if (rw > 0.02) {
          const rx = corePosRef.current.x + Math.cos(frameCount * 0.035 + Math.PI * 1.2) * 4;
          const ry = corePosRef.current.y + Math.sin(frameCount * 0.035 + Math.PI * 1.2) * 4;
          const gradR = ctx.createRadialGradient(rx, ry, 0, rx, ry, auraRadius * 1.05);
          gradR.addColorStop(0, `rgba(255, 59, 92, ${0.2 * rw})`);
          gradR.addColorStop(0.5, `rgba(255, 59, 92, ${0.06 * rw})`);
          gradR.addColorStop(1, "transparent");
          ctx.fillStyle = gradR;
          ctx.beginPath();
          ctx.arc(rx, ry, auraRadius * 1.05, 0, Math.PI * 2);
          ctx.fill();
        }

        // White energy component
        if (ww > 0.02) {
          const wx = corePosRef.current.x + Math.cos(frameCount * 0.04) * 2;
          const wy = corePosRef.current.y + Math.sin(frameCount * 0.04) * 2;
          const gradW = ctx.createRadialGradient(wx, wy, 0, wx, wy, auraRadius * 0.85);
          gradW.addColorStop(0, `rgba(248, 253, 255, ${0.25 * ww})`);
          gradW.addColorStop(0.4, `rgba(0, 212, 255, ${0.08 * ww})`);
          gradW.addColorStop(1, "transparent");
          ctx.fillStyle = gradW;
          ctx.beginPath();
          ctx.arc(wx, wy, auraRadius * 0.85, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. FIVE INDEPENDENT ELECTRON ORBITS WITH 3D ELLIPTICAL TILT
      const speedMultiplier = rw > 0.4 ? 1.5 : (gw > 0.4 ? 0.8 : 1.0);
      const angle1 = frameCount * 0.05 * speedMultiplier;
      const angle2 = -frameCount * 0.038 * speedMultiplier + Math.PI * 0.4;
      const angle3 = frameCount * 0.07 * speedMultiplier + Math.PI * 0.85; // fast red orbit
      const angle4 = -frameCount * 0.028 * speedMultiplier + Math.PI * 1.3;
      const angle5 = frameCount * 0.018 * speedMultiplier + Math.PI * 1.7;

      const get3DCoords = (radius: number, tilt: number, angle: number) => {
        const rx = radius * Math.cos(angle);
        const ry = radius * Math.sin(angle) * 0.35; // ellipse flattening
        return {
          x: corePosRef.current.x + rx * Math.cos(tilt) - ry * Math.sin(tilt),
          y: corePosRef.current.y + rx * Math.sin(tilt) + ry * Math.cos(tilt)
        };
      };

      const el1 = get3DCoords(16, Math.PI / 6, angle1);
      const el2 = get3DCoords(23, -Math.PI / 4, angle2);
      const el3 = get3DCoords(30, Math.PI / 3, angle3);
      const el4 = get3DCoords(37, -Math.PI / 6, angle4);
      const el5 = get3DCoords(44, Math.PI / 2, angle5);

      const drawOrbitLine = (radius: number, tilt: number, color: string, rotationOffset: number, isRGBGradient: boolean) => {
        ctx.save();
        ctx.translate(corePosRef.current.x, corePosRef.current.y);
        ctx.rotate(tilt);
        ctx.scale(1, 0.35);

        if (isRGBGradient) {
          const segments = 36;
          for (let s = 0; s < segments; s++) {
            const angleStart = (s / segments) * Math.PI * 2 + rotationOffset;
            const angleEnd = ((s + 1) / segments) * Math.PI * 2 + rotationOffset;
            
            ctx.strokeStyle = `hsla(${(s / segments) * 360 + frameCount * 1.5}, 90%, 65%, 0.18)`;
            ctx.lineWidth = 0.95;
            ctx.beginPath();
            ctx.moveTo(radius * Math.cos(angleStart), radius * Math.sin(angleStart));
            ctx.lineTo(radius * Math.cos(angleEnd), radius * Math.sin(angleEnd));
            ctx.stroke();
          }
        } else {
          ctx.strokeStyle = color;
          ctx.globalAlpha = ww > 0.5 ? 0.1 : 0.18;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      };

      if (!prefersReducedMotionRef.current && mousePosRef.current.x > 0) {
        // Draw Orbits
        drawOrbitLine(16, Math.PI / 6, PALETTE.electricBlue, 0, false); // Orbit 1: Blue
        drawOrbitLine(23, -Math.PI / 4, PALETTE.emeraldGreen, 0, false); // Orbit 2: Green
        drawOrbitLine(30, Math.PI / 3, PALETTE.quantumRed, 0, false); // Orbit 3: Red
        drawOrbitLine(37, -Math.PI / 6, "", frameCount * 0.01, true); // Orbit 4: RGB Gradient
        drawOrbitLine(44, Math.PI / 2, PALETTE.whiteEnergy, 0, false); // Orbit 5: White energy
      }

      // 6. ADAPTIVE ELECTRONS ORBITING & EXCHANGING COLORS
      const cycleOffset = Math.floor(frameCount / 90) % 5;
      const electronColors = [
        PALETTE.electricBlue,
        PALETTE.emeraldGreen,
        PALETTE.quantumRed,
        PALETTE.quantumCyan,
        PALETTE.whiteEnergy
      ];

      const getExchangeColor = (index: number) => {
        return electronColors[(index + cycleOffset) % 5];
      };

      const drawElectronGlow = (coords: { x: number, y: number }, color: string) => {
        ctx.save();
        const grad = ctx.createRadialGradient(coords.x, coords.y, 0, coords.x, coords.y, 5);
        grad.addColorStop(0, color);
        grad.addColorStop(0.4, `${color}44`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      if (!prefersReducedMotionRef.current && mousePosRef.current.x > 0) {
        drawElectronGlow(el1, getExchangeColor(0));
        drawElectronGlow(el2, getExchangeColor(1));
        drawElectronGlow(el3, getExchangeColor(2));
        drawElectronGlow(el4, getExchangeColor(3));
        drawElectronGlow(el5, getExchangeColor(4));

        // Inject tiny stardust trail particles from moving electrons
        if (frameCount % 2 === 0) {
          const positions = [
            { c: el1, col: getExchangeColor(0) },
            { c: el2, col: getExchangeColor(1) },
            { c: el3, col: getExchangeColor(2) },
            { c: el4, col: getExchangeColor(3) },
            { c: el5, col: getExchangeColor(4) }
          ];
          positions.forEach((p) => {
            particlesRef.current.push({
              x: p.c.x,
              y: p.c.y,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              size: Math.random() * 1.3 + 0.6,
              alpha: 0.85,
              decay: Math.random() * 0.05 + 0.035,
              color: p.col,
              type: "orbit"
            });
          });
        }
      }

      // 7. MULTI-COLOR RADIAL GRADIENT RETICLE & SCANNING BRACKETS
      // Drawn centered on ringPosRef
      if (!prefersReducedMotionRef.current && mousePosRef.current.x > 0) {
        const drawReticle = (cx: number, cy: number, scale: number) => {
          ctx.save();
          ctx.translate(cx, cy);
          
          const ringRadius = 14 * scale;
          
          if (isLoadingRef.current) {
            ctx.strokeStyle = `rgba(${nr}, ${ng}, ${nb}, 0.75)`;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, frameCount * 0.05, frameCount * 0.05 + Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = `rgb(${nr}, ${ng}, ${nb})`;
            ctx.beginPath();
            ctx.arc(0, -ringRadius, 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (isDraggingRef.current) {
            ctx.strokeStyle = PALETTE.softViolet;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius * 1.2, 0, Math.PI * 2);
            ctx.stroke();
            
            const pingPhase = (frameCount * 0.05) % 1;
            ctx.strokeStyle = `rgba(138, 108, 255, ${1 - pingPhase})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius * 1.2 + pingPhase * 12, 0, Math.PI * 2);
            ctx.stroke();
          } else if (hoverTypeRef.current === "button") {
            ctx.strokeStyle = PALETTE.quantumCyan;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius * 1.15, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = PALETTE.emeraldGreen;
            ctx.fillRect(-0.5, -ringRadius * 1.3, 1, 3);
            ctx.fillRect(-0.5, ringRadius * 0.9, 1, 3);
            ctx.fillRect(-ringRadius * 1.3, -0.5, 3, 1);
            ctx.fillRect(ringRadius * 0.9, -0.5, 3, 1);
          } else if (hoverTypeRef.current === "map") {
            ctx.strokeStyle = PALETTE.electricBlue;
            ctx.lineWidth = 1;
            ctx.strokeRect(-ringRadius, -ringRadius, ringRadius * 2, ringRadius * 2);
            
            ctx.strokeStyle = `rgba(0, 212, 255, 0.55)`;
            ctx.beginPath();
            ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
            ctx.moveTo(0, -4); ctx.lineTo(0, 4);
            ctx.stroke();
          } else if (hoverTypeRef.current === "link") {
            ctx.strokeStyle = PALETTE.quantumCyan;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.stroke();
          } else if (hoverTypeRef.current === "card") {
            ctx.strokeStyle = `rgba(${nr}, ${ng}, ${nb}, 0.5)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius * 1.1, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.strokeStyle = `rgba(${nr}, ${ng}, ${nb}, 0.65)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius + 1.2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius - 1.2, 0, Math.PI * 2);
            ctx.stroke();
          }
          
          ctx.restore();
        };

        const currentScale = isLoadingRef.current 
          ? 1.15 + Math.sin(frameCount * 0.08) * 0.1 
          : (isDraggingRef.current ? 1.35 : (hoverTypeRef.current === "button" ? 1.3 : (hoverTypeRef.current === "card" ? 1.1 : (hoverTypeRef.current === "link" ? 0.9 : (hoverTypeRef.current === "map" ? 1.45 : 1.0 + Math.sin(frameCount * 0.04) * 0.04)))));

        drawReticle(ringPosRef.current.x, ringPosRef.current.y, currentScale);
      }

      // 8. QUANTUM NUCLEUS CENTER CORE (Breathing with sparks)
      if (mousePosRef.current.x > 0) {
        const baseRadius = 4.5 + Math.sin(frameCount * 0.08) * 0.5;
        const pulseFreq = rw > 0.4 ? 0.25 : (gw > 0.4 ? 0.05 : 0.08);
        const redOffset = rw > 0.4 ? Math.sin(frameCount * pulseFreq) * 1.5 : 0;
        const coreRadius = baseRadius + redOffset;

        ctx.save();
        const outerGlow = ctx.createRadialGradient(corePosRef.current.x, corePosRef.current.y, 1, corePosRef.current.x, corePosRef.current.y, coreRadius * 3);
        outerGlow.addColorStop(0, `rgba(${nr}, ${ng}, ${nb}, 0.66)`);
        outerGlow.addColorStop(0.5, `rgba(${nr}, ${ng}, ${nb}, 0.27)`);
        outerGlow.addColorStop(1, "transparent");
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(corePosRef.current.x, corePosRef.current.y, coreRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = ww > 0.5 ? "#ffffff" : nucleusColor;
        ctx.beginPath();
        ctx.arc(corePosRef.current.x, corePosRef.current.y, coreRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(corePosRef.current.x, corePosRef.current.y, coreRadius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Emit high-energy red sparks during excited state
        if (rw > 0.4 && frameCount % 6 === 0 && !prefersReducedMotionRef.current) {
          const sparkAngle = Math.random() * Math.PI * 2;
          particlesRef.current.push({
            x: corePosRef.current.x + Math.cos(sparkAngle) * 3,
            y: corePosRef.current.y + Math.sin(sparkAngle) * 3,
            vx: Math.cos(sparkAngle) * (Math.random() * 0.8 + 0.4),
            vy: Math.sin(sparkAngle) * (Math.random() * 0.8 + 0.4),
            size: Math.random() * 1.2 + 0.5,
            alpha: 1.0,
            decay: 0.06,
            color: PALETTE.quantumRed,
            type: "burst"
          });
        }
      }

      // 9. DRAW HOLO RETICLES OVER HOVERED BOXES
      if (hoveredElementRef.current && !prefersReducedMotionRef.current) {
        try {
          const rect = hoveredElementRef.current.getBoundingClientRect();
          const pad = 6;
          const x = rect.left - pad;
          const y = rect.top - pad;
          const w = rect.width + pad * 2;
          const h = rect.height + pad * 2;
          const len = Math.min(12, w * 0.15);

          ctx.strokeStyle = `rgba(${nr}, ${ng}, ${nb}, 0.55)`;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.45 + Math.sin(frameCount * 0.08) * 0.15;

          // Corners
          ctx.beginPath();
          ctx.moveTo(x + len, y); ctx.lineTo(x, y); ctx.lineTo(x, y + len);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x + len, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - len);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x + w - len, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - len);
          ctx.stroke();

          // Laser line scanner
          const scanHeight = h + 20;
          const scanProgress = (frameCount * 1.8) % scanHeight;
          const scanY = y + scanProgress - 10;
          
          if (scanY > y && scanY < y + h) {
            ctx.strokeStyle = `rgba(${nr}, ${ng}, ${nb}, 0.28)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 2, scanY);
            ctx.lineTo(x + w - 2, scanY);
            ctx.stroke();

            ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, 0.45)`;
            ctx.fillRect(x + w - 6, scanY - 1, 4, 2);
          }
          ctx.globalAlpha = 1.0;
        } catch (e) {
          // Safeguard
        }
      }

      // 10. SPAWN FLOATING DRIFT PARTICLES & UPDATE
      if (distMoved > 1.2 && !prefersReducedMotionRef.current) {
        const trailColor = `rgba(${nr}, ${ng}, ${nb}, 0.65)`;
        const pCount = Math.min(3, Math.floor(distMoved / 3.5) + 1);
        for (let i = 0; i < pCount; i++) {
          particlesRef.current.push({
            x: corePosRef.current.x,
            y: corePosRef.current.y,
            vx: (Math.random() - 0.5) * 0.5 - (targetX - corePosRef.current.x) * 0.03,
            vy: (Math.random() - 0.5) * 0.5 - (targetY - corePosRef.current.y) * 0.03,
            size: Math.random() * 1.6 + 0.6,
            alpha: 0.85,
            decay: Math.random() * 0.06 + 0.04,
            color: trailColor,
            type: "trail"
          });
        }
      }

      // Physics Echo rings
      echoRingsRef.current = echoRingsRef.current.map((r) => ({
        ...r,
        radius: r.radius + r.speed,
        alpha: r.alpha - 0.035
      })).filter((r) => r.alpha > 0);

      echoRingsRef.current.forEach((r) => {
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = r.alpha;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = r.alpha * 0.4;
        ctx.beginPath();
        ctx.setLineDash([4, 6]);
        ctx.arc(r.x, r.y, r.radius * 1.25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Update trail physics particles with motion blur / hyperdrive stretching
      particlesRef.current = particlesRef.current.map((p) => {
        let vx = p.vx;
        let vy = p.vy;

        if (p.type === "trail") {
          vx += (Math.random() - 0.5) * 0.06;
          vy += (Math.random() - 0.5) * 0.06;
        }

        return {
          ...p,
          x: p.x + vx,
          y: p.y + vy,
          vx,
          vy,
          alpha: p.alpha - p.decay
        };
      }).filter((p) => p.alpha > 0);

      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        
        // HYPERDRIVE: Stretch trail particles into photon lines on fast motion
        if (p.type === "trail" && distMoved > 4) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      lastMousePosRef.current = { x: targetX, y: targetY };
      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* High-Performance Micro Particle & Reticle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* State-Managed 'Quantum Echo' GPU-Accelerated Ripples (requested click ripples) */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none will-change-transform"
          style={{
            width: "120px",
            height: "120px",
            borderColor: ripple.color,
            opacity: ripple.opacity,
            transform: `translate3d(${ripple.x}px, ${ripple.y}px, 0) scale(${ripple.scale})`,
            borderWidth: "1.5px",
            boxShadow: `0 0 15px ${ripple.color}, inset 0 0 15px ${ripple.color}`,
          }}
        />
      ))}

      {/* Hidden container references to preserve ref pointer bindings perfectly */}
      <div ref={ringRef} style={{ display: "none" }} />
      <div ref={coreRef} style={{ display: "none" }} />
    </div>
  );
}
