import React, { useState, useEffect } from "react";
import { Activity, Play, Zap, HelpCircle } from "lucide-react";

export default function SynapseSim() {
  // Draggable node activations
  const [inputs, setInputs] = useState<number[]>([0.8, 0.3, 0.9]);
  const [activationType, setActivationType] = useState<"Sigmoid" | "ReLU" | "Tanh">("Sigmoid");
  
  // Fully defined weights mapping (3 inputs -> 4 hidden nodes, 4 hidden -> 2 output nodes)
  const [weightsIH, setWeightsIH] = useState<number[][]>([
    [1.5, -1.0, 0.5, -2.0], // weights from Input 0
    [-0.5, 2.0, -1.5, 1.0], // weights from Input 1
    [0.8, -0.5, 1.2, 0.0]   // weights from Input 2
  ]);

  const [weightsHO, setWeightsHO] = useState<number[][]>([
    [1.2, -1.5], // from Hidden 0
    [-1.0, 1.8], // from Hidden 1
    [0.5, -0.8], // from Hidden 2
    [-2.0, 1.0]  // from Hidden 3
  ]);

  const [hiddenActivations, setHiddenActivations] = useState<number[]>([0, 0, 0, 0]);
  const [outputs, setOutputs] = useState<number[]>([0, 0]);

  // Math functions
  const activate = (x: number): number => {
    switch (activationType) {
      case "ReLU":
        return Math.max(0, x);
      case "Tanh":
        return Math.tanh(x);
      case "Sigmoid":
      default:
        return 1 / (1 + Math.exp(-x));
    }
  };

  // Perform full feedforward calculation
  useEffect(() => {
    // 1. Calculate hidden layers
    const nextHidden = [0, 0, 0, 0];
    for (let h = 0; h < 4; h++) {
      let sum = 0;
      for (let i = 0; i < 3; i++) {
        sum += inputs[i] * weightsIH[i][h];
      }
      nextHidden[h] = activate(sum);
    }
    setHiddenActivations(nextHidden);

    // 2. Calculate output layers
    const nextOutputs = [0, 0];
    for (let o = 0; o < 2; o++) {
      let sum = 0;
      for (let h = 0; h < 4; h++) {
        sum += nextHidden[h] * weightsHO[h][o];
      }
      nextOutputs[o] = activate(sum);
    }
    setOutputs(nextOutputs);
  }, [inputs, weightsIH, weightsHO, activationType]);

  const handleWeightClick = (type: "IH" | "HO", r: number, c: number) => {
    // Quick cycling weight values: -2.0 -> -1.0 -> 0.0 -> 1.0 -> 2.0
    if (type === "IH") {
      const nextWeights = weightsIH.map((row) => [...row]);
      let w = nextWeights[r][c];
      w = w >= 2 ? -2 : w + 1;
      nextWeights[r][c] = parseFloat(w.toFixed(1));
      setWeightsIH(nextWeights);
    } else {
      const nextWeights = weightsHO.map((row) => [...row]);
      let w = nextWeights[r][c];
      w = w >= 2 ? -2 : w + 1;
      nextWeights[r][c] = parseFloat(w.toFixed(1));
      setWeightsHO(nextWeights);
    }
  };

  const resetWeights = () => {
    setWeightsIH([
      [1.5, -1.0, 0.5, -2.0],
      [-0.5, 2.0, -1.5, 1.0],
      [0.8, -0.5, 1.2, 0.0]
    ]);
    setWeightsHO([
      [1.2, -1.5],
      [-1.0, 1.8],
      [0.5, -0.8],
      [-2.0, 1.0]
    ]);
    setInputs([0.8, 0.3, 0.9]);
  };

  return (
    <div className="space-y-6" id="synapse-sim">
      <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 neon-glow-blue">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Simulation Portal
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-1">
              Synapse Neural Feedforward Visualizer
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetWeights}
              className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded text-[10px] font-mono text-slate-400 transition"
            >
              RESET MODEL
            </button>
          </div>
        </div>

        {/* Configurations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-850 space-y-1">
            <span className="text-[10px] text-slate-500 font-mono block">ACTIVATION FUNCTION</span>
            <div className="flex gap-1 pt-1">
              {(["Sigmoid", "ReLU", "Tanh"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActivationType(t)}
                  className={`flex-1 py-1 px-1.5 rounded font-mono text-[10px] border transition ${
                    activationType === t
                      ? "bg-blue-600/10 border-blue-500 text-blue-400 font-semibold"
                      : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-850 md:col-span-2 flex items-center justify-between text-xs text-slate-400 gap-4">
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>INTERACTIVE CONTROLS:</span>
            </div>
            <div className="flex flex-wrap gap-4 font-mono text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-blue-400 inline-block" /> Positive weight</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-pink-500 inline-block" /> Negative weight</span>
              <span className="text-slate-500 italic">Click synapses to toggle values</span>
            </div>
          </div>
        </div>

        {/* Neural Network SVG Container */}
        <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-4 overflow-x-auto">
          <div className="min-w-[600px] relative">
            <svg viewBox="0 0 700 320" className="w-full h-auto">
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-pink" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Connections Lines (Synapses) */}
              {/* Input Layer to Hidden Layer */}
              {inputs.map((inp, iIdx) => {
                const startX = 80;
                const startY = 60 + iIdx * 100;
                return hiddenActivations.map((hid, hIdx) => {
                  const endX = 350;
                  const endY = 40 + hIdx * 80;
                  const w = weightsIH[iIdx][hIdx];
                  const absW = Math.abs(w);
                  const isPositive = w >= 0;
                  
                  return (
                    <g key={`ih-${iIdx}-${hIdx}`} className="cursor-pointer group">
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke={isPositive ? "rgba(59, 130, 246, 0.7)" : "rgba(236, 72, 153, 0.7)"}
                        strokeWidth={0.5 + absW * 1.5}
                        className="transition-all hover:stroke-yellow-400 hover:stroke-[3px]"
                        onClick={() => handleWeightClick("IH", iIdx, hIdx)}
                      />
                      <rect
                        x={(startX + endX) / 2 - 14}
                        y={(startY + endY) / 2 - 9}
                        width="28"
                        height="18"
                        rx="3"
                        fill="#0b1329"
                        stroke={isPositive ? "#1e40af" : "#9d174d"}
                        strokeWidth="1"
                        onClick={() => handleWeightClick("IH", iIdx, hIdx)}
                      />
                      <text
                        x={(startX + endX) / 2}
                        y={(startY + endY) / 2 + 4}
                        textAnchor="middle"
                        fill={isPositive ? "#60a5fa" : "#f472b6"}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {w > 0 ? `+${w}` : w}
                      </text>
                    </g>
                  );
                });
              })}

              {/* Hidden Layer to Output Layer */}
              {hiddenActivations.map((hid, hIdx) => {
                const startX = 350;
                const startY = 40 + hIdx * 80;
                return outputs.map((out, oIdx) => {
                  const endX = 620;
                  const endY = 100 + oIdx * 120;
                  const w = weightsHO[hIdx][oIdx];
                  const absW = Math.abs(w);
                  const isPositive = w >= 0;

                  return (
                    <g key={`ho-${hIdx}-${oIdx}`} className="cursor-pointer group">
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke={isPositive ? "rgba(59, 130, 246, 0.7)" : "rgba(236, 72, 153, 0.7)"}
                        strokeWidth={0.5 + absW * 1.5}
                        className="transition-all hover:stroke-yellow-400 hover:stroke-[3px]"
                        onClick={() => handleWeightClick("HO", hIdx, oIdx)}
                      />
                      <rect
                        x={(startX + endX) / 2 - 14}
                        y={(startY + endY) / 2 - 9}
                        width="28"
                        height="18"
                        rx="3"
                        fill="#0b1329"
                        stroke={isPositive ? "#1e40af" : "#9d174d"}
                        strokeWidth="1"
                        onClick={() => handleWeightClick("HO", hIdx, oIdx)}
                      />
                      <text
                        x={(startX + endX) / 2}
                        y={(startY + endY) / 2 + 4}
                        textAnchor="middle"
                        fill={isPositive ? "#60a5fa" : "#f472b6"}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {w > 0 ? `+${w}` : w}
                      </text>
                    </g>
                  );
                });
              })}

              {/* 2. Nodes Circles & Labels */}
              {/* Input Layer */}
              {inputs.map((inp, idx) => {
                const cx = 80;
                const cy = 60 + idx * 100;
                return (
                  <g key={`node-i-${idx}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="18"
                      fill="#020617"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                    />
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {inp.toFixed(1)}
                    </text>
                    <text x={cx} y={cy - 24} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                      IN {idx + 1}
                    </text>
                  </g>
                );
              })}

              {/* Hidden Layer */}
              {hiddenActivations.map((hid, idx) => {
                const cx = 350;
                const cy = 40 + idx * 80;
                return (
                  <g key={`node-h-${idx}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="18"
                      fill="#020617"
                      stroke="#8b5cf6"
                      strokeWidth="2.5"
                    />
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {hid.toFixed(2)}
                    </text>
                    <text x={cx} y={cy - 24} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                      H {idx + 1}
                    </text>
                  </g>
                );
              })}

              {/* Output Layer */}
              {outputs.map((out, idx) => {
                const cx = 620;
                const cy = 100 + idx * 120;
                return (
                  <g key={`node-o-${idx}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="20"
                      fill="#020617"
                      stroke="#10b981"
                      strokeWidth="3"
                    />
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {out.toFixed(2)}
                    </text>
                    <text x={cx} y={cy - 28} textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {idx === 0 ? "O1: PREDICTED HAZARD" : "O2: RECOVERY STABILITY"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Live Input Controller Sliders */}
        <div className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-900">
          {inputs.map((inp, idx) => (
            <div key={idx} className="space-y-1.5 p-3 rounded-lg bg-slate-950/40 border border-slate-850">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>INPUT {idx + 1} AMPLITUDE</span>
                <span className="text-blue-400 font-bold">{inp.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={inp}
                onChange={(e) => {
                  const nextInps = [...inputs];
                  nextInps[idx] = parseFloat(e.target.value);
                  setInputs(nextInps);
                }}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
