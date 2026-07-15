import React, { useRef, useEffect } from "react";
import { sounds } from "../utils/sounds";

interface CosmicGalaxyCursorProps {
  isRgbOverdrive: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  distanceFromCursor: number;
  isClickExplosion?: boolean;
  sparklePhase: number;
  sparkleSpeed: number;
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const CosmicGalaxyCursor: React.FC<CosmicGalaxyCursorProps> = ({ isRgbOverdrive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track current, target mouse positions and custom orb parameters
  const mouseRef = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 500,
    targetX: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    targetY: typeof window !== "undefined" ? window.innerHeight / 2 : 500,
    isFirstMove: true,
    lastTime: 0,
    galaxyRotation: 0,
    clickPulse: 0 // pulse multiplier on click
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let clickRipples: ClickRipple[] = [];
    let particleIdCounter = 0;

    // Handle high density viewport scaling
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      
      if (mouse.isFirstMove) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.isFirstMove = false;
      }

      // Throttle/control active stardust generation to prevent lag
      const now = performance.now();
      if (now - mouse.lastTime > 12) {
        mouse.lastTime = now;
        
        // Gamer galactic palette selection
        const colors = isRgbOverdrive
          ? ["#ec4899", "#f43f5e", "#a855f7", "#ec4899", "#ffffff"] // pinks, deep reds, purple, white
          : ["#06b6d4", "#a855f7", "#6366f1", "#facc15", "#ffffff"]; // cyan, violet, indigo, gold star dust, white

        // Spawn trailing galaxy dust particles
        const spawnCount = isRgbOverdrive ? 4 : 2;
        for (let i = 0; i < spawnCount; i++) {
          const randColor = colors[Math.floor(Math.random() * colors.length)];
          const size = Math.random() * (isRgbOverdrive ? 4.5 : 3.2) + 0.6;
          
          // Slight orbital velocity offsets around cursor motion path
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.5 + 0.2;
          
          particles.push({
            id: particleIdCounter++,
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.0,
            vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 1.0,
            size,
            color: randColor,
            alpha: Math.random() * 0.4 + 0.6,
            decay: Math.random() * 0.012 + 0.012,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.08,
            distanceFromCursor: 0,
            sparklePhase: Math.random() * Math.PI * 2,
            sparkleSpeed: Math.random() * 0.2 + 0.1
          });
        }
      }
    };

    // Track global click to play time jump sound and trigger shockwave
    const handleGlobalClick = (e: MouseEvent) => {
      // Trigger Time Jump sound synthesized via Web Audio API
      sounds.playTimeJump();

      // Expand custom galaxy core pulse
      mouseRef.current.clickPulse = 1.0;

      const clickX = e.clientX;
      const clickY = e.clientY;

      // Color scheme for supernova shockwave
      const clickColors = isRgbOverdrive
        ? ["#f43f5e", "#ff2e93", "#e0f2fe", "#f43f5e"]
        : ["#22d3ee", "#a855f7", "#ffffff", "#818cf8"];

      // 1. Spawn heavy concentric time-jump shockwave ripple
      clickRipples.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: isRgbOverdrive ? 160 : 120,
        alpha: 1.0,
        color: clickColors[0]
      });

      // Extra secondary ripple for RGB Overdrive
      if (isRgbOverdrive) {
        clickRipples.push({
          x: clickX,
          y: clickY,
          radius: 1,
          maxRadius: 220,
          alpha: 0.8,
          color: clickColors[1]
        });
      }

      // 2. Spawn stellar explosion fragment particles radiating outwards
      const explosionCount = isRgbOverdrive ? 28 : 18;
      for (let i = 0; i < explosionCount; i++) {
        const angle = (i / explosionCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const velocityMagnitude = Math.random() * 7 + (isRgbOverdrive ? 4 : 2);
        const size = Math.random() * 4.2 + 1.2;
        const col = clickColors[Math.floor(Math.random() * clickColors.length)];

        particles.push({
          id: particleIdCounter++,
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * velocityMagnitude,
          vy: Math.sin(angle) * velocityMagnitude,
          size,
          color: col,
          alpha: 1.0,
          decay: Math.random() * 0.018 + 0.015,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          distanceFromCursor: 0,
          isClickExplosion: true,
          sparklePhase: Math.random() * Math.PI,
          sparkleSpeed: Math.random() * 0.3 + 0.15
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleGlobalClick);

    // Frame update loop
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      
      // Easing follower mechanism for the galaxy core orb (lerps smoothly)
      const easingFactor = isRgbOverdrive ? 0.13 : 0.09;
      mouse.x += (mouse.targetX - mouse.x) * easingFactor;
      mouse.y += (mouse.targetY - mouse.y) * easingFactor;

      // Update core animation variables
      mouse.galaxyRotation += isRgbOverdrive ? 0.045 : 0.025;
      if (mouse.clickPulse > 0.01) {
        mouse.clickPulse -= 0.05; // slowly decay click pulse offset
      } else {
        mouse.clickPulse = 0;
      }

      // Draw Click shockwave ripples
      clickRipples = clickRipples.filter((ripple) => {
        ripple.radius += isRgbOverdrive ? 7.5 : 5.0;
        ripple.alpha = 1.0 - (ripple.radius / ripple.maxRadius);
        
        if (ripple.alpha <= 0) return false;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = ripple.color;
        ctx.lineWidth = isRgbOverdrive ? 3.0 : 1.8;
        ctx.globalAlpha = ripple.alpha * 0.85;
        
        // Draw starry neon ring glow
        ctx.shadowBlur = isRgbOverdrive ? 15 : 8;
        ctx.shadowColor = ripple.color;
        
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Secondary faint solid wave fill for rich texture
        ctx.beginPath();
        ctx.fillStyle = ripple.color;
        ctx.globalAlpha = ripple.alpha * 0.04;
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return true;
      });

      // Update and Draw stardust particles
      particles = particles.filter((p) => {
        // Apply friction drag index
        const friction = p.isClickExplosion ? 0.94 : 0.97;
        p.vx *= friction;
        p.vy *= friction;
        
        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Apply slight orbital swirl force around current cursor if close
        if (!p.isClickExplosion) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 5) {
            // Tangential acceleration vector to give standard spiral galaxy drift
            const swirl = isRgbOverdrive ? 0.28 : 0.14;
            p.vx += (-dy / dist) * swirl;
            p.vy += (dx / dist) * swirl;
          }
        }

        // Apply decay
        p.alpha -= p.decay;
        if (p.alpha <= 0.01) return false;

        // Glittering shimmer calculation
        p.sparklePhase += p.sparkleSpeed;
        const sparkleFactor = 0.75 + Math.sin(p.sparklePhase) * 0.25;

        // Render particle
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Configure bloom effects
        ctx.shadowBlur = isRgbOverdrive ? 10 : 4;
        ctx.shadowColor = p.color;

        const currentSize = Math.max(0.1, p.size * sparkleFactor);
        
        // Draw particle as a delicate diamond sparkle or perfect circle
        if (p.id % 3 === 0) {
          // Sparkle star geometry
          const radius = currentSize * 1.5;
          ctx.moveTo(p.x, p.y - radius);
          ctx.lineTo(p.x + radius * 0.4, p.y - radius * 0.4);
          ctx.lineTo(p.x + radius, p.y);
          ctx.lineTo(p.x + radius * 0.4, p.y + radius * 0.4);
          ctx.moveTo(p.x, p.y + radius);
          ctx.lineTo(p.x - radius * 0.4, p.y + radius * 0.4);
          ctx.lineTo(p.x - radius, p.y);
          ctx.lineTo(p.x - radius * 0.4, p.y - radius * 0.4);
          ctx.fill();
        } else {
          // Standard cosmic circle dust
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      // DRAW THE CENTRAL GALAXY ORB CURSOR FOLLOWER
      if (!mouse.isFirstMove) {
        ctx.save();
        
        // Enable additive screen blending for high fidelity neo-galactic glow
        ctx.globalCompositeOperation = "screen";

        const baseOrbSize = isRgbOverdrive ? 18 : 12;
        const currentPulseRadius = baseOrbSize * (1.0 + mouse.clickPulse * 0.8);
        const glowColor = isRgbOverdrive ? "#f43f5e" : "#06b6d4";
        const secondaryGlow = isRgbOverdrive ? "#a855f7" : "#6366f1";

        // A. Draw Outer Nebula Atmospheric Atmosphere Glow (Ambient Field)
        const outerGrad = ctx.createRadialGradient(
          mouse.x, mouse.y, 1,
          mouse.x, mouse.y, currentPulseRadius * 3.5
        );
        outerGrad.addColorStop(0, `${glowColor}50`);
        outerGrad.addColorStop(0.3, `${secondaryGlow}22`);
        outerGrad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.beginPath();
        ctx.fillStyle = outerGrad;
        ctx.arc(mouse.x, mouse.y, currentPulseRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // B. Draw Concentric Rotating Spiral Galaxy Arms
        const armsCount = 2;
        const armPoints = 14;
        ctx.translate(mouse.x, mouse.y);
        ctx.rotate(mouse.galaxyRotation);

        for (let arm = 0; arm < armsCount; arm++) {
          const armOffsetAngle = (arm * Math.PI * 2) / armsCount;
          ctx.beginPath();
          
          for (let p = 0; p < armPoints; p++) {
            const distance = (p / armPoints) * (currentPulseRadius * 1.8);
            // Spiral equation: theta = distance * factor + offset
            const angle = distance * (isRgbOverdrive ? 0.08 : 0.06) + armOffsetAngle;
            
            const px = Math.cos(angle) * distance;
            const py = Math.sin(angle) * distance;
            
            const pointAlpha = (1.0 - p / armPoints) * 0.8;
            const pointSize = Math.max(0.6, (1.0 - p / armPoints) * (isRgbOverdrive ? 3.0 : 2.0));
            
            ctx.fillStyle = p % 2 === 0 ? glowColor : secondaryGlow;
            ctx.globalAlpha = pointAlpha;
            
            ctx.beginPath();
            ctx.arc(px, py, pointSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Reset transformation back to origin
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // C. Draw the High Energy Core Galactic Singularity Orb
        const coreGrad = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, currentPulseRadius * 0.95
        );
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.2, `${glowColor}cc`);
        coreGrad.addColorStop(0.6, `${secondaryGlow}66`);
        coreGrad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.fillStyle = coreGrad;
        ctx.shadowBlur = isRgbOverdrive ? 20 : 10;
        ctx.shadowColor = glowColor;
        ctx.arc(mouse.x, mouse.y, currentPulseRadius * 1.0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleGlobalClick);
      cancelAnimationFrame(animationId);
    };
  }, [isRgbOverdrive]);

  // Use absolute full-viewport covering overlay canvas, completely transparent and non-blocking (pointer-events-none)
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999] select-none"
      style={{ mixBlendMode: "screen" }}
      id="cosmic-galaxy-cursor"
    />
  );
};
