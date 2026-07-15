import React, { useRef, useEffect } from "react";

interface InteractiveStarfieldProps {
  isRgbOverdrive: boolean;
}

interface Star {
  x: number;
  y: number;
  depth: number; // 1 to 3 (3 is closest, shifts more)
  size: number;
  color: string;
  alpha: number;
  alphaSpeed: number;
}

export const InteractiveStarfield: React.FC<InteractiveStarfieldProps> = ({ isRgbOverdrive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep track of smoothed mouse coordinates with simple easing
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    // Handle high-resolution screens
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Seed stars
    const starsCount = 110;
    const stars: Star[] = Array.from({ length: starsCount }, () => {
      const depth = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
      const size = depth === 3 ? 1.8 : depth === 2 ? 1.2 : 0.8;
      
      // Gamer galactic hues
      const roll = Math.random();
      let color = "rgba(255, 255, 255, 0.75)";
      if (roll > 0.85) {
        color = "rgba(6, 182, 212, 0.8)"; // Cyan
      } else if (roll > 0.7) {
        color = "rgba(236, 72, 153, 0.8)"; // Hot Pink
      } else if (roll > 0.55) {
        color = "rgba(168, 85, 247, 0.8)"; // Neon Purple
      }

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        depth,
        size,
        color,
        alpha: Math.random() * 0.7 + 0.3,
        alphaSpeed: 0.005 + Math.random() * 0.015,
      };
    });

    // Capture user cursor position relative to window bounds
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    // Handle touch device movements
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Smoothly initialize target coordinates at screen center
    mouseRef.current.x = window.innerWidth / 2;
    mouseRef.current.y = window.innerHeight / 2;
    mouseRef.current.targetX = window.innerWidth / 2;
    mouseRef.current.targetY = window.innerHeight / 2;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse easing filter: current + (target - current) * factor
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Calculate deviation offsets relative to the screen center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const deviationX = mouse.x - centerX;
      const deviationY = mouse.y - centerY;

      stars.forEach((star) => {
        // Star twinkle update logic
        star.alpha += star.alphaSpeed;
        if (star.alpha > 0.95 || star.alpha < 0.2) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        // Parallax offset: further stars shift less, closer stars shift more
        // Depth 1: shifts slightly, Depth 2: shifts medium, Depth 3: shifts noticeably
        const parallaxFactor = star.depth * 0.035;
        let starX = star.x - deviationX * parallaxFactor;
        let starY = star.y - deviationY * parallaxFactor;

        // Wrap around boundaries cleanly if dragged offset takes star offscreen
        if (starX < -20) starX = canvas.width + starX % canvas.width;
        if (starX > canvas.width + 20) starX = starX % canvas.width;
        if (starY < -20) starY = canvas.height + starY % canvas.height;
        if (starY > canvas.height + 20) starY = starY % canvas.height;

        // Draw star core
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        
        // Boost glow when RGB Overdrive is equipped
        if (isRgbOverdrive && star.depth === 3) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = star.color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw very faint outer halo for largest stars
        if (star.depth === 3) {
          ctx.beginPath();
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * 0.15;
          ctx.arc(starX, starY, star.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Reset global alpha and shadows for other elements
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [isRgbOverdrive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
