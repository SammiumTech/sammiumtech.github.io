import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, RotateCcw, Sliders, Waves, HelpCircle, Flame, Compass, Cpu, Zap, Radio
} from "lucide-react";
import { audioService } from "../utils/audioService";

type InteractionMode = "ripple" | "attract" | "repel" | "vortex" | "interference";
type PaletteTheme = "chroma" | "neon" | "entangled" | "aurora" | "solar";
type GridStyle = "nodes" | "fabric" | "orbitals" | "hybrid";

interface GridNode {
  rx: number; // rest x
  ry: number; // rest y
  x: number;  // current x
  y: number;  // current y
  vx: number; // velocity x
  vy: number; // velocity y
  baseColor: string;
  phase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function QuantumFieldCanvas({ isBackground = false }: { isBackground?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation controls state
  const [mode, setMode] = useState<InteractionMode>("ripple");
  const [theme, setTheme] = useState<PaletteTheme>(isBackground ? "neon" : "chroma");
  const [style, setStyle] = useState<GridStyle>(isBackground ? "fabric" : "hybrid");
  const [density, setDensity] = useState<number>(isBackground ? 26 : 20); // pixel spacing between nodes
  const [spring, setSpring] = useState<number>(0.04);  // elastic tension
  const [damping, setDamping] = useState<number>(0.08); // friction
  const [coupling, setCoupling] = useState<number>(isBackground ? 1.5 : 1.2); // mouse strength multiplier
  const [waveSpeed, setWaveSpeed] = useState<number>(isBackground ? 1.0 : 1.5);
  const [showFormula, setShowFormula] = useState<boolean>(true);
  const [isExcited, setIsExcited] = useState<boolean>(false);

  // Track mouse coordinates locally
  const mouseRef = useRef<{ x: number; y: number; px: number; py: number; isOver: boolean }>({
    x: -1000,
    y: -1000,
    px: -1000,
    py: -1000,
    isOver: false
  });

  // Shockwave tracking ref
  const shockwaveRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; active: boolean }>({
    x: 0,
    y: 0,
    radius: 0,
    maxRadius: 400,
    active: false
  });

  // Handle Shockwave Trigger
  const triggerShockwave = (x?: number, y?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (!isBackground) {
      audioService.playCalibration("engine");
    }
    setIsExcited(true);
    setTimeout(() => setIsExcited(false), 800);

    shockwaveRef.current = {
      x: x !== undefined ? x : canvas.width / 2,
      y: y !== undefined ? y : canvas.height / 2,
      radius: 0,
      maxRadius: Math.max(canvas.width, canvas.height) * 0.8,
      active: true
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = canvas.parentElement?.clientWidth || 700;
    let height = isBackground ? (canvas.parentElement?.clientHeight || 600) : 420;

    const setupCanvasSize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.parentElement.clientWidth;
        height = isBackground ? (canvas.parentElement.clientHeight || 600) : 420;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };
    setupCanvasSize();

    const handleResize = () => {
      setupCanvasSize();
      initNodes();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const handleMouseMoveWindow = (e: MouseEvent) => {
      if (!isBackground) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const m = mouseRef.current;
      m.px = m.x;
      m.py = m.y;
      m.x = x;
      m.y = y;
      
      const margin = 120;
      m.isOver = x >= -margin && x <= rect.width + margin && y >= -margin && y <= rect.height + margin;
    };

    if (isBackground) {
      window.addEventListener("mousemove", handleMouseMoveWindow);
    }

    // Initialize interactive grid nodes
    let nodes: GridNode[] = [];
    let freeParticles: Particle[] = [];

    const initNodes = () => {
      nodes = [];
      const cols = Math.floor(width / density) + 2;
      const rows = Math.floor(height / density) + 2;
      const xOffset = (width - (cols - 1) * density) / 2;
      const yOffset = (height - (rows - 1) * density) / 2;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const rx = c * density + xOffset;
          const ry = r * density + yOffset;
          nodes.push({
            rx,
            ry,
            x: rx,
            y: ry,
            vx: 0,
            vy: 0,
            baseColor: "",
            phase: Math.random() * Math.PI * 2
          });
        }
      }

      // Initialize free floating particles mimicking user pic's spark stars
      freeParticles = [];
      for (let i = 0; i < 40; i++) {
        freeParticles.push(createRandomParticle(true));
      }
    };

    const createRandomParticle = (anywhere = false): Particle => {
      return {
        x: anywhere ? Math.random() * width : width / 2 + (Math.random() - 0.5) * 50,
        y: anywhere ? Math.random() * height : height / 2 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        color: getRandomColorForTheme(theme),
        size: Math.random() * 2.5 + 1.0,
        alpha: Math.random() * 0.5 + 0.4,
        life: 0,
        maxLife: Math.random() * 200 + 100
      };
    };

    const getRandomColorForTheme = (curTheme: PaletteTheme): string => {
      const themes: Record<PaletteTheme, string[]> = {
        chroma: ["#ff0066", "#00f3ff", "#bd00ff", "#22c55e", "#ffd200", "#ff5e00"],
        neon: ["#00f3ff", "#0088ff", "#00ffcc", "#ffffff"],
        entangled: ["#ff007f", "#bd00ff", "#00f3ff", "#ff80df"],
        aurora: ["#22c55e", "#10b981", "#00ffcc", "#00f3ff", "#eab308"],
        solar: ["#ff5e00", "#ffb700", "#ff3c00", "#ffffff"]
      };
      const colors = themes[curTheme];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    initNodes();

    let animationId: number;
    let time = 0;

    // Simulation loop
    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);

      time += 0.02 * waveSpeed;
      ctx.fillStyle = "rgba(4, 7, 18, 0.22)"; // translucent background for glowing trails
      ctx.fillRect(0, 0, width, height);

      const m = mouseRef.current;
      const sh = shockwaveRef.current;

      // Update shockwave diameter
      if (sh.active) {
        sh.radius += 5.5;
        if (sh.radius > sh.maxRadius) {
          sh.active = false;
        }
      }

      // 1. Physics update & render grid nodes
      nodes.forEach((n) => {
        n.phase += 0.04;

        // Base breathing fluctuation (quantum background foam)
        const waveBackground = Math.sin(n.rx * 0.015 + n.ry * 0.015 + time) * 1.2;
        const targetX = n.rx;
        const targetY = n.ry + waveBackground;

        // Interaction forces
        let fx = 0;
        let fy = 0;

        if (m.isOver) {
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 180 && dist > 0.1) {
            const forceStrength = (1 - dist / 180) * coupling;

            if (mode === "ripple") {
              // Radial sine wave expansion
              const rippleAmt = Math.sin(dist * 0.12 - time * 6.0) * 12.0 * forceStrength;
              fx += (dx / dist) * rippleAmt;
              fy += (dy / dist) * rippleAmt;
            } else if (mode === "attract") {
              // Gravitational attraction
              const attractForce = forceStrength * 28.0;
              fx -= (dx / dist) * attractForce;
              fy -= (dy / dist) * attractForce;
            } else if (mode === "repel") {
              // Electrostatic repulsion
              const repelForce = forceStrength * 28.0;
              fx += (dx / dist) * repelForce;
              fy += (dy / dist) * repelForce;
            } else if (mode === "vortex") {
              // Tangential spinning forces (magnetic vortex)
              const spinForce = forceStrength * 22.0;
              const tx = -dy / dist;
              const ty = dx / dist;
              fx += tx * spinForce;
              fy += ty * spinForce;
            } else if (mode === "interference") {
              // Complex 2D wave interference patterns
              const pattern1 = Math.sin(dist * 0.08 - time * 4.0);
              const pattern2 = Math.cos((n.rx + m.x) * 0.04) * Math.sin((n.ry + m.y) * 0.04);
              const interference = (pattern1 + pattern2) * 8.0 * forceStrength;
              fx += (dx / dist) * interference;
              fy += (dy / dist) * interference;
            }
          }
        }

        // Apply Shockwave perturbation
        if (sh.active) {
          const dx = n.x - sh.x;
          const dy = n.y - sh.y;
          const dist = Math.hypot(dx, dy);
          const tolerance = 40;
          
          if (Math.abs(dist - sh.radius) < tolerance) {
            const shStrength = (1 - Math.abs(dist - sh.radius) / tolerance) * 35.0 * (1 - sh.radius / sh.maxRadius);
            fx += (dx / (dist || 1)) * shStrength;
            fy += (dy / (dist || 1)) * shStrength;
          }
        }

        // Spring acceleration to rest position
        const ax = (targetX - n.x) * spring + fx * 0.15;
        const ay = (targetY - n.y) * spring + fy * 0.15;

        // Update velocity & dampening
        n.vx = (n.vx + ax) * (1 - damping);
        n.vy = (n.vy + ay) * (1 - damping);

        // Apply movement limits
        n.x += n.vx;
        n.y += n.vy;
      });

      // 2. Draw connections/mesh (fabric/orbitals/hybrid)
      if (style === "fabric" || style === "hybrid" || style === "orbitals") {
        ctx.lineWidth = 0.5;
        const cols = Math.floor(width / density) + 2;
        const rows = Math.floor(height / density) + 2;

        for (let c = 0; c < cols - 1; c++) {
          for (let r = 0; r < rows - 1; r++) {
            const idx = c * rows + r;
            const rightIdx = (c + 1) * rows + r;
            const downIdx = c * rows + (r + 1);

            if (idx < nodes.length && rightIdx < nodes.length && downIdx < nodes.length) {
              const node = nodes[idx];
              const rightNode = nodes[rightIdx];
              const downNode = nodes[downIdx];

              // Calculate distance-based alpha and color shift
              const dx = node.x - (m.isOver ? m.x : width / 2);
              const dy = node.y - (m.isOver ? m.y : height / 2);
              const dist = Math.hypot(dx, dy);
              const highlight = Math.max(0, 1 - dist / 220);

              // Set aesthetic translucent color styles matching quantum fields
              let strokeColor = "rgba(0, 243, 255, 0.08)";
              if (theme === "chroma") {
                const hue = (dist * 0.35 + time * 18) % 360;
                strokeColor = `hsla(${hue}, 80%, 55%, ${0.05 + highlight * 0.32})`;
              } else if (theme === "neon") {
                strokeColor = `rgba(0, 243, 255, ${0.07 + highlight * 0.35})`;
              } else if (theme === "entangled") {
                strokeColor = `rgba(${189 + highlight * 66}, 0, 255, ${0.06 + highlight * 0.35})`;
              } else if (theme === "aurora") {
                strokeColor = `rgba(34, 197, 94, ${0.07 + highlight * 0.35})`;
              } else if (theme === "solar") {
                strokeColor = `rgba(255, 110, 0, ${0.06 + highlight * 0.35})`;
              }

              ctx.strokeStyle = strokeColor;

              if (style === "fabric" || style === "hybrid") {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(rightNode.x, rightNode.y);
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(downNode.x, downNode.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      // 3. Draw Concentric Curved Orbitals / Fields (Beautiful nested arcs from user pic)
      if (style === "orbitals" || style === "hybrid") {
        ctx.shadowBlur = 0;
        const centerPoint = m.isOver ? m : { x: width / 2, y: height / 2 };
        const numRings = 5;
        const ringSpacing = 42;

        for (let r = 1; r <= numRings; r++) {
          const radius = r * ringSpacing;
          
          // Generate customized distorted circles based on nearby particle displacements
          ctx.beginPath();
          let firstPoint = true;
          for (let angle = 0; angle <= Math.PI * 2 + 0.05; angle += 0.08) {
            const rx = centerPoint.x + Math.cos(angle) * radius;
            const ry = centerPoint.y + Math.sin(angle) * radius;

            // Find nearest node to calculate wave displacement factor
            let displacementFactorX = 0;
            let displacementFactorY = 0;
            let minDist = 9999;
            let nearest: GridNode | null = null;

            // Simple heuristic to sample grid displacement
            for (let i = 0; i < nodes.length; i += 3) {
              const dNode = nodes[i];
              const d = Math.hypot(dNode.rx - rx, dNode.ry - ry);
              if (d < minDist) {
                minDist = d;
                nearest = dNode;
              }
            }

            if (nearest && minDist < 60) {
              displacementFactorX = nearest.vx * 1.5;
              displacementFactorY = nearest.vy * 1.5;
            }

            // Apply interactive ripple wave
            const waveRipple = Math.sin(radius * 0.06 - time * 2.2) * 2.4;
            const px = rx + displacementFactorX + Math.cos(angle) * waveRipple;
            const py = ry + displacementFactorY + Math.sin(angle) * waveRipple;

            if (firstPoint) {
              ctx.moveTo(px, py);
              firstPoint = false;
            } else {
              ctx.lineTo(px, py);
            }
          }

          let ringColor = "rgba(255,255,255,0.04)";
          if (theme === "chroma") {
            const ringHue = (radius * 0.4 + time * 22) % 360;
            ringColor = `hsla(${ringHue}, 85%, 65%, 0.12)`;
          } else if (theme === "neon") {
            ringColor = `rgba(0, 243, 255, ${0.12 - r * 0.015})`;
          } else if (theme === "entangled") {
            ringColor = `rgba(189, 0, 255, ${0.12 - r * 0.015})`;
          } else if (theme === "aurora") {
            ringColor = `rgba(16, 185, 129, ${0.11 - r * 0.015})`;
          } else if (theme === "solar") {
            ringColor = `rgba(255, 94, 0, ${0.12 - r * 0.015})`;
          }

          ctx.strokeStyle = ringColor;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }

      // 4. Render Grid Nodes
      if (style === "nodes" || style === "hybrid") {
        nodes.forEach((n) => {
          const dx = n.x - (m.isOver ? m.x : width / 2);
          const dy = n.y - (m.isOver ? m.y : height / 2);
          const dist = Math.hypot(dx, dy);

          const displacement = Math.hypot(n.vx, n.vy);
          const size = Math.max(0.6, 1.4 + displacement * 0.4);

          // Get color based on theme and local energy
          let nodeColor = "rgba(255, 255, 255, 0.45)";
          const baseAlpha = 0.22 + Math.min(0.6, displacement * 0.15);

          if (theme === "chroma") {
            const hue = (dist * 0.45 + time * 30) % 360;
            nodeColor = `hsla(${hue}, 95%, 60%, ${baseAlpha})`;
          } else if (theme === "neon") {
            nodeColor = `rgba(0, 243, 255, ${baseAlpha})`;
          } else if (theme === "entangled") {
            const waveVal = Math.sin(n.phase);
            const rChan = waveVal > 0 ? 255 : 100;
            const bChan = waveVal > 0 ? 150 : 255;
            nodeColor = `rgba(${rChan}, 0, ${bChan}, ${baseAlpha})`;
          } else if (theme === "aurora") {
            nodeColor = `rgba(34, 197, 94, ${baseAlpha})`;
          } else if (theme === "solar") {
            nodeColor = `rgba(255, ${120 + Math.floor(Math.sin(n.phase)*50)}, 0, ${baseAlpha})`;
          }

          ctx.fillStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
          ctx.fill();

          // Draw neon halo glow for high velocity nodes
          if (displacement > 2.5) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = nodeColor;
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(n.x, n.y, size * 2.2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        });
      }

      // 5. Draw Free Floating Star Particles with Long Fade Trails
      freeParticles.forEach((p, idx) => {
        p.life++;
        
        // Push and orbit toward mouse
        if (m.isOver) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 220) {
            // Apply a tangential orbit velocity
            const tx = -dy / (dist || 1);
            const ty = dx / (dist || 1);
            const pull = (1 - dist / 220) * 0.28 * coupling;
            
            p.vx += tx * pull + (dx / dist) * pull * 0.1;
            p.vy += ty * pull + (dy / dist) * pull * 0.1;
          }
        }

        // Apply friction
        p.vx *= 0.97;
        p.vy *= 0.97;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render sparkly particle
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Spark flares
        if (Math.random() < 0.08) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x - 4, p.y);
          ctx.lineTo(p.x + 4, p.y);
          ctx.moveTo(p.x, p.y - 4);
          ctx.lineTo(p.x, p.y + 4);
          ctx.stroke();
        }

        // Replace dead particles
        if (p.life > p.maxLife) {
          freeParticles[idx] = createRandomParticle(false);
        }
      });

      // 6. Draw central particle generator if mouse isn't on screen (attracts ambient action)
      if (!m.isOver) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00f3ff";
        
        const pulseCore = 1.0 + Math.sin(time * 3.0) * 0.12;
        const coreGrad = ctx.createRadialGradient(width/2, height/2, 2, width/2, height/2, 14 * pulseCore);
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.4, "rgba(0, 243, 255, 0.7)");
        coreGrad.addColorStop(1, "rgba(189, 0, 255, 0)");

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(width/2, height/2, 14 * pulseCore, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Draw elegant tracking laser crosshair on the mouse
        ctx.strokeStyle = "rgba(0, 243, 255, 0.15)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        // Circle around cursor
        ctx.arc(m.x, m.y, 16, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        // Crosshair ticks
        ctx.moveTo(m.x - 24, m.y);
        ctx.lineTo(m.x - 8, m.y);
        ctx.moveTo(m.x + 8, m.y);
        ctx.lineTo(m.x + 24, m.y);
        ctx.moveTo(m.x, m.y - 24);
        ctx.lineTo(m.x, m.y - 8);
        ctx.moveTo(m.x, m.y + 8);
        ctx.lineTo(m.x, m.y + 24);
        ctx.stroke();

        // Little floating tag
        ctx.fillStyle = "rgba(0, 243, 255, 0.6)";
        ctx.font = "8px monospace";
        ctx.fillText(`ψ(x,y): ${Math.round(m.x)}, ${Math.round(m.y)}`, m.x + 12, m.y - 12);
      }

      // Draw aesthetic laser boundary frame
      ctx.strokeStyle = "rgba(0, 243, 255, 0.22)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, width, height);

      // Radial shockwave ring
      if (sh.active) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * (1 - sh.radius / sh.maxRadius)})`;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00f3ff";
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, sh.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (isBackground) {
        window.removeEventListener("mousemove", handleMouseMoveWindow);
      }
    };
  }, [mode, theme, style, density, spring, damping, coupling, waveSpeed, isBackground]);

  // Handle Mouse Events
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const m = mouseRef.current;
    m.px = m.x;
    m.py = m.y;
    m.x = x;
    m.y = y;
    m.isOver = true;

    // Trigger subtle random tick sound during motion for feedback
    if (!isBackground && (Math.abs(x - m.px) > 15 || Math.abs(y - m.py) > 15)) {
      if (Math.random() < 0.12) {
        audioService.playHover("tick", 0.3);
      }
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.isOver = false;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    triggerShockwave(x, y);
  };

  if (isBackground) {
    return (
      <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-25">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-glow animate-pulse" />
            <h2 className="text-md font-bold text-white uppercase tracking-wider">
              Quantum Field Wave Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Interact with the dynamic 2D wave grid mapping atomic force perturbations, energy densities, and particle-field coupling.
          </p>
        </div>

        <button
          onClick={() => triggerShockwave()}
          onMouseEnter={() => audioService.playHover("tick")}
          className={`px-4 py-2 rounded-lg border text-xs font-semibold uppercase font-mono tracking-wider transition-all flex items-center space-x-2 ${isExcited ? "bg-cyan-glow text-slate-950 border-cyan-glow shadow-[0_0_15px_rgba(0,243,255,0.4)]" : "bg-slate-900 border-white/10 text-cyan-glow hover:border-cyan-glow/40"}`}
        >
          <Flame className={`w-3.5 h-3.5 ${isExcited ? "animate-bounce" : ""}`} />
          <span>Excite Quantum Field</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="xl:col-span-1 space-y-4 bg-slate-950/60 p-4 rounded-xl border border-white/5 text-xs text-left">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center mb-1">
            <Sliders className="w-4 h-4 text-cyan-glow mr-2" /> Tuning Parameters
          </h3>

          {/* Interaction Mode */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Field Potential Mode</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "ripple", name: "Probability Wave", icon: Waves },
                { id: "attract", name: "Gravity Well", icon: Compass },
                { id: "repel", name: "Coulomb Barrier", icon: Zap },
                { id: "vortex", name: "Magnetic Spin", icon: RotateCcw },
                { id: "interference", name: "Wave Interference", icon: Sparkles }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id as any);
                      audioService.playPressed("haptic");
                    }}
                    onMouseEnter={() => audioService.playHover("tick")}
                    className={`p-2 rounded-lg border text-left flex flex-col items-start gap-1 transition-all ${mode === m.id ? "bg-cyan-glow/15 border-cyan-glow text-white font-bold" : "border-slate-800 text-slate-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <Icon className="w-4 h-4 text-cyan-glow" />
                    <span className="text-[9px] leading-tight font-semibold mt-0.5">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Render Style */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Visual Field Fabric</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "nodes", name: "Q-Probability Nodes" },
                { id: "fabric", name: "Elastic Mesh" },
                { id: "orbitals", name: "3D Concentric Orbitals" },
                { id: "hybrid", name: "Chroma Hybrid (Chamber)" }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStyle(s.id as any);
                    audioService.playPressed("haptic");
                  }}
                  onMouseEnter={() => audioService.playHover("tick")}
                  className={`p-1.5 py-2 rounded-lg border text-center transition-all ${style === s.id ? "bg-violet-glow/20 border-violet-glow text-white font-bold" : "border-slate-800 text-slate-400 hover:text-white"}`}
                >
                  <span className="text-[9px] font-semibold leading-none">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chroma Palette */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Quantum Chromatic Theme</span>
            <div className="grid grid-cols-5 gap-1">
              {[
                { id: "chroma", label: "RGB", bg: "bg-gradient-to-r from-red-500 via-green-500 to-blue-500", name: "Multiverse Spectrum" },
                { id: "neon", label: "NEON", bg: "bg-cyan-500", name: "Pure Coherent Cyan" },
                { id: "entangled", label: "ENT", bg: "bg-fuchsia-500", name: "Entangled Pink" },
                { id: "aurora", label: "AUR", bg: "bg-emerald-500", name: "Green Aurora" },
                { id: "solar", label: "SOL", bg: "bg-amber-500", name: "Solar Flare" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as any);
                    audioService.playClick("tap");
                  }}
                  onMouseEnter={() => audioService.playHover("tick")}
                  title={t.name}
                  className={`h-6 rounded border flex items-center justify-center text-[8px] font-bold uppercase transition-all ${theme === t.id ? "border-white ring-1 ring-cyan-glow/50 text-white" : "border-slate-800 text-slate-400 hover:text-white"}`}
                >
                  <span className={`w-2 h-2 rounded-full mr-1 ${t.bg}`}></span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-2 border-t border-white/5 font-mono text-[10px]">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 uppercase">Mesh Grid Spacing</span>
                <span className="text-cyan-glow font-bold">{density}px</span>
              </div>
              <input 
                type="range" 
                min="14" 
                max="36" 
                step="2" 
                value={density}
                onChange={(e) => {
                  setDensity(parseInt(e.target.value));
                  audioService.playClick("tap");
                }}
                className="w-full accent-cyan-glow bg-slate-950 h-1 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 uppercase">Field Tension / Spring</span>
                <span className="text-cyan-glow font-bold">{spring.toFixed(3)}</span>
              </div>
              <input 
                type="range" 
                min="0.01" 
                max="0.15" 
                step="0.01" 
                value={spring}
                onChange={(e) => setSpring(parseFloat(e.target.value))}
                className="w-full accent-cyan-glow bg-slate-950 h-1 rounded"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 uppercase">Field Friction / Damping</span>
                <span className="text-cyan-glow font-bold">{damping.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.02" 
                max="0.25" 
                step="0.01" 
                value={damping}
                onChange={(e) => setDamping(parseFloat(e.target.value))}
                className="w-full accent-cyan-glow bg-slate-950 h-1 rounded"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 uppercase">Cursor Coupling Force</span>
                <span className="text-cyan-glow font-bold">{coupling.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="3.0" 
                step="0.1" 
                value={coupling}
                onChange={(e) => setCoupling(parseFloat(e.target.value))}
                className="w-full accent-cyan-glow bg-slate-950 h-1 rounded"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 uppercase">Wave Propagation Speed</span>
                <span className="text-cyan-glow font-bold">{waveSpeed.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="3.0" 
                step="0.1" 
                value={waveSpeed}
                onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-glow bg-slate-950 h-1 rounded"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex justify-between items-center">
            <button
              onClick={() => {
                setMode("ripple");
                setTheme("chroma");
                setStyle("hybrid");
                setDensity(20);
                setSpring(0.04);
                setDamping(0.08);
                setCoupling(1.2);
                setWaveSpeed(1.5);
                audioService.playCalibration("wave");
              }}
              className="px-2.5 py-1 rounded bg-slate-900 border border-white/5 text-[9px] hover:text-white font-mono flex items-center gap-1 hover:border-white/10 uppercase"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Core
            </button>

            <button
              onClick={() => {
                setShowFormula(!showFormula);
                audioService.playClick("tap");
              }}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1 uppercase text-[9px]"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showFormula ? "Hide Formula" : "Show Formula"}
            </button>
          </div>
        </div>

        {/* Canvas Render Area */}
        <div className="xl:col-span-3 flex flex-col space-y-4">
          <div className="relative bg-slate-950/60 rounded-xl border border-white/5 overflow-hidden flex-1 min-h-[420px] flex items-center justify-center">
            {/* Background cyber grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              className="absolute inset-0 w-full h-full cursor-crosshair block"
            />

            {/* Prompt HUD overlay inside Canvas */}
            <div className="absolute top-3 left-3 bg-slate-950/80 p-2 px-3 rounded-md border border-white/5 font-mono text-[9px] text-slate-400 space-y-0.5 pointer-events-none">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-ping"></span>
                <span className="font-bold text-white uppercase tracking-wider">LAB DETECTOR: ACTIVE</span>
              </div>
              <div>COORDINATES: x={mouseRef.current.isOver ? Math.round(mouseRef.current.x) : "---"}, y={mouseRef.current.isOver ? Math.round(mouseRef.current.y) : "---"}</div>
              <div>SAMPLING RATE: 60 FPS (COHERENT)</div>
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-950/80 p-2 px-3 rounded-md border border-white/5 font-mono text-[9px] text-slate-400 pointer-events-none">
              <span className="text-cyan-glow font-bold uppercase mr-1">TIPS:</span> Move mouse to distort fabric. Click anywhere to trigger radial quantum excitation shockwave.
            </div>
          </div>

          {/* Mathematical Formula Sheet Card */}
          {showFormula && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 text-left text-xs font-mono space-y-2 animate-fade-in">
              <div className="flex items-center space-x-2 text-cyan-glow">
                <Cpu className="w-4 h-4" />
                <h4 className="font-bold uppercase tracking-wider">Schrödinger Probability Field Equation (2D Perturbation)</h4>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                The wave function <span className="text-white">Ψ(x, y, t)</span> is modeled as a discretized spring-mass grid representing the potential landscape <span className="text-white">V(x, y, t)</span>. The localized force vector is derived by taking the gradient of the potential field induced by the cursor coordinates:
              </p>
              <div className="bg-slate-900/40 p-2 px-3 rounded border border-white/5 text-center text-cyan-glow text-sm my-1 overflow-x-auto">
                {"iℏ ∂/∂t Ψ(r, t) = [ -ℏ²/2m ∇² + V_cursor(r, t) ] Ψ(r, t)"}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-400 pt-1">
                <div>
                  <span className="text-white font-bold block mb-0.5">∇² (Laplacian Discretization):</span>
                  Calculates neighboring node force propagation mimicking particle-to-particle field tension.
                </div>
                <div>
                  <span className="text-white font-bold block mb-0.5">V_cursor Potential (Mouse Field Coupling):</span>
                  Exerts localized, non-linear force perturbations warping the surrounding probability manifold.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
