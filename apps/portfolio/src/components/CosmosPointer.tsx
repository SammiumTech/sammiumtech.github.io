import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function CosmosPointer() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // References to keep trail and mouse coordinates out of React state to avoid infinite re-renders
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const clickActiveRef = useRef(false);
  const clickTimeRef = useRef(0);
  const clickCoordsRef = useRef({ x: 0, y: 0 });

  // Refs for DOM nodes to animate them directly
  const pointerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Settings
  const numParticles = 12;
  const trailRef = useRef<Particle[]>([]);

  // Initialize particles
  useEffect(() => {
    setMounted(true);
    
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleReducedMotionChange);

    // Initial trail creation
    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: Math.max(1.5, 6 - (i * 0.45)), // fading size
      });
    }
    trailRef.current = particles;

    return () => {
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);

  // Sync mouse position and interactiveness
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      clickActiveRef.current = true;
      clickTimeRef.current = Date.now();
      clickCoordsRef.current = { x: e.clientX, y: e.clientY };
      
      // Temporary click class on body or element to support animations
      if (pointerRef.current) {
        pointerRef.current.classList.add("click-pulse");
        setTimeout(() => {
          pointerRef.current?.classList.remove("click-pulse");
        }, 300);
      }
    };

    const handleMouseUp = () => {
      clickActiveRef.current = false;
    };

    // Global event delegation for hovering over interactive items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest("a, button, [role='button'], input, select, textarea, .cursor-pointer")) {
        isHoveringRef.current = true;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest("a, button, [role='button'], input, select, textarea, .cursor-pointer")) {
        isHoveringRef.current = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [mounted]);

  // Main animation / physics loop
  useEffect(() => {
    if (!mounted) return;

    let animFrameId: number;
    let canvas = canvasRef.current;
    let ctx = canvas ? canvas.getContext("2d") : null;

    const updateCanvasSize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Physics parameters
    const spring = 0.16;
    const friction = 0.58;

    const tick = () => {
      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      // Update main cursor node positions directly
      if (pointerRef.current) {
        const offset = isHoveringRef.current ? 12 : 8;
        pointerRef.current.style.transform = `translate3d(${mX - offset}px, ${mY - offset}px, 0) scale(${isHoveringRef.current ? 1.6 : 1})`;
        
        // Update styling classes dynamically
        if (isHoveringRef.current) {
          pointerRef.current.classList.add("interactive");
        } else {
          pointerRef.current.classList.remove("interactive");
        }
      }

      // If reduced motion is requested, do not render trail physics canvas
      if (!reducedMotion && canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const trail = trailRef.current;
        const isHovering = isHoveringRef.current;

        // Draw radial click burst on the canvas if active
        const clickAge = Date.now() - clickTimeRef.current;
        if (clickAge < 300) {
          const progress = clickAge / 300;
          const { x: cx, y: cy } = clickCoordsRef.current;
          
          ctx.save();
          // Draw 10-point radial sparks
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI * 2) / 10;
            const distance = progress * 40; // Expand outwards up to 40px
            const sx = cx + Math.cos(angle) * distance;
            const sy = cy + Math.sin(angle) * distance;
            const sparkSize = (1 - progress) * 3;
            
            ctx.beginPath();
            ctx.arc(sx, sy, sparkSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(147, 197, 253, ${1 - progress})`; // soft bright cyan-blue
            ctx.shadowBlur = 4;
            ctx.shadowColor = "#3b82f6";
            ctx.fill();
          }
          ctx.restore();
        }

        // Loop through and calculate spring positions
        for (let i = 0; i < numParticles; i++) {
          const part = trail[i];
          
          // Hover state: particles contract tighter toward mouse
          const currentSpring = isHovering ? spring * 1.5 : spring;
          const currentFriction = isHovering ? friction * 0.9 : friction;

          // Target is either the mouse cursor (first particle) or the preceding particle
          const targetX = i === 0 ? mX : trail[i - 1].x;
          const targetY = i === 0 ? mY : trail[i - 1].y;

          // Spring physics calculation
          const ax = (targetX - part.x) * currentSpring;
          const ay = (targetY - part.y) * currentSpring;

          part.vx = (part.vx + ax) * currentFriction;
          part.vy = (part.vy + ay) * currentFriction;

          part.x += part.vx;
          part.y += part.vy;

          // Render particle
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);

          // Render theme gradients or custom color matching
          if (isHovering) {
            // Bright violet to cyan transition
            const ratio = i / numParticles;
            ctx.fillStyle = `rgba(${Math.floor(59 + ratio * 80)}, ${Math.floor(130 + ratio * 55)}, 246, ${0.95 - ratio * 0.55})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#3b82f6";
          } else {
            // Subdued soft cool white with subtle outer glow shadow
            const opacity = Math.max(0.08, 0.5 - (i * 0.04));
            ctx.fillStyle = `rgba(241, 245, 249, ${opacity})`;
            ctx.shadowBlur = 3;
            ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
          }
          ctx.fill();
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [mounted, reducedMotion]);

  if (!mounted) return null;

  const content = (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* 1. Custom Raw Injectable Keyframe Styles to avoid bloating Tailwind config */}
      <style>{`
        .cosmos-custom-pointer {
          position: fixed;
          top: 0;
          left: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(59, 130, 246, 0.3);
          transform: translate3d(0, 0, 0);
          transition: background-color 0.25s, box-shadow 0.25s, width 0.2s, height 0.2s;
          z-index: 100000;
          will-change: transform;
        }

        .cosmos-custom-pointer.interactive {
          background: linear-gradient(135deg, #3b82f6, #a855f7);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 0 12px #3b82f6, 0 0 24px #a855f7;
          width: 24px;
          height: 24px;
        }

        /* simulated click burst pulse */
        .cosmos-custom-pointer.click-pulse {
          animation: cosmosClickScale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes cosmosClickScale {
          0% {
            transform: translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) scale(1);
          }
          50% {
            transform: translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) scale(2);
            box-shadow: 0 0 20px #3b82f6, 0 0 40px #a855f7;
          }
          100% {
            transform: translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) scale(1);
          }
        }

        /* Hide default hardware cursor everywhere except on elements that have touch targets or when it fails */
        @media (pointer: fine) {
          html, body, a, button, [role="button"], input, select, textarea {
            cursor: none !important;
          }
        }
      `}</style>

      {/* 2. Standard Physics Canvas overlay */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />
      )}

      {/* 3. Main Central Cursor Pointer */}
      <div
        ref={pointerRef}
        className="cosmos-custom-pointer"
      />
    </div>
  );

  return createPortal(content, document.body);
}
