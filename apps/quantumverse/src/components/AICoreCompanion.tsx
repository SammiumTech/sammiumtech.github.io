import React, { useEffect, useRef } from "react";

interface AICoreCompanionProps {
  status: "idle" | "thinking" | "answering" | "explaining";
}

export default function AICoreCompanion({ status }: AICoreCompanionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;

    // Local state for thinking particles
    const particles: { angle: number; speed: number; radius: number; size: number; color: string }[] = [];
    for (let i = 0; i < 24; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.08,
        radius: 40 + Math.random() * 35,
        size: 1.5 + Math.random() * 2,
        color: i % 2 === 0 ? "rgba(0, 243, 255, 0.7)" : "rgba(189, 0, 255, 0.7)"
      });
    }

    // Concentric shockwaves
    const waves: { r: number; maxR: number; alpha: number; speed: number }[] = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 220;
      canvas.height = canvas.parentElement?.clientHeight || 220;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      frame++;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Base Core size
      let baseRadius = 32;
      let coreColor = "rgba(0, 243, 255, 0.85)";
      let glowColor = "#00f3ff";
      let rotationSpeed = 0.01;

      // Adjust based on status
      if (status === "idle") {
        baseRadius = 32 + Math.sin(frame * 0.04) * 2.5; // Breathing effect
        coreColor = "rgba(0, 243, 255, 0.8)";
        glowColor = "#00f3ff";
        rotationSpeed = 0.008;
      } else if (status === "thinking") {
        baseRadius = 30 + Math.sin(frame * 0.15) * 1.5; // Shivering/vibrating fast
        coreColor = "rgba(189, 0, 255, 0.9)"; // Intense Purple
        glowColor = "#bd00ff";
        rotationSpeed = 0.06; // Spinning extremely fast
      } else if (status === "answering") {
        baseRadius = 34 + Math.abs(Math.sin(frame * 0.08)) * 6; // Heavy voice amplitude pulses
        coreColor = "rgba(16, 185, 129, 0.85)"; // Deep emerald confident color
        glowColor = "#10b981";
        rotationSpeed = 0.015;

        // Spawn voice waves periodically
        if (frame % 20 === 0) {
          waves.push({ r: baseRadius, maxR: 95, alpha: 0.8, speed: 1.8 });
        }
      } else if (status === "explaining") {
        baseRadius = 33 + Math.sin(frame * 0.03) * 1.5;
        coreColor = "rgba(245, 158, 11, 0.85)"; // Sophisticated Amber wisdom
        glowColor = "#f59e0b";
        rotationSpeed = 0.004;

        if (frame % 45 === 0) {
          waves.push({ r: baseRadius, maxR: 80, alpha: 0.5, speed: 0.8 });
        }
      }

      // Draw concentric radiating voice ripples
      waves.forEach((w, idx) => {
        w.r += w.speed;
        w.alpha -= w.speed / (w.maxR - baseRadius);

        if (w.r >= w.maxR || w.alpha <= 0) {
          waves.splice(idx, 1);
        } else {
          ctx.strokeStyle = glowColor;
          ctx.globalAlpha = Math.max(0, w.alpha * 0.25);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, w.r, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1.0; // reset

      // Draw 3D projected orbital trajectories
      const drawOrbit = (tiltX: number, tiltY: number, sizeX: number, sizeY: number, color: string, alpha: number) => {
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 0.75;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tiltX);
        ctx.scale(1, sizeY / sizeX);
        ctx.beginPath();
        ctx.arc(0, 0, sizeX, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.globalAlpha = 1.0;
      };

      if (status === "thinking") {
        // High-velocity orbital trajectories
        drawOrbit(frame * 0.05, 0, 70, 22, "rgba(189, 0, 255, 0.35)", 0.5);
        drawOrbit(-frame * 0.03 + 2, 0, 85, 30, "rgba(0, 243, 255, 0.25)", 0.4);
      } else {
        // Standard slow orbit trajectories
        drawOrbit(0.4, 0, 75, 20, "rgba(0, 243, 255, 0.2)", 0.3);
        drawOrbit(-0.5, 0, 85, 25, "rgba(189, 0, 255, 0.15)", 0.25);
      }

      // Render Thinking Particles revolving around Core
      if (status === "thinking") {
        particles.forEach((p) => {
          p.angle += p.speed;
          const px = cx + Math.cos(p.angle) * p.radius;
          const py = cy + Math.sin(p.angle) * (p.radius * 0.35); // flatten to project ellipse

          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0; // reset
      }

      // Draw Outer Volumetric Aura Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius - 10, cx, cy, baseRadius + 45);
      glowGrad.addColorStop(0, coreColor);
      glowGrad.addColorStop(0.3, "rgba(0, 243, 255, 0.2)");
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius + 45, 0, Math.PI * 2);
      ctx.fill();

      // Draw Inner Solid Core Spherical Core
      const coreGrad = ctx.createRadialGradient(cx - baseRadius * 0.25, cy - baseRadius * 0.25, 2, cx, cy, baseRadius);
      coreGrad.addColorStop(0, "#ffffff");
      if (status === "idle") {
        coreGrad.addColorStop(0.4, "#00f3ff");
        coreGrad.addColorStop(1, "#022340");
      } else if (status === "thinking") {
        coreGrad.addColorStop(0.4, "#bd00ff");
        coreGrad.addColorStop(1, "#280145");
      } else if (status === "answering") {
        coreGrad.addColorStop(0.4, "#10b981");
        coreGrad.addColorStop(1, "#03321d");
      } else if (status === "explaining") {
        coreGrad.addColorStop(0.4, "#f59e0b");
        coreGrad.addColorStop(1, "#402202");
      }

      ctx.fillStyle = coreGrad;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Inner rotating matrix grids/energy lines inside the core
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius - 1, 0, Math.PI * 2);
      ctx.clip(); // Restrict coordinate drawings to inside the core

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 0.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(frame * rotationSpeed);

      if (status === "explaining") {
        // Render detailed math grids/coordinate vectors inside explaining core
        ctx.beginPath();
        for (let x = -baseRadius; x <= baseRadius; x += 12) {
          ctx.moveTo(x, -baseRadius);
          ctx.lineTo(x, baseRadius);
        }
        for (let y = -baseRadius; y <= baseRadius; y += 12) {
          ctx.moveTo(-baseRadius, y);
          ctx.lineTo(baseRadius, y);
        }
        ctx.stroke();

        // Mathematical symbols
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.font = "italic 8px Courier New";
        ctx.fillText("ψ", -4, 3);
      } else {
        // Standard geometric lines
        ctx.beginPath();
        ctx.moveTo(-baseRadius, 0);
        ctx.lineTo(baseRadius, 0);
        ctx.moveTo(0, -baseRadius);
        ctx.lineTo(0, baseRadius);
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();

      // Top Highlight glare
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.beginPath();
      ctx.ellipse(cx, cy - baseRadius * 0.4, baseRadius * 0.7, baseRadius * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Floating telemetry metrics around core in monospace font
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = "7px Courier New";
      
      const rateText = status === "thinking" ? "PROC: 99.8%" : "SYS: READY";
      const latencyText = status === "answering" ? "OUTPUT: streaming" : "LAT: 12ms";
      ctx.fillText(rateText, cx - 35, cy + baseRadius + 18);
      ctx.fillText(latencyText, cx - 35, cy + baseRadius + 26);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [status]);

  return (
    <div className="w-full h-44 flex items-center justify-center relative">
      <canvas ref={canvasRef} className="w-full h-full max-w-[200px] max-h-[200px]" />
    </div>
  );
}
