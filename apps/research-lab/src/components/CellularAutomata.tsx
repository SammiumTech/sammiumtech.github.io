import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Shuffle, Sparkles, Zap, Info, Globe, AlertTriangle, ShieldCheck, Thermometer, Wind } from "lucide-react";
import { sounds } from "../utils/sounds";

interface CellularAutomataProps {
  isRgbOverdrive: boolean;
}

type SimLayer = "biosphere" | "thermal" | "atmosphere" | "urbanization";

export const CellularAutomata: React.FC<CellularAutomataProps> = ({ isRgbOverdrive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cols, setCols] = useState(48);
  const [rows, setRows] = useState(26);
  const [cellSize, setCellSize] = useState(13);
  
  // Simulation Controls & Speeds
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedDelay, setSpeedDelay] = useState(150); // ms per step

  // Active Simulation Layer
  const [activeLayer, setActiveLayer] = useState<SimLayer>("biosphere");

  // Custom Planetary Parameters (State)
  const [co2Level, setCo2Level] = useState(418); // ppm
  const [tempAnomaly, setTempAnomaly] = useState(1.2); // °C
  const [moistureLevel, setMoistureLevel] = useState(62); // %
  const [iceAlbedo, setIceAlbedo] = useState(31); // %

  // Grid storing cellular telemetry states:
  // 0: Deep Ocean / Stable Water
  // 1: Coastal Plains / Shrubland
  // 2: Dense Forest / Carbon Sink
  // 3: Mountain Range / Low activity
  // 4: Extreme Heat / Anomaly / Desertification
  // 5: Glacial Cover / High Albedo
  const [grid, setGrid] = useState<number[][]>([]);

  // Ref for holding the simulation state to prevent dependency-loop lag
  const stateRef = useRef({
    grid: [] as number[][],
    cols,
    rows,
    isPlaying,
    activeLayer,
    co2Level,
    tempAnomaly,
    moistureLevel,
    iceAlbedo
  });

  useEffect(() => {
    stateRef.current = {
      grid,
      cols,
      rows,
      isPlaying,
      activeLayer,
      co2Level,
      tempAnomaly,
      moistureLevel,
      iceAlbedo
    };
  }, [grid, cols, rows, isPlaying, activeLayer, co2Level, tempAnomaly, moistureLevel, iceAlbedo]);

  // Create empty base planetary tiles
  const createBaseGrid = (wCols = cols, wRows = rows) => {
    const empty = Array.from({ length: wRows }, () => Array(wCols).fill(0));
    
    // Generate a crude continental map contour based on fractal noise approximation
    for (let r = 0; r < wRows; r++) {
      for (let c = 0; c < wCols; c++) {
        // Simple trigonometric continental outlines
        const s1 = Math.sin(r * 0.35) * Math.cos(c * 0.25);
        const s2 = Math.cos(r * 0.15 + 1) * Math.sin(c * 0.4);
        const noise = s1 + s2;

        if (noise > 0.15) {
          // Standard land
          empty[r][c] = 1; 
          // Enrich with random mountain chains
          if (noise > 0.55 && Math.random() > 0.4) {
            empty[r][c] = 3; // Mountain
          } else if (Math.random() > 0.6) {
            empty[r][c] = 2; // Forest
          }
        } else {
          empty[r][c] = 0; // Ocean
        }

        // Add Glaciers on polar extremes
        if (r < 2 || r > wRows - 3) {
          empty[r][c] = 5; // Glacial Ice
        }
      }
    }
    return empty;
  };

  const seedPlanetarySimulation = () => {
    sounds.playSingularity();
    const seeded = createBaseGrid();
    
    // Inject custom hot-spots depending on temp anomaly
    if (tempAnomaly > 1.8) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (seeded[i][j] === 1 && Math.random() < (tempAnomaly - 1.0) * 0.2) {
            seeded[i][j] = 4; // Hotspot / desertification
          }
        }
      }
    }
    setGrid(seeded);
  };

  const clearSimulation = () => {
    sounds.playClick();
    // Keep it pure ocean + small barren land strips
    const empty = Array.from({ length: rows }, () => Array(cols).fill(0));
    setGrid(empty);
  };

  useEffect(() => {
    seedPlanetarySimulation();
  }, [cols, rows]);

  // Apply climate presets
  const applyPreset = (presetType: "holocene" | "anthropocene" | "cryosphere") => {
    sounds.playLaser();
    if (presetType === "holocene") {
      setCo2Level(280);
      setTempAnomaly(0.0);
      setMoistureLevel(75);
      setIceAlbedo(45);
    } else if (presetType === "anthropocene") {
      setCo2Level(520);
      setTempAnomaly(3.4);
      setMoistureLevel(42);
      setIceAlbedo(12);
    } else {
      setCo2Level(120);
      setTempAnomaly(-2.8);
      setMoistureLevel(50);
      setIceAlbedo(78);
    }
  };

  // Re-seed grid when parameters change significantly
  useEffect(() => {
    // Modify current grid cells in-place depending on temperature anomalies
    setGrid(prev => {
      if (!prev || prev.length === 0) return prev;
      return prev.map((rowArr, rIdx) => 
        rowArr.map((cellVal, cIdx) => {
          // Melt glaciers if hot
          if (cellVal === 5 && tempAnomaly > 2.0 && Math.random() > 0.8) {
            return 0; // Ocean (glacier melt)
          }
          // Expand glaciers if frozen
          if (cellVal === 0 && tempAnomaly < -1.0 && (rIdx < 5 || rIdx > rows - 6) && Math.random() > 0.7) {
            return 5; 
          }
          // Expand desert if extremely hot
          if (cellVal === 1 && tempAnomaly > 2.5 && Math.random() > 0.85) {
            return 4;
          }
          // Turn desert back to shrubland if moisture goes high
          if (cellVal === 4 && moistureLevel > 65 && Math.random() > 0.75) {
            return 1;
          }
          return cellVal;
        })
      );
    });
  }, [tempAnomaly, moistureLevel]);

  // Handle manual painting of cells on the planet grid
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const colIdx = Math.floor(clickX / cellSize);
    const rowIdx = Math.floor(clickY / cellSize);

    if (rowIdx >= 0 && rowIdx < rows && colIdx >= 0 && colIdx < cols) {
      sounds.playHover();
      setGrid(prev => 
        prev.map((rowArr, rIdx) =>
          rowArr.map((cellVal, cIdx) => {
            if (rIdx === rowIdx && cIdx === colIdx) {
              // Cycle through terrain tiles: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0
              return (cellVal + 1) % 6;
            }
            return cellVal;
          })
        )
      );
    }
  };

  // Core Simulation Ticker - Environmental Feedbacks
  useEffect(() => {
    let intervalId: any;

    const tickEnvironmentalGrid = () => {
      const current = stateRef.current;
      if (!current.isPlaying) return;

      const currentGrid = current.grid;
      if (currentGrid.length === 0) return;

      const nextGrid = Array.from({ length: current.rows }, () => Array(current.cols).fill(0));
      let changed = false;

      // Rules depend on CO2 level & temperature
      for (let r = 0; r < current.rows; r++) {
        for (let c = 0; c < current.cols; c++) {
          const cell = currentGrid[r]?.[c] || 0;
          
          // Count neighbor states
          let plainsCount = 0;
          let forestCount = 0;
          let heatCount = 0;
          let oceanCount = 0;
          let iceCount = 0;

          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;
              const tr = r + i;
              const tc = c + j;

              if (tr >= 0 && tr < current.rows && tc >= 0 && tc < current.cols) {
                const neighbor = currentGrid[tr]?.[tc];
                if (neighbor === 0) oceanCount++;
                else if (neighbor === 1) plainsCount++;
                else if (neighbor === 2) forestCount++;
                else if (neighbor === 4) heatCount++;
                else if (neighbor === 5) iceCount++;
              }
            }
          }

          // Default next cell values
          let nextCell = cell;

          // 1. Carbon Sink propagation (Forest growth)
          if (cell === 1) { // Plains
            // High CO2 and moderate temp breeds forest expansion
            if (forestCount >= 2 && current.co2Level > 350 && Math.random() > 0.6) {
              nextCell = 2; // Forest expansion
            } else if (heatCount >= 3 && current.tempAnomaly > 1.5) {
              nextCell = 4; // Desertification
            }
          }
          // 2. Forest fires / Desertification
          else if (cell === 2) { // Forest
            if (heatCount >= 2 && current.tempAnomaly > 2.0 && Math.random() > 0.8) {
              nextCell = 4; // Burn / dry out
            } else if (oceanCount >= 4 && current.moistureLevel > 70 && Math.random() > 0.95) {
              // Expand back to coastal plains
              nextCell = 1;
            }
          }
          // 3. Glacial Albedo Dynamics
          else if (cell === 5) { // Ice cap
            if (current.tempAnomaly > 1.0 && (oceanCount >= 1 || plainsCount >= 1) && Math.random() > 0.7) {
              nextCell = 0; // Melting back to ocean
            }
          }
          // 4. Barren plains conversion
          else if (cell === 0) { // Ocean
            if (iceCount >= 4 && current.tempAnomaly < -0.5 && Math.random() > 0.7) {
              nextCell = 5; // Freezing to glacier
            }
          }
          // 5. Heat anomaly dissipating
          else if (cell === 4) {
            if (current.moistureLevel > 60 && forestCount >= 1 && Math.random() > 0.75) {
              nextCell = 1; // Shrubland recovery
            }
          }

          nextGrid[r][c] = nextCell;
          if (nextCell !== cell) {
            changed = true;
          }
        }
      }

      if (changed) {
        setGrid(nextGrid);
      }
    };

    if (isPlaying) {
      intervalId = setInterval(tickEnvironmentalGrid, speedDelay);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, speedDelay]);

  // Render Simulation Frame on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid outlines (Latitude & Longitude)
    ctx.strokeStyle = "rgba(15, 23, 42, 0.4)";
    ctx.lineWidth = 0.5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellSize;
        const y = r * cellSize;
        const cellType = grid[r]?.[c] || 0;

        // Custom styling palettes based on active layers
        let fill = "rgba(15, 23, 42, 0.3)";
        let glow = "";

        if (activeLayer === "biosphere") {
          // Standard planetary biosphere representation
          switch (cellType) {
            case 0: // Ocean
              fill = "rgba(14, 116, 144, 0.75)"; // Teal/Blue Ocean
              break;
            case 1: // Coastal Plains
              fill = "rgb(16, 185, 129)"; // Green plains
              break;
            case 2: // Forest
              fill = "rgb(4, 120, 87)"; // Deep Forest
              break;
            case 3: // Mountain
              fill = "rgb(120, 113, 108)"; // Stone mountain
              break;
            case 4: // Desert / Anomaly
              fill = "rgb(245, 158, 115)"; // Soft orange sand
              break;
            case 5: // Glacier
              fill = "rgb(224, 242, 254)"; // Glacier Ice Blue-white
              glow = "rgba(186, 230, 253, 0.5)";
              break;
          }
        } else if (activeLayer === "thermal") {
          // High-contrast infrared heat map representation
          switch (cellType) {
            case 0: 
              fill = "rgba(15, 23, 42, 0.8)"; // Cool ocean dark
              break;
            case 1:
              fill = "rgba(220, 38, 38, 0.4)"; // Soft red
              break;
            case 2:
              fill = "rgba(16, 185, 129, 0.3)"; // Cooler green sink
              break;
            case 3:
              fill = "rgba(120, 113, 108, 0.2)"; // Neutral rock
              break;
            case 4:
              fill = "rgb(239, 68, 68)"; // Radiant fire hot
              glow = "rgb(239, 68, 68)";
              break;
            case 5:
              fill = "rgb(59, 130, 246)"; // Cold ice caps
              break;
          }
        } else if (activeLayer === "atmosphere") {
          // Atmospheric cyclonic fronts
          const framePulse = Math.sin(Date.now() / 400 + (r * c)) * 0.15;
          switch (cellType) {
            case 0:
              fill = `rgba(6, 182, 212, ${0.45 + framePulse})`; // Cyan air eddies
              break;
            case 4:
              fill = "rgba(249, 115, 22, 0.6)"; // High pressure warm blocks
              break;
            case 5:
              fill = "rgba(255, 255, 255, 0.85)"; // Cold high albedo storms
              break;
            default:
              fill = `rgba(148, 163, 184, ${0.15 + framePulse})`; // Normal jetstream moisture
          }
        } else if (activeLayer === "urbanization") {
          // Nightlight cities and hyperloop infrastructure grids
          switch (cellType) {
            case 3:
              fill = "rgba(15, 23, 42, 0.9)"; // Mountains block cities
              break;
            case 4:
              fill = "rgb(245, 158, 11)"; // Warm night cities lights
              glow = "rgb(245, 158, 11)";
              break;
            case 2:
              fill = "rgba(4, 120, 87, 0.15)"; // Forests are dark zones
              break;
            default:
              if (Math.random() > 0.9 && cellType !== 0) {
                fill = "rgba(245, 158, 11, 0.85)"; // City centers
                glow = "rgb(245, 158, 11)";
              } else {
                fill = "rgba(15, 23, 42, 0.85)"; // Empty dark landscapes
              }
          }
        }

        if (isRgbOverdrive && cellType !== 0) {
          const hShift = (cellType * 40 + Date.now() / 25) % 360;
          fill = `hsl(${hShift}, 100%, 60%)`;
          glow = fill;
        }

        // Draw Cell RoundRect
        ctx.fillStyle = fill;
        if (glow) {
          ctx.shadowBlur = isRgbOverdrive ? 10 : 4;
          ctx.shadowColor = glow;
        }

        ctx.beginPath();
        ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
        
        ctx.stroke();
      }
    }

    // Draw lat/long outline marks
    ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Equator line
    ctx.moveTo(0, (rows / 2) * cellSize);
    ctx.lineTo(cols * cellSize, (rows / 2) * cellSize);
    ctx.stroke();

    // Central meridian
    ctx.beginPath();
    ctx.moveTo((cols / 2) * cellSize, 0);
    ctx.lineTo((cols / 2) * cellSize, rows * cellSize);
    ctx.stroke();

    // DIGITAL TWIN EARTH GEOSPATIAL VISUALIZATIONS
    const drawTime = Date.now() * 0.0006;
    const canvasWidth = cols * cellSize;
    const canvasHeight = rows * cellSize;

    // 1. Orbiting Satellites
    const satellites = [
      { id: "SAT-ALPHA-L1", radiusX: canvasWidth * 0.42, radiusY: canvasHeight * 0.28, speed: 0.9, color: "#10b981" },
      { id: "SAT-KEPLER-G4", radiusX: canvasWidth * 0.35, radiusY: canvasHeight * 0.34, speed: -0.6, color: "#a855f7" },
      { id: "SAT-WEATHER-S3", radiusX: canvasWidth * 0.46, radiusY: canvasHeight * 0.18, speed: 1.1, color: "#06b6d4" }
    ];

    satellites.forEach((sat, sIdx) => {
      const angle = drawTime * sat.speed + sIdx * (Math.PI / 3);
      const cx = canvasWidth / 2;
      const cy = canvasHeight / 2;
      const x = cx + Math.cos(angle) * sat.radiusX;
      const y = cy + Math.sin(angle) * sat.radiusY;

      // Orbit Track Line
      ctx.strokeStyle = `${sat.color}1c`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, sat.radiusX, sat.radiusY, sIdx * 0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Orbital node point
      ctx.fillStyle = sat.color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Signal radar ping
      ctx.strokeStyle = `${sat.color}40`;
      ctx.beginPath();
      ctx.arc(x, y, 10 + Math.sin(Date.now() / 200 + sIdx) * 4, 0, Math.PI * 2);
      ctx.stroke();

      // Satellite Label tag
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "8px monospace";
      ctx.fillText(sat.id, x + 7, y - 3);
    });

    // 2. Dynamic Weather typhoon tracker
    if (activeLayer === "atmosphere" || activeLayer === "biosphere") {
      const typhoonX = canvasWidth * 0.62 + Math.sin(drawTime * 0.3) * 45;
      const typhoonY = canvasHeight * 0.42 + Math.cos(drawTime * 0.3) * 25;

      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 1.5;
      for (let rDist = 10; rDist < 38; rDist += 8) {
        ctx.beginPath();
        ctx.arc(typhoonX, typhoonY, rDist, drawTime * 4, drawTime * 4 + Math.PI * 1.5);
        ctx.stroke();
      }

      // Eye of Storm
      ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
      ctx.beginPath();
      ctx.arc(typhoonX, typhoonY, 7, 0, Math.PI * 2);
      ctx.fill();

      // Red core ping
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(typhoonX, typhoonY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgb(239, 68, 68)";
      ctx.font = "bold 8px font-mono";
      ctx.fillText("⚠️ TYPHOON EPSILON // CAT 4", typhoonX + 12, typhoonY - 4);
    }

    // 3. Smart Community Regional sensor locations
    const sensors = [
      { name: "SENSOR_01 // SECURE", x: 0.22, y: 0.38, state: "OK" },
      { name: "SENSOR_02 // STORM SURGE", x: 0.52, y: 0.72, state: "ALERT" },
      { name: "SENSOR_03 // HYPERLOOP", x: 0.78, y: 0.28, state: "OK" }
    ];

    sensors.forEach((sns, idx) => {
      const sx = canvasWidth * sns.x;
      const sy = canvasHeight * sns.y;
      const isAlert = sns.state === "ALERT";
      const pulseColor = isAlert ? "#ef4444" : "#10b981";

      ctx.fillStyle = pulseColor;
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();

      if (Math.sin(Date.now() / 150 + idx) > 0) {
        ctx.strokeStyle = pulseColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 7, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
      ctx.font = "6px monospace";
      ctx.fillText(sns.name, sx + 6, sy + 2);
    });

  }, [grid, isRgbOverdrive, activeLayer, cols, rows]);

  // Calculate live coverage percentages for display
  const totalCells = cols * rows;
  const forestCells = grid.flat().filter(c => c === 2).length;
  const iceCells = grid.flat().filter(c => c === 5).length;
  const heatCells = grid.flat().filter(c => c === 4).length;

  const forestCoverPct = ((forestCells / totalCells) * 100).toFixed(1);
  const iceCoverPct = ((iceCells / totalCells) * 100).toFixed(1);
  const heatCoverPct = ((heatCells / totalCells) * 100).toFixed(1);

  return (
    <div id="cellular-automata-station" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Simulation Viewport */}
      <div className="xl:col-span-8 flex flex-col gap-4">
        <div className={`relative rounded-xl border bg-[#040612] overflow-hidden shadow-2xl transition-all duration-300 ${
          isRgbOverdrive 
            ? "border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)]" 
            : "border-slate-800"
        }`}>
          {/* Top diagnostic bar */}
          <div className="absolute top-3 left-3 right-3 z-10 flex flex-col sm:flex-row gap-2 items-center justify-between bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                🌍 DIGITAL TWIN EARTH SIMULATOR // REGIONAL MODEL
              </span>
            </div>
            
            {/* Layer Toggles */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-0.5 rounded border border-slate-800">
              {(["biosphere", "thermal", "atmosphere", "urbanization"] as SimLayer[]).map((layer) => (
                <button
                  key={layer}
                  onClick={() => {
                    sounds.playClick();
                    setActiveLayer(layer);
                  }}
                  className={`px-2 py-1 rounded text-[8px] font-mono uppercase font-bold transition-all ${
                    activeLayer === layer 
                      ? "bg-cyan-500 text-slate-950" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {layer === "biosphere" ? "🌳 Biosphere" : layer === "thermal" ? "🔥 Thermal Map" : layer === "atmosphere" ? "💨 Pressure" : "🏙️ Cities"}
                </button>
              ))}
            </div>

            {/* Play/Pause controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 transition-colors"
                title={isPlaying ? "Pause Climate Sim" : "Resume Climate Sim"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={seedPlanetarySimulation}
                className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 transition-colors"
                title="Re-seed Continents"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={clearSimulation}
                className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-rose-400 text-slate-300 transition-colors"
                title="Silt Ocean Matrix"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Simulation */}
          <div className="pt-16 pb-12 sm:pb-3 px-3">
            <canvas
              ref={canvasRef}
              width={624}
              height={338}
              onClick={handleCanvasInteraction}
              className="w-full bg-[#02040c] block rounded border border-slate-900/80 cursor-crosshair"
              style={{ maxHeight: "338px" }}
            />
          </div>

          {/* Latitude Longitude labels */}
          <div className="absolute left-4 bottom-4 pointer-events-none font-mono text-[7px] text-slate-500 flex flex-col">
            <span>LAT: +90°N (POLAR)</span>
            <span>EQUATOR: 0°N</span>
            <span>LAT: -90°S (POLAR)</span>
          </div>

          <div className="absolute right-4 bottom-4 pointer-events-none font-mono text-[7px] text-slate-500 text-right">
            <span>LONG: -180°W to +180°E</span>
            <span>REGIONAL COVERAGE: 100%</span>
          </div>
        </div>

        {/* Real-time planetary state charts widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-900/85 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-950/40 text-cyan-400">
              <Globe className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="text-[9px] font-mono text-slate-500">CARBON ABSORB RATE</div>
              <div className="text-sm font-mono font-bold text-cyan-400">{forestCoverPct}%</div>
            </div>
          </div>

          <div className="p-3 bg-slate-900/85 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded bg-amber-950/40 text-amber-400">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-mono text-slate-500">GLACIAL DECAY RATE</div>
              <div className="text-sm font-mono font-bold text-amber-400">{iceCoverPct}%</div>
            </div>
          </div>

          <div className="p-3 bg-slate-900/85 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded bg-orange-950/40 text-orange-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-mono text-slate-500">INFRARED ANOMALIES</div>
              <div className="text-sm font-mono font-bold text-orange-400">{heatCoverPct}%</div>
            </div>
          </div>

          <div className="p-3 bg-slate-900/85 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-950/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-mono text-slate-500">MODEL INTEGRITY</div>
              <div className="text-sm font-mono font-bold text-emerald-400">99.8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Control & Parameter Calibration Panel */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        <div className={`p-4 rounded-xl border bg-slate-900/95 shadow-md relative transition-all duration-300 ${
          isRgbOverdrive ? "border-cyan-glow" : "border-slate-800"
        }`}>
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-3.5 flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-cyan-400" /> [ PLANETARY_INTEGRITY_CONTROLLERS ]
          </h3>

          <div className="flex flex-col gap-4">
            {/* Atmospheric CO2 Level */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span>ATMOSPHERIC CO2 CONCENTRATION</span>
                <span className="text-cyan-400 font-bold">{co2Level} PPM</span>
              </div>
              <input
                type="range"
                min="180"
                max="800"
                step="5"
                value={co2Level}
                onChange={(e) => {
                  sounds.playHover();
                  setCo2Level(parseInt(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
            </div>

            {/* Surface Temp Anomaly */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span>GLOBAL MEAN TEMP ANOMALY</span>
                <span className={`font-bold ${tempAnomaly > 2.0 ? "text-orange-400 animate-pulse" : "text-emerald-400"}`}>
                  {tempAnomaly > 0 ? `+${tempAnomaly}` : tempAnomaly}°C
                </span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="5.0"
                step="0.1"
                value={tempAnomaly}
                onChange={(e) => {
                  sounds.playHover();
                  setTempAnomaly(parseFloat(e.target.value));
                }}
                className="w-full accent-orange-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
            </div>

            {/* Moisture Level */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span>PRECIPITATION & MOISTURE INDEX</span>
                <span className="text-teal-400 font-bold">{moistureLevel}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="2"
                value={moistureLevel}
                onChange={(e) => {
                  sounds.playHover();
                  setMoistureLevel(parseInt(e.target.value));
                }}
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
            </div>

            {/* Presets and Scenarios */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-2">INTEGRATE CLIMATE SCENARIOS:</span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => applyPreset("holocene")}
                  className="px-3 py-2 text-left text-[10px] font-mono bg-slate-950 border border-slate-800 hover:border-emerald-500 rounded text-slate-300 hover:text-emerald-400 transition-all flex justify-between"
                >
                  <span>🌿 Holocene Equilibrium</span>
                  <span className="text-emerald-400 font-bold">STABLE</span>
                </button>
                <button
                  onClick={() => applyPreset("anthropocene")}
                  className="px-3 py-2 text-left text-[10px] font-mono bg-slate-950 border border-slate-800 hover:border-orange-500 rounded text-slate-300 hover:text-orange-400 transition-all flex justify-between"
                >
                  <span>🏭 Anthropocene Greenhouse</span>
                  <span className="text-orange-400 font-bold">WARNING</span>
                </button>
                <button
                  onClick={() => applyPreset("cryosphere")}
                  className="px-3 py-2 text-left text-[10px] font-mono bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded text-slate-300 hover:text-cyan-400 transition-all flex justify-between"
                >
                  <span>❄️ Ice Age Cryosphere</span>
                  <span className="text-cyan-400 font-bold">FREEZE</span>
                </button>
              </div>
            </div>

            {/* Context feedback details */}
            <div className="mt-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-[9px] font-mono text-slate-400 leading-relaxed">
                Earth tiles represent regional biomes. High temp anomalies trigger desertification and glacier melt feedback loops, while moisture inputs spur forest regrowth to absorb CO2!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
