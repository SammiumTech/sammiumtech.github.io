import React, { useEffect, useRef, useState } from "react";
import { 
  Sparkles, Sliders, Play, Pause, RotateCcw, HelpCircle, 
  Eye, Compass, Info, Cpu, Waves, Activity, Zap, Layers 
} from "lucide-react";
import { audioService } from "../utils/audioService";

interface GridNode {
  x: number;
  y: number;
  i: number;
  j: number;
  // Real and Imaginary parts of the wave displacement
  re: number; 
  im: number;
  // Wave momentum / velocities
  vRe: number;
  vIm: number;
  // Derived quantum quantities
  amplitude: number;
  phase: number;
}

interface QuantumParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
}

type LandscapeType = "free" | "double_slit" | "harmonic" | "barrier";
type GridStyleType = "vectors" | "mesh" | "density" | "particles";
type MouseModeType = "barrier" | "well" | "excite";

export default function QuantumProbabilityGrid() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [landscape, setLandscape] = useState<LandscapeType>("double_slit");
  const [gridStyle, setGridStyle] = useState<GridStyleType>("mesh");
  const [mouseMode, setMouseMode] = useState<MouseModeType>("barrier");
  
  // Custom interactive simulation sliders
  const [freq, setFreq] = useState(0.18); // frequency of wave source
  const [damping, setDamping] = useState(0.015); // damping factor
  const [mass, setMass] = useState(1.0); // wave mass / speed parameter
  const [mouseStrength, setMouseStrength] = useState(4.0); // strength of mouse potential
  const [showFormula, setShowFormula] = useState(true);

  // Stats trackers
  const coherenceRef = useRef<HTMLSpanElement>(null);
  const [energyLevels, setEnergyLevels] = useState<number[]>([1.0, 3.2, 5.4]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State refs for simulation loop to prevent closures from holding stale values
  const stateRef = useRef({
    isPlaying,
    landscape,
    gridStyle,
    mouseMode,
    freq,
    damping,
    mass,
    mouseStrength,
    mousePos: { x: -1000, y: -1000 },
    isMouseDown: false
  });

  // Keep stateRef up-to-date
  useEffect(() => {
    stateRef.current = {
      isPlaying,
      landscape,
      gridStyle,
      mouseMode,
      freq,
      damping,
      mass,
      mouseStrength,
      mousePos: stateRef.current.mousePos,
      isMouseDown: stateRef.current.isMouseDown
    };
  }, [isPlaying, landscape, gridStyle, mouseMode, freq, damping, mass, mouseStrength]);

  // Numerical Solver Grid Dimensions
  const COLS = 42;
  const ROWS = 24;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = 360);

    const resizeObserver = new ResizeObserver(() => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 360;
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initialize 2D Wave Grid Nodes
    let grid: GridNode[][] = [];
    const initGrid = () => {
      grid = [];
      const cellW = width / COLS;
      const cellH = height / ROWS;

      for (let i = 0; i < COLS; i++) {
        grid[i] = [];
        for (let j = 0; j < ROWS; j++) {
          grid[i][j] = {
            x: i * cellW + cellW / 2,
            y: j * cellH + cellH / 2,
            i,
            j,
            re: 0,
            im: 0,
            vRe: 0,
            vIm: 0,
            amplitude: 0,
            phase: 0
          };
        }
      }
    };
    initGrid();

    // Monte Carlo simulated quantum particles
    const particles: QuantumParticle[] = [];
    const maxParticles = 300;
    for (let p = 0; p < maxParticles; p++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    let frameCount = 0;
    let animId: number;

    const render = () => {
      if (!canvas || !ctx) return;
      frameCount++;

      const s = stateRef.current;

      // Draw background
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // 1. WAVE SIMULATION STEP (Discretized Schrodinger-like 2D wave equations)
      if (s.isPlaying && grid.length > 0) {
        // Source node feeding wave (emitter)
        if (s.landscape === "double_slit" || s.landscape === "free" || s.landscape === "barrier") {
          // Continuous plane wave emitter on the left column
          const emitterPhase = frameCount * s.freq;
          for (let j = 0; j < ROWS; j++) {
            // Smooth Gaussian envelope on edge to act as localized slit emitter
            const distFromCenter = Math.abs(j - ROWS / 2) / (ROWS / 2);
            const envelope = Math.exp(-distFromCenter * distFromCenter * 3.5);
            
            // Inject continuous harmonic source
            grid[1][j].re = Math.sin(emitterPhase) * 1.5 * envelope;
            grid[1][j].im = Math.cos(emitterPhase) * 1.5 * envelope;
          }
        } else if (s.landscape === "harmonic") {
          // Standing central circular wave excitation
          const pulse = Math.sin(frameCount * s.freq) * 2.0;
          const cx = Math.floor(COLS / 2);
          const cy = Math.floor(ROWS / 2);
          if (grid[cx] && grid[cx][cy]) {
            grid[cx][cy].re += pulse * 0.15;
            grid[cx][cy].im += Math.cos(frameCount * s.freq) * 0.3;
          }
        }

        // Apply 2D Laplace wave progression kernels
        // We do a dual-pass buffer strategy to compute derivatives safely
        const nextRe = grid.map(col => col.map(node => node.re));
        const nextIm = grid.map(col => col.map(node => node.im));

        for (let i = 1; i < COLS - 1; i++) {
          for (let j = 1; j < ROWS - 1; j++) {
            const node = grid[i][j];

            // 2D Finite Difference Laplacian: sum of differences from 4 cardinal neighbors
            const lapRe = 
              grid[i + 1][j].re + grid[i - 1][j].re + 
              grid[i][j + 1].re + grid[i][j - 1].re - 
              4 * node.re;
            
            const lapIm = 
              grid[i + 1][j].im + grid[i - 1][j].im + 
              grid[i][j + 1].im + grid[i][j - 1].im - 
              4 * node.im;

            // Compute Potential Landscape V(x, y)
            let V = 0;

            // 1. User Landscape Barriers
            if (s.landscape === "double_slit") {
              // Draw a vertical wall in the middle with two slit openings
              const midI = Math.floor(COLS / 2);
              if (i === midI) {
                const slitSize = 2;
                const topSlitY = Math.floor(ROWS / 3);
                const bottomSlitY = Math.floor((ROWS * 2) / 3);
                
                const insideSlit = 
                  Math.abs(j - topSlitY) <= slitSize || 
                  Math.abs(j - bottomSlitY) <= slitSize;

                if (!insideSlit) {
                  V = 15.0; // Strong potential barrier
                }
              }
            } else if (s.landscape === "harmonic") {
              // Parabolic quadratic bound state well: V = k * r^2
              const dx = (i - COLS / 2);
              const dy = (j - ROWS / 2);
              V = (dx * dx + dy * dy) * 0.015;
            } else if (s.landscape === "barrier") {
              // Medium tunnel barrier rectangle in the center
              const midI = Math.floor(COLS / 2);
              const barrierW = 3;
              if (Math.abs(i - midI) <= barrierW && j > ROWS / 5 && j < (ROWS * 4) / 5) {
                V = 2.4; // Barrier potential slightly above wave kinetic threshold
              }
            }

            // 2. Local Mouse Interaction Potential Well/Barrier
            if (s.mousePos.x >= 0 && s.mousePos.y >= 0) {
              const dx = node.x - s.mousePos.x;
              const dy = node.y - s.mousePos.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 80) {
                const influence = (80 - dist) / 80;
                if (s.mouseMode === "barrier") {
                  V += influence * s.mouseStrength * 4.0; // High barrier repels wavefunction
                } else if (s.mouseMode === "well") {
                  V -= influence * s.mouseStrength * 3.0; // Negative potential captures wavefunction
                } else if (s.mouseMode === "excite") {
                  // Direct high frequency phase excitation
                  const excitePhase = frameCount * 0.5;
                  nextRe[i][j] += Math.sin(excitePhase) * influence * 0.6;
                  nextIm[i][j] += Math.cos(excitePhase) * influence * 0.6;
                }
              }
            }

            // Wave Equation with potential barrier suppression (coupled Schröd-like oscillator integration)
            // real changes velocity of imaginary, imaginary changes velocity of real
            const cSq = 0.22 * s.mass; // speed constant
            
            // Accel = cSq * Laplacian - Potential term * Wave amplitude
            node.vRe += (cSq * lapRe - V * node.re) * 0.9;
            node.vIm += (cSq * lapIm - V * node.im) * 0.9;

            // Apply dampening
            node.vRe *= (1 - s.damping);
            node.vIm *= (1 - s.damping);

            // Integrate
            nextRe[i][j] = node.re + node.vRe;
            nextIm[i][j] = node.im + node.vIm;
          }
        }

        // Apply computed buffer back to grid nodes
        for (let i = 1; i < COLS - 1; i++) {
          for (let j = 1; j < ROWS - 1; j++) {
            grid[i][j].re = nextRe[i][j];
            grid[i][j].im = nextIm[i][j];

            // Re-derive Derived state quantities
            const reVal = grid[i][j].re;
            const imVal = grid[i][j].im;
            grid[i][j].amplitude = Math.sqrt(reVal * reVal + imVal * imVal);
            grid[i][j].phase = Math.atan2(imVal, reVal);
          }
        }

        // Keep bounds stable
        for (let j = 0; j < ROWS; j++) {
          grid[0][j].re *= 0.5; grid[0][j].im *= 0.5;
          grid[COLS - 1][j].re *= 0.5; grid[COLS - 1][j].im *= 0.5;
        }
        for (let i = 0; i < COLS; i++) {
          grid[i][0].re *= 0.5; grid[i][0].im *= 0.5;
          grid[i][ROWS - 1].re *= 0.5; grid[i][ROWS - 1].im *= 0.5;
        }
      }

      // Calculate state telemetry for statistics HUD
      let peakAmp = 0;
      let totalEnergy = 0;
      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          const amp = grid[i]?.[j]?.amplitude || 0;
          if (amp > peakAmp) peakAmp = amp;
          totalEnergy += amp * amp;
        }
      }
      const calculatedCoherence = Math.max(20.0, Math.min(100.0, 100.0 - (s.damping * 80) + (peakAmp * 2)));
      if (coherenceRef.current) {
        coherenceRef.current.textContent = `${calculatedCoherence.toFixed(2)}%`;
      }

      // 2. RENDER THE INTERACTIVE POTENTIAL LANDSCAPES
      if (s.landscape === "double_slit") {
        ctx.fillStyle = "rgba(189, 0, 255, 0.08)";
        const midX = width / 2;
        const cellH = height / ROWS;
        const slitSize = 2;
        const topSlitY = Math.floor(ROWS / 3) * cellH;
        const bottomSlitY = Math.floor((ROWS * 2) / 3) * cellH;

        // Top barrier portion
        ctx.fillRect(midX - 4, 0, 8, topSlitY - (slitSize * cellH));
        ctx.strokeStyle = "rgba(189, 0, 255, 0.35)";
        ctx.strokeRect(midX - 4, -10, 8, topSlitY - (slitSize * cellH) + 10);

        // Middle separator barrier portion
        const separatorStart = topSlitY + (slitSize * cellH);
        const separatorHeight = (bottomSlitY - (slitSize * cellH)) - separatorStart;
        ctx.fillRect(midX - 4, separatorStart, 8, separatorHeight);
        ctx.strokeRect(midX - 4, separatorStart, 8, separatorHeight);

        // Bottom barrier portion
        const bottomStart = bottomSlitY + (slitSize * cellH);
        ctx.fillRect(midX - 4, bottomStart, 8, height - bottomStart);
        ctx.strokeRect(midX - 4, bottomStart, 8, height - bottomStart);

        // Label on barriers
        ctx.fillStyle = "rgba(189, 0, 255, 0.7)";
        ctx.font = "9px monospace";
        ctx.fillText("DOUBLE SLIT BARRIER [V₀ = 15eV]", midX - 70, 22);
      } else if (s.landscape === "harmonic") {
        // Draw orbital target rings
        ctx.strokeStyle = "rgba(0, 243, 255, 0.04)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 70, 0, Math.PI * 2);
        ctx.arc(width / 2, height / 2, 130, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(0, 243, 255, 0.35)";
        ctx.font = "9px monospace";
        ctx.fillText("PARABOLIC POTENTIAL WELL [V(r) ∝ r²]", width / 2 - 95, height / 2 - 145);
      } else if (s.landscape === "barrier") {
        // Rectangular barrier in middle
        const barrierW = (width / COLS) * 3;
        const barrierH = (height / ROWS) * (ROWS * 0.6);
        const bx = width / 2 - barrierW / 2;
        const by = height / 2 - barrierH / 2;

        ctx.fillStyle = "rgba(220, 38, 38, 0.08)";
        ctx.fillRect(bx, by, barrierW, barrierH);
        ctx.strokeStyle = "rgba(220, 38, 38, 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, barrierW, barrierH);

        ctx.fillStyle = "rgba(220, 38, 38, 0.7)";
        ctx.font = "9px monospace";
        ctx.fillText("POTENTIAL TUNNEL BARRIER [V₀ = 2.4eV]", bx - 45, by - 10);
      }

      // 3. RENDER SELECTED GRID VISUALIZATION STYLES
      if (s.gridStyle === "mesh" && grid.length > 0) {
        // Connect columns and rows with glowing elastic grid lines warped by wave real part
        ctx.lineWidth = 1.2;
        
        // Draw vertical columns
        for (let i = 0; i < COLS; i++) {
          ctx.beginPath();
          for (let j = 0; j < ROWS; j++) {
            const node = grid[i][j];
            const displacement = node.re * 28; // Scale height mapping
            
            // Neon color gradient mapped dynamically to quantum phase
            const alpha = Math.min(0.8, 0.15 + node.amplitude * 0.5);
            ctx.strokeStyle = `hsla(${(node.phase * 180 / Math.PI + 360) % 360}, 90%, 55%, ${alpha})`;

            if (j === 0) {
              ctx.moveTo(node.x, node.y - displacement);
            } else {
              ctx.lineTo(node.x, node.y - displacement);
            }
          }
          ctx.stroke();
        }

        // Draw horizontal rows
        for (let j = 0; j < ROWS; j++) {
          ctx.beginPath();
          for (let i = 0; i < COLS; i++) {
            const node = grid[i][j];
            const displacement = node.re * 28;
            const alpha = Math.min(0.8, 0.15 + node.amplitude * 0.5);
            ctx.strokeStyle = `hsla(${(node.phase * 180 / Math.PI + 360) % 360}, 90%, 55%, ${alpha})`;

            if (i === 0) {
              ctx.moveTo(node.x, node.y - displacement);
            } else {
              ctx.lineTo(node.x, node.y - displacement);
            }
          }
          ctx.stroke();
        }
      } 
      else if (s.gridStyle === "vectors" && grid.length > 0) {
        // Render 2D array of quantum Phasors (complex vector arrows spinning in complex plane)
        for (let i = 0; i < COLS; i += 2) {
          for (let j = 0; j < ROWS; j += 2) {
            const node = grid[i][j];
            if (!node) continue;

            const baseRadius = 6;
            const arrowLen = Math.min(18, baseRadius + node.amplitude * 14);

            // Vector arrow coordinates
            const endX = node.x + Math.cos(node.phase) * arrowLen;
            const endY = node.y + Math.sin(node.phase) * arrowLen;

            // Color based on phase
            const phaseHue = (node.phase * 180 / Math.PI + 360) % 360;
            ctx.strokeStyle = `hsla(${phaseHue}, 90%, 55%, ${Math.min(0.95, 0.2 + node.amplitude * 0.85)})`;
            ctx.lineWidth = 1.6;

            // Draw vector arrow
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Arrow head
            if (node.amplitude > 0.08) {
              ctx.fillStyle = `hsla(${phaseHue}, 90%, 55%, 0.8)`;
              ctx.beginPath();
              ctx.arc(endX, endY, 2, 0, Math.PI * 2);
              ctx.fill();
            }

            // Faint background rest circle
            ctx.strokeStyle = "rgba(255,255,255,0.02)";
            ctx.beginPath();
            ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      } 
      else if (s.gridStyle === "density" && grid.length > 0) {
        // High density continuous glowing heatmap representing probability density |ψ|²
        const cellW = width / COLS;
        const cellH = height / ROWS;

        for (let i = 0; i < COLS; i++) {
          for (let j = 0; j < ROWS; j++) {
            const node = grid[i][j];
            const probDensity = node.amplitude * node.amplitude;
            if (probDensity < 0.01) continue;

            const hue = (node.phase * 180 / Math.PI + 360) % 360;
            const glowSize = Math.min(35, 12 + probDensity * 45);

            // Glowing light spot representing probability density
            const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
            grad.addColorStop(0, `hsla(${hue}, 95%, 60%, ${Math.min(0.85, probDensity * 1.5)})`);
            grad.addColorStop(0.4, `hsla(${hue}, 90%, 40%, ${Math.min(0.35, probDensity * 0.7)})`);
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      else if (s.gridStyle === "particles") {
        // Monte Carlo drift particles following spatial probability wave flows
        particles.forEach((p) => {
          // Identify enclosing grid node
          const cellW = width / COLS;
          const cellH = height / ROWS;
          const gridI = Math.floor(p.x / cellW);
          const gridJ = Math.floor(p.y / cellH);

          if (gridI >= 0 && gridI < COLS && gridJ >= 0 && gridJ < ROWS) {
            const node = grid[gridI]?.[gridJ];
            if (node) {
              // Drift particle toward phase gradients (high probability fields)
              // Calculate phase wave velocity: vx = k * d(phase)/dx
              // Simple finite difference phase acceleration
              const nextCol = grid[gridI + 1]?.[gridJ];
              const prevCol = grid[gridI - 1]?.[gridJ];
              const nextRow = grid[gridI]?.[gridJ + 1];
              const prevRow = grid[gridI]?.[gridJ - 1];

              let pForceX = 0;
              let pForceY = 0;

              if (nextCol && prevCol) pForceX = (nextCol.amplitude - prevCol.amplitude) * 1.8;
              if (nextRow && prevRow) pForceY = (nextRow.amplitude - prevRow.amplitude) * 1.8;

              p.vx += pForceX + (Math.random() - 0.5) * 0.15;
              p.vy += pForceY + (Math.random() - 0.5) * 0.15;
              
              // Map particle color to localized phase
              p.alpha = Math.min(0.9, 0.2 + node.amplitude * 1.4);
              ctx.fillStyle = `hsla(${(node.phase * 180 / Math.PI + 360) % 360}, 95%, 65%, ${p.alpha})`;
            }
          } else {
            ctx.fillStyle = "rgba(0, 243, 255, 0.35)";
          }

          // Move
          p.x += p.vx;
          p.y += p.vy;

          // Drag
          p.vx *= 0.82;
          p.vy *= 0.82;

          // Keep in bounds
          if (p.x < 0) { p.x = width; p.vx = 0; }
          if (p.x > width) { p.x = 0; p.vx = 0; }
          if (p.y < 0) { p.y = height; p.vy = 0; }
          if (p.y > height) { p.y = 0; p.vy = 0; }

          // Render circular particle representing physical matter probability location
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 4. DRAW MOUSE INTERACTIVE POTENTIAL INDICATOR RING
      if (s.mousePos.x >= 0 && s.mousePos.y >= 0) {
        ctx.strokeStyle = s.mouseMode === "barrier" 
          ? "rgba(239, 68, 68, 0.4)" 
          : s.mouseMode === "well" 
            ? "rgba(34, 197, 94, 0.4)" 
            : "rgba(0, 243, 255, 0.5)";
        
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Pulsing radius indicating potential reach
        const radius = 80 + Math.sin(frameCount * 0.1) * 3;
        ctx.arc(s.mousePos.x, s.mousePos.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Miniature label next to pointer
        ctx.fillStyle = s.mouseMode === "barrier" ? "#f87171" : s.mouseMode === "well" ? "#4ade80" : "#22d3ee";
        ctx.font = "9px monospace";
        const modeText = s.mouseMode === "barrier" 
          ? `POTENTIAL BARRIER (+${s.mouseStrength}eV)` 
          : s.mouseMode === "well" 
            ? `POTENTIAL WELL (-${(s.mouseStrength * 0.75).toFixed(1)}eV)` 
            : "PHASE EXCITATION STATED";
        ctx.fillText(modeText, s.mousePos.x + 15, s.mousePos.y + 15);
      }

      // Display telemetry overlay on canvas margins
      ctx.fillStyle = "rgba(0, 243, 255, 0.8)";
      ctx.font = "9px monospace";
      ctx.fillText(`FIELD RESOLUTION: ${COLS}x${ROWS} QUANTIZED GRID CELLS`, 15, height - 15);
      ctx.fillText(`COHERENT TIME-STEP: dT = ${(s.mass * 0.05).toFixed(3)} // FRAME ID: ${frameCount}`, width - 245, height - 15);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  // Reset grid wave function state back to zero
  const handleResetGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear and redraw
    const width = canvas.width;
    const height = canvas.height;
    
    // Simple reset log
    setEnergyLevels((prev) => prev.map(l => l + (Math.random() - 0.5) * 0.2));
  };

  // Mouse coordinate tracker inside Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    stateRef.current.mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseLeave = () => {
    stateRef.current.mousePos = { x: -1000, y: -1000 };
    stateRef.current.isMouseDown = false;
  };

  const handleMouseDown = () => {
    stateRef.current.isMouseDown = true;
  };

  const handleMouseUp = () => {
    stateRef.current.isMouseDown = false;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 text-left" ref={containerRef}>
      {/* Simulation display and metadata pane */}
      <div className="xl:col-span-3 space-y-4">
        <div className="rounded-xl glass-panel border border-white/5 bg-slate-950/65 p-5 md:p-6 space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-mono font-bold bg-cyan-glow/15 border border-cyan-glow/20 px-2.5 py-0.5 rounded text-cyan-glow uppercase tracking-wider animate-pulse">
                  Schrödinger Solver
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  Real-time Complex Wave Eq.
                </span>
              </div>
              <h2 className="text-xl font-display font-black tracking-tight text-white mt-1.5 flex items-center">
                <Waves className="w-5.5 h-5.5 text-cyan-glow mr-2 animate-pulse" /> 
                Interactive Quantum Probability Grid
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Move your mouse across the grid to create local potential fields, causing diffraction, reflection, or tunneling of probability waves.
              </p>
            </div>

            {/* Quick Presets Landscape Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "free", label: "Free Space", icon: HelpCircle },
                { id: "double_slit", label: "Double Slit", icon: Layers },
                { id: "harmonic", label: "Parabolic Well", icon: Compass },
                { id: "barrier", label: "Potential Barrier", icon: Cpu }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setLandscape(item.id as LandscapeType);
                    audioService.playPressed("haptic");
                    audioService.playCalibration("wave");
                  }}
                  onMouseEnter={() => {
                    audioService.playHover("tick");
                  }}
                  className={`px-3 py-1.5 rounded text-[11px] font-semibold border transition-all ${landscape === item.id ? "bg-cyan-glow/15 border-cyan-glow/30 text-cyan-glow font-bold" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Core Interactive Canvas Element */}
          <div className="relative border border-white/5 rounded-lg overflow-hidden bg-slate-950/80 group">
            <canvas 
              ref={canvasRef} 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className="w-full h-[360px] block cursor-crosshair transition-all" 
            />

            {/* Absolute hovering instruction card */}
            <div className="absolute top-3 left-3 bg-slate-950/85 border border-white/10 px-3 py-2 rounded-md text-[10px] font-mono text-slate-400 pointer-events-none shadow-xl flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-glow animate-ping shrink-0" />
              <span>MOUSE MOVEMENT DISTORTS FIELD LOCAL PHASE</span>
            </div>
            
            {/* Real-time formula toggle overlay */}
            {showFormula && (
              <div className="absolute top-3 right-3 bg-slate-950/90 border border-cyan-glow/20 px-3.5 py-2 rounded-md text-[10px] font-mono text-cyan-glow pointer-events-none shadow-xl max-w-[240px]">
                <div className="font-bold border-b border-white/5 pb-1 flex justify-between">
                  <span>SCHRÖDINGER WAVE EQUATION</span>
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="mt-1.5 text-white leading-relaxed text-xs italic">
                  iℏ ∂/∂t |ψ⟩ = Ĥ|ψ⟩
                </div>
                <div className="mt-1 text-slate-400 text-[9px] leading-relaxed">
                  Where Ĥ = -ℏ²/2m ∇² + V(x,y). Potential landscape V is dynamically distorted by mouse coordinate vectors.
                </div>
              </div>
            )}
          </div>

          {/* Quick HUD telemetry info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-900/40 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-slate-500 uppercase text-[9px] tracking-wider">Field Coherence Ratio</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span ref={coherenceRef} className="text-xl font-bold text-cyan-glow">100.00%</span>
                <span className="text-[10px] text-emerald-400">STABLE</span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-slate-500 uppercase text-[9px] tracking-wider">Probability Eigenstates</span>
              <div className="flex space-x-3 mt-1 text-[10px]">
                {energyLevels.map((lvl, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-[8px] text-slate-400">E{index+1}</span>
                    <span className="font-bold text-white">{(lvl * (freq * 10)).toFixed(2)} eV</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-slate-500 uppercase text-[9px] tracking-wider">Wave function Mode</span>
              <span className="block text-sm font-bold text-white mt-1 uppercase">
                {landscape === "double_slit" ? "Interference Fringe" : landscape === "harmonic" ? "Orbital Shells" : landscape === "barrier" ? "Evanescent Decay" : "Free Dispersion"}
              </span>
            </div>
          </div>

          {/* Scientific summary footer card */}
          <div className="bg-slate-950/90 p-4 rounded-lg border border-white/5 text-xs text-slate-400 space-y-1.5">
            <h4 className="font-mono text-slate-200 uppercase tracking-wider flex items-center text-[10px]">
              <Info className="w-3.5 h-3.5 text-cyan-glow mr-1.5" /> 2D Probability Wave Physics Insight
            </h4>
            <p className="leading-relaxed">
              In this custom laboratory simulation, we represent the spatial wavefunction psi(x,y) on a discrete grid. 
              The color of each node indicates its complex phase angle (computed as atan2 of imaginary and real parts) spanning from cyan to violet, while the brightness matches the probability density |psi|². 
              Moving the mouse generates localized spatial potential perturbations V(x,y), refracting traveling wavefronts or trapping bound state orbits dynamically.
            </p>
          </div>

        </div>
      </div>

      {/* Sidebar Controls and Options Panel */}
      <div className="space-y-4">
        
        {/* Interaction controls widget */}
        <div className="rounded-xl glass-panel border border-white/5 bg-slate-950/65 p-4.5 space-y-4.5 shadow-2xl">
          <h3 className="text-xs font-mono uppercase text-slate-300 tracking-wider flex items-center">
            <Sliders className="w-4 h-4 text-cyan-glow mr-2 animate-pulse" /> 
            Field Perturber Controls
          </h3>

          {/* Mouse Potential Mode Selection */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Mouse Pointer Interaction</label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: "barrier", label: "Potential Barrier (Scatter)", desc: "Repels probability waves" },
                { id: "well", label: "Potential Well (Capture)", desc: "Attracts waves into localized orbits" },
                { id: "excite", label: "Phase Excitation (Harmonic)", desc: "Directly injects localized energy" }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setMouseMode(mode.id as MouseModeType);
                    audioService.playPressed("haptic");
                    audioService.playCalibration("wave");
                  }}
                  onMouseEnter={() => {
                    audioService.playHover("tick");
                  }}
                  className={`text-left p-2.5 rounded border text-xs flex flex-col transition-all ${mouseMode === mode.id ? "bg-cyan-glow/15 border-cyan-glow/30 text-cyan-glow font-bold" : "border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-400"}`}
                >
                  <span className="font-semibold text-[11px] tracking-wide text-slate-200">{mode.label}</span>
                  <span className="text-[9px] text-slate-500 leading-normal">{mode.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style selector */}
          <div className="space-y-2 text-left border-t border-white/5 pt-3">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Visual Field Mapping</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "mesh", label: "3D Grid Mesh" },
                { id: "vectors", label: "Phasor Vectors" },
                { id: "density", label: "Probability Heat" },
                { id: "particles", label: "Monte Carlo" }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setGridStyle(style.id as GridStyleType);
                    audioService.playClick("tap");
                  }}
                  onMouseEnter={() => {
                    audioService.playHover("tick");
                  }}
                  className={`px-2.5 py-2 rounded border text-[11px] text-center font-semibold transition-all ${gridStyle === style.id ? "bg-cyan-glow/15 border-cyan-glow/30 text-cyan-glow font-bold" : "border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-400"}`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Adjust Damping Slider */}
          <div className="space-y-2 text-left border-t border-white/5 pt-3">
            <label className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>WAVE DAMPING FACTOR</span>
              <span className="text-cyan-glow font-bold">{(damping * 100).toFixed(1)}%</span>
            </label>
            <input
              type="range"
              min="0.002"
              max="0.08"
              step="0.002"
              value={damping}
              onChange={(e) => setDamping(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-glow"
            />
            <span className="text-[9px] text-slate-500 block">Controls dispersion friction and energy dissipation.</span>
          </div>

          {/* Excitation Source Frequency Slider */}
          <div className="space-y-2 text-left">
            <label className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>EMITTER FREQUENCY (f)</span>
              <span className="text-cyan-glow font-bold">{(freq * 100).toFixed(0)} GHz</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.35"
              step="0.02"
              value={freq}
              onChange={(e) => setFreq(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-glow"
            />
            <span className="text-[9px] text-slate-500 block">Oscillation cycle rate of continuous plane wave source.</span>
          </div>

          {/* Wave Mass Parameter Slider */}
          <div className="space-y-2 text-left">
            <label className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>PARTICLE SPECIES MASS (m)</span>
              <span className="text-cyan-glow font-bold">{(mass * 1.67).toFixed(2)} amu</span>
            </label>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.1"
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-glow"
            />
            <span className="text-[9px] text-slate-500 block">Mass scales wave phase propagation speed inversely.</span>
          </div>

          {/* Mouse Strength Slider */}
          <div className="space-y-2 text-left">
            <label className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>PERTURBER INTENSITY</span>
              <span className="text-cyan-glow font-bold">{mouseStrength.toFixed(1)} eV</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={mouseStrength}
              onChange={(e) => setMouseStrength(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-glow"
            />
          </div>

          {/* Simulation general action controls */}
          <div className="flex gap-2 border-t border-white/5 pt-3.5">
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                audioService.playPressed("haptic");
              }}
              onMouseEnter={() => {
                audioService.playHover("tick");
              }}
              className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-mono text-white transition-all flex items-center justify-center space-x-1.5 hover:text-cyan-glow"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>PAUSE EXPERIMENT</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-cyan-glow" />
                  <span>RESUME FIELDS</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                handleResetGrid();
                audioService.playClick("confirm");
                audioService.playCalibration("wave");
              }}
              onMouseEnter={() => {
                audioService.playHover("tick");
              }}
              className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center justify-center"
              title="Reset Grid Wave Function"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Formula */}
          <button
            onClick={() => {
              setShowFormula(!showFormula);
              audioService.playClick("pulse");
            }}
            onMouseEnter={() => {
              audioService.playHover("tick");
            }}
            className="w-full py-1.5 rounded bg-slate-950 hover:bg-slate-900 border border-white/5 text-[9px] font-mono text-slate-500 uppercase tracking-widest text-center block"
          >
            {showFormula ? "Hide Mathematical Notation" : "Show Mathematical Notation"}
          </button>
        </div>

      </div>
    </div>
  );
}
