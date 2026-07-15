import React, { useState, useEffect } from "react";
import { 
  Cpu, Play, RotateCcw, HelpCircle, Sparkles, Activity, Plus, Trash2 
} from "lucide-react";
import { audioService } from "../utils/audioService";

type GateType = "I" | "X" | "H" | "Z" | "CNOT";

interface GatePosition {
  qubitIdx: number; // 0 or 1
  gateType: GateType;
}

export default function ComputingPlayground() {
  const [gatesQ0, setGatesQ0] = useState<GateType[]>(["I", "I", "I", "I"]);
  const [gatesQ1, setGatesQ1] = useState<GateType[]>(["I", "I", "I", "I"]);
  const [probabilities, setProbabilities] = useState<{ "00": number; "01": number; "10": number; "11": number }>({
    "00": 1.0, "01": 0.0, "10": 0.0, "11": 0.0
  });
  const [selectedGate, setSelectedGate] = useState<GateType>("H");
  const [measurementTrials, setMeasurementTrials] = useState<null | Record<string, number>>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Re-calculate state probability vector whenever circuit gates change
  useEffect(() => {
    calculateCircuitState();
    setMeasurementTrials(null); // Clear trial results
  }, [gatesQ0, gatesQ1]);

  const calculateCircuitState = () => {
    // We simulate a 2-qubit state vector |ψ⟩ = c00|00⟩ + c01|01⟩ + c10|10⟩ + c11|11⟩
    // Initial state: |00⟩
    let state = {
      "00": 1.0,
      "01": 0.0,
      "10": 0.0,
      "11": 0.0
    };

    // Helper to apply single-qubit gates on qubit 0 (first index) or qubit 1 (second index)
    // We apply column-by-column (4 slots)
    for (let col = 0; col < 4; col++) {
      const g0 = gatesQ0[col];
      const g1 = gatesQ1[col];

      // 1. Process Qubit 0 gate (affects state values for first digit)
      if (g0 === "X") {
        // Swap values 00<->10, 01<->11
        const temp00 = state["00"];
        const temp01 = state["01"];
        state["00"] = state["10"];
        state["01"] = state["11"];
        state["10"] = temp00;
        state["11"] = temp01;
      } else if (g0 === "H") {
        // Hadamard on Q0: maps |0⟩ -> (|0⟩+|1⟩)/√2, |1⟩ -> (|0⟩-|1⟩)/√2
        // c00_new = (c00 + c10)/√2, c10_new = (c00 - c10)/√2
        const c00 = state["00"];
        const c10 = state["10"];
        const c01 = state["01"];
        const c11 = state["11"];

        state["00"] = (c00 + c10) / Math.sqrt(2);
        state["10"] = (c00 - c10) / Math.sqrt(2);
        state["01"] = (c01 + c11) / Math.sqrt(2);
        state["11"] = (c01 - c11) / Math.sqrt(2);
      } else if (g0 === "Z") {
        // Phase flip on Q0: |1⟩ -> -|1⟩
        state["10"] = -state["10"];
        state["11"] = -state["11"];
      }

      // 2. Process Qubit 1 gate
      if (g1 === "X") {
        // Swap values 00<->01, 10<->11
        const temp00 = state["00"];
        const temp10 = state["10"];
        state["00"] = state["01"];
        state["10"] = state["11"];
        state["01"] = temp00;
        state["11"] = temp10;
      } else if (g1 === "H") {
        // Hadamard on Q1
        const c00 = state["00"];
        const c01 = state["01"];
        const c10 = state["10"];
        const c11 = state["11"];

        state["00"] = (c00 + c01) / Math.sqrt(2);
        state["01"] = (c00 - c01) / Math.sqrt(2);
        state["10"] = (c10 + c11) / Math.sqrt(2);
        state["11"] = (c10 - c11) / Math.sqrt(2);
      } else if (g1 === "Z") {
        // Phase flip on Q1
        state["01"] = -state["01"];
        state["11"] = -state["11"];
      }

      // 3. Process CNOT gates (if configured as entangled controls)
      // If g0 is CNOT (acting as a Control on Q0, target on Q1)
      if (g0 === "CNOT") {
        // Flip target Q1 if control Q0 is |1⟩
        // Swap state["10"] <-> state["11"]
        const temp10 = state["10"];
        state["10"] = state["11"];
        state["11"] = temp10;
      }
      // If g1 is CNOT (Control Q1, Target Q0)
      if (g1 === "CNOT") {
        // Swap state["01"] <-> state["11"]
        const temp01 = state["01"];
        state["01"] = state["11"];
        state["11"] = temp01;
      }
    }

    // Convert complex/real coefficient values to probabilities: P = |c|²
    setProbabilities({
      "00": Math.pow(state["00"], 2),
      "01": Math.pow(state["01"], 2),
      "10": Math.pow(state["10"], 2),
      "11": Math.pow(state["11"], 2)
    });
  };

  const handleSetGate = (qubit: 0 | 1, colIdx: number) => {
    // Toggle/Set selected gate
    let isRemoved = false;
    if (qubit === 0) {
      setGatesQ0((prev) => {
        const updated = [...prev];
        isRemoved = updated[colIdx] === selectedGate;
        updated[colIdx] = isRemoved ? "I" : selectedGate;
        return updated;
      });
    } else {
      setGatesQ1((prev) => {
        const updated = [...prev];
        isRemoved = updated[colIdx] === selectedGate;
        updated[colIdx] = isRemoved ? "I" : selectedGate;
        return updated;
      });
    }

    if (isRemoved) {
      audioService.playClick("tap");
    } else {
      audioService.playClick("pulse");
      audioService.playCalibration("sparkle");
    }
  };

  const runMeasurementTrials = () => {
    setIsRunning(true);
    setMeasurementTrials(null);
    audioService.playHyperdriveCharging();

    setTimeout(() => {
      // Simulate 1000 measurements based on current calculated probabilities
      const trials = { "00": 0, "01": 0, "10": 0, "11": 0 };
      const p00 = probabilities["00"];
      const p01 = probabilities["01"];
      const p10 = probabilities["10"];
      const p11 = probabilities["11"];

      for (let i = 0; i < 1000; i++) {
        const rand = Math.random();
        if (rand < p00) {
          trials["00"] += 1;
        } else if (rand < p00 + p01) {
          trials["01"] += 1;
        } else if (rand < p00 + p01 + p10) {
          trials["10"] += 1;
        } else {
          trials["11"] += 1;
        }
      }

      setMeasurementTrials(trials);
      setIsRunning(false);
      audioService.playCalibration("digital");
    }, 1200);
  };

  const clearCircuit = () => {
    setGatesQ0(["I", "I", "I", "I"]);
    setGatesQ1(["I", "I", "I", "I"]);
    setMeasurementTrials(null);
    audioService.playClick("confirm");
  };

  return (
    <div className="rounded-xl glass-panel border border-white/5 p-6 space-y-6 text-left animate-fade-in">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-display font-bold text-white flex items-center">
          <Cpu className="w-5 h-5 text-cyan-glow mr-2" /> Quantum Computing Circuit Sandbox
        </h2>
        <p className="text-xs text-slate-400">Assemble gates along the qubit timeline and observe immediate wave transformations and measurement collapses</p>
      </div>

      {/* Selector palette of gates */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950 p-4 rounded-lg border border-white/5">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Gate Selector</span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "H", label: "Hadamard (H)", desc: "Creates superposition" },
                { id: "X", label: "Pauli-X (NOT)", desc: "Flips qubit state" },
                { id: "Z", label: "Pauli-Z (Phase)", desc: "Flips wave phase" },
                { id: "CNOT", label: "CNOT (Control)", desc: "Entangles target" }
              ] as const
            ).map((gate) => (
              <button
                key={gate.id}
                onClick={() => {
                  setSelectedGate(gate.id);
                  audioService.playClick("tap");
                }}
                onMouseEnter={() => {
                  audioService.playHover("tick");
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${selectedGate === gate.id ? "bg-cyan-glow text-slate-950 font-bold border-cyan-glow shadow-[0_0_8px_#00f3ff]" : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"}`}
              >
                {gate.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 max-w-sm italic">
          {selectedGate === "H" && "Hadamard: Takes a solid state |0⟩ and splits its probability 50/50, creating active superposition."}
          {selectedGate === "X" && "Pauli-X: Acts as a standard logic NOT gate. Inverts the qubit state 0 to 1, or 1 to 0."}
          {selectedGate === "Z" && "Pauli-Z: Flips the phase of the excited wave component. Fundamental for wave interference algorithms."}
          {selectedGate === "CNOT" && "CNOT: Flips target qubit if control qubit is in state |1⟩. The primary tool to create entanglement."}
        </div>
      </div>

      {/* Grid: 1. Circuit timeline  2. State outcome bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Qubit Timeline Grid (Left Column) */}
        <div className="lg:col-span-2 bg-slate-950/40 border border-white/5 p-6 rounded-lg flex flex-col justify-center space-y-8 relative">
          <div className="absolute top-2 left-3 text-[9px] font-mono text-slate-500 uppercase">Qubit Wire Timeline</div>

          {/* Qubit 0 Row */}
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono font-bold text-cyan-glow shrink-0 w-12">Qubit |0⟩</span>
            <div className="flex-1 h-0.5 bg-slate-800 relative flex justify-around items-center">
              {gatesQ0.map((gate, col) => (
                <button
                  key={col}
                  onClick={() => handleSetGate(0, col)}
                  onMouseEnter={() => audioService.playHover("tick")}
                  className={`w-11 h-11 rounded border flex items-center justify-center font-mono font-bold text-sm transition-all z-10 ${gate === "I" ? "bg-slate-950 border-slate-800 text-slate-700 hover:border-cyan-glow/40 hover:text-cyan-glow" : "bg-gradient-to-tr from-cyan-950 to-cyan-900 border-cyan-glow text-cyan-glow shadow-[0_0_8px_rgba(0,243,255,0.15)]"}`}
                >
                  {gate === "I" ? "+" : gate}
                </button>
              ))}
            </div>
          </div>

          {/* Qubit 1 Row */}
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono font-bold text-violet-glow shrink-0 w-12">Qubit |0⟩</span>
            <div className="flex-1 h-0.5 bg-slate-800 relative flex justify-around items-center">
              {gatesQ1.map((gate, col) => (
                <button
                  key={col}
                  onClick={() => handleSetGate(1, col)}
                  onMouseEnter={() => audioService.playHover("tick")}
                  className={`w-11 h-11 rounded border flex items-center justify-center font-mono font-bold text-sm transition-all z-10 ${gate === "I" ? "bg-slate-950 border-slate-800 text-slate-700 hover:border-violet-glow/40 hover:text-violet-glow" : "bg-gradient-to-tr from-violet-950 to-violet-900 border-violet-glow text-violet-glow shadow-[0_0_8px_rgba(189,0,255,0.15)]"}`}
                >
                  {gate === "I" ? "+" : gate}
                </button>
              ))}
            </div>
          </div>

          {/* Circuit Actions */}
          <div className="flex space-x-3 pt-4 border-t border-white/5">
            <button
              onClick={runMeasurementTrials}
              disabled={isRunning}
              onMouseEnter={() => {
                if (!isRunning) audioService.playHover("tick");
              }}
              className="flex-1 py-2 rounded bg-gradient-to-r from-cyan-glow to-quantum-blue text-slate-950 hover:opacity-90 transition-all font-mono text-xs font-bold disabled:opacity-50"
            >
              {isRunning ? "RUNNING TRIAL BURSTS..." : "RUN CIRCUITS & COLLAPSE MEASUREMENTS"}
            </button>
            <button
              onClick={clearCircuit}
              onMouseEnter={() => audioService.playHover("tick")}
              className="px-3.5 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* State Probabilities Outcomes Bars (Right Column) */}
        <div className="bg-slate-950 border border-white/5 p-5 rounded-lg flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-4">State Probability Distributions</span>

            <div className="space-y-3">
              {(["00", "01", "10", "11"] as const).map((outcome) => {
                const prob = probabilities[outcome];
                return (
                  <div key={outcome} className="text-xs font-mono space-y-1 text-left">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Outcome |{outcome}⟩</span>
                      <span className="text-white font-semibold">{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-glow to-violet-glow h-full rounded transition-all duration-300"
                        style={{ width: `${prob * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Measurement Trials results histogram bar */}
          {measurementTrials && (
            <div className="border-t border-white/5 pt-4 mt-4 text-left">
              <span className="text-[9px] font-mono text-cyan-glow uppercase block mb-2">1,000 Trial Results (Counts)</span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono text-slate-400">
                {Object.entries(measurementTrials).map(([stateKey, count]) => (
                  <div key={stateKey} className="bg-slate-900/60 p-2 rounded border border-white/5">
                    <span className="block text-white font-bold">|{stateKey}⟩</span>
                    <span className="block text-xs font-bold text-cyan-glow mt-1">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
