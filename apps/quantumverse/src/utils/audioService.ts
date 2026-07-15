// procedural Web Audio API Synthesizer for QuantumVerse Premium Audio Identity
// Optimized with absolute precision to communicate intelligence, calm confidence, and premium scientific craft.

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private narrationGain: GainNode | null = null;
  
  private pannerNode: StereoPannerNode | null = null;
  public analyserNode: AnalyserNode | null = null;

  // Active oscillator collections to allow smooth stopping and volume fade-outs
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private ambientLFOs: OscillatorNode[] = [];
  
  private isAmbienceRunning = false;
  private soundEnabledState = false;

  // Volume parameters (Saved in localStorage)
  private masterVolumeValue = 0.8;
  private ambientVolumeValue = 0.5;
  private sfxVolumeValue = 0.6;
  private narrationVolumeValue = 0.7;
  private spatialAudioEnabled = true;

  // Active environment selection
  private activeEnvironmentState: "galaxy" | "blackhole" | "quantum" | "solarsystem" | "evolution" = "galaxy";
  private currentPanX = 0.0;
  private currentPanY = 0.0;

  constructor() {
    if (typeof window !== "undefined") {
      this.soundEnabledState = localStorage.getItem("quantum_sound_enabled") === "true";
      this.masterVolumeValue = parseFloat(localStorage.getItem("quantum_vol_master") ?? "0.80");
      this.ambientVolumeValue = parseFloat(localStorage.getItem("quantum_vol_ambient") ?? "0.45");
      this.sfxVolumeValue = parseFloat(localStorage.getItem("quantum_vol_sfx") ?? "0.60");
      this.narrationVolumeValue = parseFloat(localStorage.getItem("quantum_vol_narration") ?? "0.75");
      this.spatialAudioEnabled = localStorage.getItem("quantum_spatial_enabled") !== "false";
      
      const savedEnv = localStorage.getItem("quantum_active_env");
      if (savedEnv === "galaxy" || savedEnv === "blackhole" || savedEnv === "quantum" || savedEnv === "solarsystem" || savedEnv === "evolution") {
        this.activeEnvironmentState = savedEnv;
      }

      // Pre-load synthesis voices to bypass the asynchronous initialization delay bug
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
          };
        }
      }
    }
  }

  // Initializing or retrieving the single Web Audio Context and Node Graph
  private getContext(): AudioContext | null {
    if (!this.soundEnabledState) return null;
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();

        // 1. Setup Analyser Node for live 3D-inspired spectrum charts
        this.analyserNode = this.ctx.createAnalyser();
        this.analyserNode.fftSize = 256;
        this.analyserNode.smoothingTimeConstant = 0.85;

        // 2. Setup Gain Hierarchy to completely prevent clipping, distortion, and static
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolumeValue, this.ctx.currentTime);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(this.ambientVolumeValue, this.ctx.currentTime);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVolumeValue, this.ctx.currentTime);

        this.narrationGain = this.ctx.createGain();
        this.narrationGain.gain.setValueAtTime(this.narrationVolumeValue, this.ctx.currentTime);

        // 3. Stereo Spatial Panner Node for immersive 3D panning
        if (this.ctx.createStereoPanner) {
          this.pannerNode = this.ctx.createStereoPanner();
          this.pannerNode.pan.setValueAtTime(this.currentPanX, this.ctx.currentTime);
          
          // Route: ambient -> panner -> master -> analyser -> destination
          this.ambientGain.connect(this.pannerNode);
          this.pannerNode.connect(this.masterGain);
        } else {
          this.ambientGain.connect(this.masterGain);
        }

        // Connect SFX and Narration directly to Master Gain
        this.sfxGain.connect(this.masterGain);
        this.narrationGain.connect(this.masterGain);

        // Connect Master to Analyser, then Analyser to Speakers
        this.masterGain.connect(this.analyserNode);
        this.analyserNode.connect(this.ctx.destination);

      } catch (e) {
        console.warn("Failed to build Web Audio API nodes:", e);
        return null;
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabledState;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabledState = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("quantum_sound_enabled", enabled ? "true" : "false");
    }

    if (enabled) {
      this.getContext();
      this.startAmbience(this.activeEnvironmentState);
    } else {
      this.stopAmbience();
      if (this.ctx) {
        this.ctx.close().catch(() => {});
        this.ctx = null;
        this.analyserNode = null;
        this.masterGain = null;
        this.ambientGain = null;
        this.sfxGain = null;
        this.narrationGain = null;
        this.pannerNode = null;
      }
    }
  }

  // --- GETTERS & SETTERS FOR VOLUME AND ADVANCED SLIDERS ---
  public getMasterVolume(): number { return this.masterVolumeValue; }
  public setMasterVolume(val: number) {
    this.masterVolumeValue = Math.max(0, Math.min(1, val));
    if (typeof window !== "undefined") localStorage.setItem("quantum_vol_master", this.masterVolumeValue.toString());
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolumeValue, this.ctx.currentTime, 0.05);
    }
  }

  public getAmbientVolume(): number { return this.ambientVolumeValue; }
  public setAmbientVolume(val: number) {
    this.ambientVolumeValue = Math.max(0, Math.min(1, val));
    if (typeof window !== "undefined") localStorage.setItem("quantum_vol_ambient", this.ambientVolumeValue.toString());
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.ambientVolumeValue, this.ctx.currentTime, 0.05);
    }
  }

  public getSFXVolume(): number { return this.sfxVolumeValue; }
  public setSFXVolume(val: number) {
    this.sfxVolumeValue = Math.max(0, Math.min(1, val));
    if (typeof window !== "undefined") localStorage.setItem("quantum_vol_sfx", this.sfxVolumeValue.toString());
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVolumeValue, this.ctx.currentTime, 0.05);
    }
  }

  public getNarrationVolume(): number { return this.narrationVolumeValue; }
  public setNarrationVolume(val: number) {
    this.narrationVolumeValue = Math.max(0, Math.min(1, val));
    if (typeof window !== "undefined") localStorage.setItem("quantum_vol_narration", this.narrationVolumeValue.toString());
    if (this.narrationGain && this.ctx) {
      this.narrationGain.gain.setTargetAtTime(this.narrationVolumeValue, this.ctx.currentTime, 0.05);
    }
  }

  public isSpatialEnabled(): boolean { return this.spatialAudioEnabled; }
  public setSpatialEnabled(enabled: boolean) {
    this.spatialAudioEnabled = enabled;
    if (typeof window !== "undefined") localStorage.setItem("quantum_spatial_enabled", enabled ? "true" : "false");
    this.updateSpatialPanning(this.currentPanX, this.currentPanY);
  }

  public getActiveEnvironment(): string { return this.activeEnvironmentState; }
  public setEnvironment(env: "galaxy" | "blackhole" | "quantum" | "solarsystem" | "evolution") {
    this.activeEnvironmentState = env;
    if (typeof window !== "undefined") localStorage.setItem("quantum_active_env", env);
    if (this.isAmbienceRunning) {
      this.startAmbience(env);
    }
  }

  // Implements directional sound panning & distance attenuation simulation
  public updateSpatialPanning(x: number, y: number) {
    this.currentPanX = Math.max(-1.0, Math.min(1.0, x));
    this.currentPanY = Math.max(-1.0, Math.min(1.0, y));

    const ctx = this.getContext();
    if (!ctx) return;

    // Apply stereo panner value based on x coordinate if spatial audio is enabled
    if (this.pannerNode) {
      const targetPan = this.spatialAudioEnabled ? this.currentPanX : 0.0;
      this.pannerNode.pan.setTargetAtTime(targetPan, ctx.currentTime, 0.1);
    }

    // Apply distance attenuation on ambient soundscapes if y goes outwards (e.g. simulating distance)
    if (this.ambientGain) {
      const distance = Math.sqrt(this.currentPanX * this.currentPanX + this.currentPanY * this.currentPanY);
      // More distant sounds are attenuated (quieter) and filtered slightly lower (occlusion)
      const attenuation = Math.max(0.15, 1.0 - distance * 0.45);
      const targetGain = this.ambientVolumeValue * attenuation;
      this.ambientGain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.15);
    }
  }

  // --- 1. AMBIENT BACKGROUND HUMS & SOUNDSCAPES ---
  public startAmbience(module: string = "galaxy") {
    if (!this.soundEnabledState) return;

    const ctx = this.getContext();
    if (!ctx) return;

    // Gently fade out and clean existing oscillators to prevent overlapping stacking bugs
    this.stopAmbience();

    this.isAmbienceRunning = true;
    const now = ctx.currentTime;

    // Map module routing names to our premium environment soundscapes
    let env: "galaxy" | "blackhole" | "quantum" | "solarsystem" | "evolution" = this.activeEnvironmentState;
    if (module === "hub") env = "quantum";
    else if (module === "sims" || module === "playground") env = "evolution";
    else if (module === "mentor") env = "solarsystem";
    else if (module === "trust") env = "galaxy";
    else if (module === "dashboard") env = "galaxy";
    else if (module === "blackhole" || module === "evolution" || module === "solarsystem" || module === "quantum" || module === "galaxy") {
      env = module;
    }

    this.activeEnvironmentState = env;

    try {
      this.activeOscillators = [];
      this.ambientLFOs = [];

      // Base lowpass filter node to keep the entire ambient spectrum safe and elegant
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.setValueAtTime(1.5, now);

      switch (env) {
        case "galaxy": {
          // --- GALAXY LABORATORY: Deep cosmic background pads, slow harmonic pulses, stellar resonance ---
          filter.frequency.setValueAtTime(110, now);

          // Deep drone at 55Hz (A1) and 110Hz (A2)
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = "sine";
          osc1.frequency.setValueAtTime(55, now);
          gain1.gain.setValueAtTime(0.04, now);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(110, now);
          gain2.gain.setValueAtTime(0.015, now);

          // Ethereal pad layer at 220Hz (A3) modulated by a slow LFO for breathing effect
          const padOsc = ctx.createOscillator();
          const padGain = ctx.createGain();
          padOsc.type = "triangle";
          padOsc.frequency.setValueAtTime(220, now);
          padGain.gain.setValueAtTime(0.005, now);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.type = "sine";
          lfo.frequency.setValueAtTime(0.06, now); // Very slow 16-second cycle
          lfoGain.gain.setValueAtTime(0.004, now);

          lfo.connect(lfoGain);
          lfoGain.connect(padGain.gain);

          // Connect all to lowpass filter
          osc1.connect(gain1);
          osc2.connect(gain2);
          padOsc.connect(padGain);

          gain1.connect(filter);
          gain2.connect(filter);
          padGain.connect(filter);

          // Start oscillators
          osc1.start(now);
          osc2.start(now);
          padOsc.start(now);
          lfo.start(now);

          this.activeOscillators.push({ osc: osc1, gain: gain1 });
          this.activeOscillators.push({ osc: osc2, gain: gain2 });
          this.activeOscillators.push({ osc: padOsc, gain: padGain });
          this.ambientLFOs.push(lfo);
          break;
        }

        case "blackhole": {
          // --- BLACK HOLE: Gravitational sub-bass resonance, slow warping filter sweeps ---
          filter.frequency.setValueAtTime(70, now);

          // Sub-bass warping hum at 41.2Hz (E1)
          const subOsc = ctx.createOscillator();
          const subGain = ctx.createGain();
          subOsc.type = "sine";
          subOsc.frequency.setValueAtTime(41.2, now);
          subGain.gain.setValueAtTime(0.06, now);

          // Secondary dark texture at 82.4Hz (E2)
          const sub2 = ctx.createOscillator();
          const sub2Gain = ctx.createGain();
          sub2.type = "triangle";
          sub2.frequency.setValueAtTime(82.4, now);
          sub2Gain.gain.setValueAtTime(0.015, now);

          // Slow LFO to sweep the lowpass filter cutoff freq representing gravitational shear
          const filterLFO = ctx.createOscillator();
          const filterLFOGain = ctx.createGain();
          filterLFO.type = "sine";
          filterLFO.frequency.setValueAtTime(0.08, now); // 12-second cycle
          filterLFOGain.gain.setValueAtTime(25, now); // Sweep filter frequency by +/- 25Hz

          filterLFO.connect(filterLFOGain);
          filterLFOGain.connect(filter.frequency);

          subOsc.connect(subGain);
          sub2.connect(sub2Gain);
          
          subGain.connect(filter);
          sub2Gain.connect(filter);

          subOsc.start(now);
          sub2.start(now);
          filterLFO.start(now);

          this.activeOscillators.push({ osc: subOsc, gain: subGain });
          this.activeOscillators.push({ osc: sub2, gain: sub2Gain });
          this.ambientLFOs.push(filterLFO);
          break;
        }

        case "quantum": {
          // --- QUANTUM LABORATORY: Crystalline micro-tonal sine-waves, delicate pulses, superposition shimmer ---
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(800, now);
          filter.Q.setValueAtTime(1.0, now);

          // High glass frequencies beating against each other to create natural quantum interference patterns
          const qOsc1 = ctx.createOscillator();
          const qGain1 = ctx.createGain();
          qOsc1.type = "sine";
          qOsc1.frequency.setValueAtTime(523.25, now); // C5
          qGain1.gain.setValueAtTime(0.012, now);

          const qOsc2 = ctx.createOscillator();
          const qGain2 = ctx.createGain();
          qOsc2.type = "sine";
          qOsc2.frequency.setValueAtTime(524.50, now); // Subtle 1.25Hz binaural interference wave
          qGain2.gain.setValueAtTime(0.012, now);

          // Tiny sparkling crystal generator
          const chimeOsc = ctx.createOscillator();
          const chimeGain = ctx.createGain();
          chimeOsc.type = "sine";
          chimeOsc.frequency.setValueAtTime(1046.50, now); // C6
          chimeGain.gain.setValueAtTime(0.002, now);

          const pulseLFO = ctx.createOscillator();
          const pulseGain = ctx.createGain();
          pulseLFO.type = "sine";
          pulseLFO.frequency.setValueAtTime(0.2, now); // 5-second pulse
          pulseGain.gain.setValueAtTime(0.002, now);

          pulseLFO.connect(pulseGain);
          pulseGain.connect(chimeGain.gain);

          qOsc1.connect(qGain1);
          qOsc2.connect(qGain2);
          chimeOsc.connect(chimeGain);

          qGain1.connect(filter);
          qGain2.connect(filter);
          chimeGain.connect(filter);

          qOsc1.start(now);
          qOsc2.start(now);
          chimeOsc.start(now);
          pulseLFO.start(now);

          this.activeOscillators.push({ osc: qOsc1, gain: qGain1 });
          this.activeOscillators.push({ osc: qOsc2, gain: qGain2 });
          this.activeOscillators.push({ osc: chimeOsc, gain: chimeGain });
          this.ambientLFOs.push(pulseLFO);
          break;
        }

        case "solarsystem": {
          // --- SOLAR SYSTEM: Warm electromagnetic hums, dynamic spatial panning sweeps, planet orbits ---
          filter.frequency.setValueAtTime(150, now);

          // Warm harmonic major chord at 146.83Hz (D3) and 220Hz (A3)
          const sunOsc = ctx.createOscillator();
          const sunGain = ctx.createGain();
          sunOsc.type = "sine";
          sunOsc.frequency.setValueAtTime(146.83, now);
          sunGain.gain.setValueAtTime(0.035, now);

          const orbitOsc = ctx.createOscillator();
          const orbitGain = ctx.createGain();
          orbitOsc.type = "triangle";
          orbitOsc.frequency.setValueAtTime(220, now);
          orbitGain.gain.setValueAtTime(0.012, now);

          // Modulator LFO that sweeps the panning back and forth automatically to represent solar orbits
          const panningLFO = ctx.createOscillator();
          const panningGainNode = ctx.createGain();
          panningLFO.type = "sine";
          panningLFO.frequency.setValueAtTime(0.05, now); // 20-second orbital period
          panningGainNode.gain.setValueAtTime(0.65, now); // Range of pan modulation

          if (this.pannerNode) {
            panningLFO.connect(panningGainNode);
            panningGainNode.connect(this.pannerNode.pan);
          }

          sunOsc.connect(sunGain);
          orbitOsc.connect(orbitGain);

          sunGain.connect(filter);
          orbitGain.connect(filter);

          sunOsc.start(now);
          orbitOsc.start(now);
          panningLFO.start(now);

          this.activeOscillators.push({ osc: sunOsc, gain: sunGain });
          this.activeOscillators.push({ osc: orbitOsc, gain: orbitGain });
          this.ambientLFOs.push(panningLFO);
          break;
        }

        case "evolution": {
          // --- COSMIC EVOLUTION ENGINE: Slow expanding orchestral pads, building layers, nebula sweep ---
          filter.frequency.setValueAtTime(180, now);

          const pad1 = ctx.createOscillator();
          const padGain1 = ctx.createGain();
          pad1.type = "sine";
          pad1.frequency.setValueAtTime(65.41, now); // C2
          padGain1.gain.setValueAtTime(0.04, now);

          const pad2 = ctx.createOscillator();
          const padGain2 = ctx.createGain();
          pad2.type = "triangle";
          pad2.frequency.setValueAtTime(130.81, now); // C3
          padGain2.gain.setValueAtTime(0.015, now);

          const pad3 = ctx.createOscillator();
          const padGain3 = ctx.createGain();
          pad3.type = "sine";
          pad3.frequency.setValueAtTime(196.00, now); // G3
          padGain3.gain.setValueAtTime(0.01, now);

          // Expanding filter sweep LFO
          const evoLFO = ctx.createOscillator();
          const evoGain = ctx.createGain();
          evoLFO.type = "sine";
          evoLFO.frequency.setValueAtTime(0.04, now); // 25-second expanding cycle
          evoGain.gain.setValueAtTime(80, now); // Sweep filter up and down by 80Hz

          evoLFO.connect(evoGain);
          evoGain.connect(filter.frequency);

          pad1.connect(padGain1);
          pad2.connect(padGain2);
          pad3.connect(padGain3);

          padGain1.connect(filter);
          padGain2.connect(filter);
          padGain3.connect(filter);

          pad1.start(now);
          pad2.start(now);
          pad3.start(now);
          evoLFO.start(now);

          this.activeOscillators.push({ osc: pad1, gain: padGain1 });
          this.activeOscillators.push({ osc: pad2, gain: padGain2 });
          this.activeOscillators.push({ osc: pad3, gain: padGain3 });
          this.ambientLFOs.push(evoLFO);
          break;
        }
      }

      // Connect overall lowpass filter to ambient gain
      if (this.ambientGain) {
        filter.connect(this.ambientGain);
      }

      // Trigger occasional random ambient sparkles to keep the environments alive
      this.scheduleRandomSparkles();

    } catch (e) {
      console.warn("Failed to start procedural ambient soundscape:", e);
    }
  }

  public updateAmbienceForModule(module: string) {
    if (!this.soundEnabledState) return;
    this.startAmbience(module);
  }

  public stopAmbience() {
    this.isAmbienceRunning = false;
    
    // Stop and clear all LFO nodes
    this.ambientLFOs.forEach((lfo) => {
      try {
        lfo.stop();
      } catch (e) {}
    });
    this.ambientLFOs = [];

    // Stop and fade out all active oscillator nodes
    this.activeOscillators.forEach(({ osc, gain }) => {
      try {
        if (this.ctx) {
          // Prevent popping by gently ramping gain to zero in 80ms
          gain.gain.cancelScheduledValues(this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
          osc.stop(this.ctx.currentTime + 0.09);
        } else {
          osc.stop();
        }
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  // Periodic random sparkles representing high-frequency quantum decay events
  private scheduleRandomSparkles() {
    if (!this.isAmbienceRunning || !this.soundEnabledState) return;

    const delay = 6000 + Math.random() * 10000; // Random delay between events (6s - 16s)
    setTimeout(() => {
      if (this.isAmbienceRunning && this.soundEnabledState) {
        this.playHover("sparkle", 0.08); // Quiet, non-intrusive sparkle chime
        this.scheduleRandomSparkles();
      }
    }, delay);
  }

  // --- 2. MICRO MOUSE HOVER EFFECTS (routed through SFX node) ---
  public playHover(type: "sparkle" | "tick" | "shimmer" = "tick", volumeScale = 1.0) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      if (type === "tick") {
        // Soft glass tick representing scientific target acquisition
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1750, now);
        
        gain.gain.setValueAtTime(0.008 * volumeScale, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.025);
      } 
      else if (type === "sparkle") {
        // Shimmering photon decay sparkle
        const count = 3;
        for (let i = 0; i < count; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          const sparkleFreq = 2800 + Math.random() * 1200;
          osc.frequency.setValueAtTime(sparkleFreq, now + i * 0.035);

          gain.gain.setValueAtTime(0.005 * volumeScale, now + i * 0.035);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.05);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now + i * 0.035);
          osc.stop(now + i * 0.035 + 0.06);
        }
      } 
      else if (type === "shimmer") {
        // Airy sweep shimmer
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.14);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(6, now);

        gain.gain.setValueAtTime(0.006 * volumeScale, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (e) {}
  }

  // --- 3. CLINICAL INTERACTIVE CLICKS (routed through SFX node) ---
  public playClick(type: "tap" | "pulse" | "confirm" = "tap") {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      if (type === "tap") {
        // Precision glass confirmation click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1350, now);
        
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.07);
      } 
      else if (type === "pulse") {
        // Physical haptic energy pulse
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.1);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(750, now);

        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.13);
      } 
      else if (type === "confirm") {
        // Dual-tone harmonic confirmation
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.04); // E5

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(783.99, now); // G5
        osc2.frequency.setValueAtTime(1046.50, now + 0.04); // C6

        gain.gain.setValueAtTime(0.022, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        osc1.start(now);
        osc2.start(now);

        osc1.stop(now + 0.18);
        osc2.stop(now + 0.18);
      }
    } catch (e) {}
  }

  // Pressed states (subtle mechanical-light haptics)
  public playPressed(type: "low" | "haptic" = "haptic") {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const freq = type === "low" ? 72 : 92;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // --- 4. SIGNATURE SUBSYSTEM CALIBRATION CONFIRMATIONS (routed through SFX node) ---
  public playCalibration(system: string) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      switch (system.toLowerCase()) {
        case "engine":
        case "quantum engine": {
          // Deep heavy electronic warp pulse
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.45);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        }

        case "simulator":
        case "particle simulator": {
          // Sparkling particle cloud reconstruction sounds
          const times = [0, 0.07, 0.14, 0.21];
          const freqs = [1700, 2300, 2000, 2750];
          times.forEach((t, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freqs[i], now + t);
            gain.gain.setValueAtTime(0.016, now + t);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.07);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + t);
            osc.stop(now + t + 0.08);
          });
          break;
        }

        case "wave":
        case "wave function engine": {
          // Smooth sweeping bandpass lowpass filters (wave reconstruction)
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(175, now);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(100, now);
          filter.frequency.exponentialRampToValueAtTime(1500, now + 0.38);
          filter.Q.setValueAtTime(3.5, now);

          gain.gain.setValueAtTime(0.022, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now);
          osc.stop(now + 0.44);
          break;
        }

        case "database":
        case "scientific database": {
          // Simulated high-speed register sweep clicks
          const ticks = 4;
          for (let i = 0; i < ticks; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(2150 - (i * 180), now + i * 0.045);
            gain.gain.setValueAtTime(0.009, now + i * 0.045);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.045 + 0.025);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + i * 0.045);
            osc.stop(now + i * 0.045 + 0.035);
          }
          break;
        }

        case "mentor":
        case "ai mentor": {
          // Elegant synth resonance confirmation
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(329.63, now); // E4
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(493.88, now); // B4

          gain.gain.setValueAtTime(0.032, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.sfxGain);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.48);
          osc2.stop(now + 0.48);
          break;
        }

        default: {
          this.playClick("confirm");
        }
      }
    } catch (e) {}
  }

  // --- 5. OPENING A NAVIGATION MODULE (routed through SFX node) ---
  public playModuleOpen(moduleId: string) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      switch (moduleId) {
        case "hub": {
          // Learning Hub page unfold
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(340, now);
          osc.frequency.exponentialRampToValueAtTime(240, now + 0.28);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(580, now);
          filter.frequency.linearRampToValueAtTime(180, now + 0.28);

          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now);
          osc.stop(now + 0.34);
          break;
        }

        case "sims": {
          // Virtual Lab energy sweep
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc1.type = "triangle";
          osc1.frequency.setValueAtTime(175, now);
          osc1.frequency.exponentialRampToValueAtTime(310, now + 0.4);

          osc2.type = "sine";
          osc2.frequency.setValueAtTime(85, now);
          osc2.frequency.exponentialRampToValueAtTime(155, now + 0.4);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(300, now);
          filter.frequency.exponentialRampToValueAtTime(1350, now + 0.38);

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(this.sfxGain);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.46);
          osc2.stop(now + 0.46);
          break;
        }

        case "timeline": {
          // Timeline time ripples
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(435, now);
          
          const fm = ctx.createOscillator();
          const fmGain = ctx.createGain();
          fm.frequency.setValueAtTime(17, now);
          fmGain.gain.setValueAtTime(32, now);

          fm.connect(fmGain);
          fmGain.connect(osc.frequency);

          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          fm.start(now);
          osc.start(now);

          fm.stop(now + 0.38);
          osc.stop(now + 0.42);
          break;
        }

        case "mentor": {
          // AI Mentor orb pulse
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(258, now); // ~C4
          osc.frequency.exponentialRampToValueAtTime(388, now + 0.32); // ~G4

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now);
          osc.stop(now + 0.38);
          break;
        }

        default: {
          // Default beautiful light transit sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(580, now);
          gain.gain.setValueAtTime(0.024, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.26);
        }
      }
    } catch (e) {}
  }

  // --- 6. DASHBOARD ARRIVAL ---
  public playDashboardArrival() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1040, now); // ~C6
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.82);

      setTimeout(() => {
        this.playHover("sparkle", 0.75);
      }, 90);

      setTimeout(() => {
        this.startAmbience(this.activeEnvironmentState);
      }, 450);
    } catch (e) {}
  }

  // --- 7. NOTIFICATION SOUND TONES (routed through SFX node) ---
  public playNotification(type: "success" | "info" | "warning" | "error" | "completed") {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      switch (type) {
        case "success": {
          const notes = [523.25, 659.25, 783.99, 1046.50];
          notes.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(f, now + i * 0.045);
            gain.gain.setValueAtTime(0.02, now + i * 0.045);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.045 + 0.4);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + i * 0.045);
            osc.stop(now + i * 0.045 + 0.45);
          });
          break;
        }

        case "info": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(860, now);
          gain.gain.setValueAtTime(0.025, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.26);
          break;
        }

        case "warning": {
          for (let i = 0; i < 2; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(175, now + i * 0.16);
            gain.gain.setValueAtTime(0.035, now + i * 0.16);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.16 + 0.12);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + i * 0.16);
            osc.stop(now + i * 0.16 + 0.14);
          }
          break;
        }

        case "error": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.linearRampToValueAtTime(215, now + 0.28);

          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        case "completed": {
          const notes = [523.25, 659.25, 783.99];
          notes.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(f, now + i * 0.07);
            gain.gain.setValueAtTime(0.02, now + i * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.28);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.32);
          });
          break;
        }
      }
    } catch (e) {}
  }

  // --- 8. THE COGNITIVE STARTUP TONE (AI CORE BOOT) ---
  public playAICoreBoot() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      const frequencies = [329.63, 415.30, 493.88, 659.25, 830.61]; // E4, G#4, B4, E5, G#5
      frequencies.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.055);

        gain.gain.setValueAtTime(0.02, now + idx * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + 0.55);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.055);
        osc.stop(now + idx * 0.055 + 0.65);
      });

      const pad = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const padGain = ctx.createGain();

      pad.type = "triangle";
      pad.frequency.setValueAtTime(164.81, now); // E3

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(900, now + 0.75);

      padGain.gain.setValueAtTime(0.03, now);
      padGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      pad.connect(filter);
      filter.connect(padGain);
      padGain.connect(this.sfxGain);

      pad.start(now);
      pad.stop(now + 1.25);
    } catch (e) {}
  }

  // --- 9. HYPERDRIVE CHARGING & QUANTUM JUMP FINALE ---
  public playHyperdriveCharging() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 1.7);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 1.4);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 1.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.7);

      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();

      sub.type = "sine";
      sub.frequency.setValueAtTime(45, now);
      sub.frequency.linearRampToValueAtTime(90, now + 1.4);

      subGain.gain.setValueAtTime(0.06, now);
      subGain.gain.linearRampToValueAtTime(0.0001, now + 1.7);

      sub.connect(subGain);
      subGain.connect(this.sfxGain);

      sub.start(now);
      sub.stop(now + 1.7);
    } catch (e) {}
  }

  public playQuantumJump() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    try {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(40, now);
      osc.frequency.exponentialRampToValueAtTime(2000, now + 1.15);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 0.95);
      filter.Q.setValueAtTime(1.5, now);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.25);

      const doppler = ctx.createOscillator();
      const dGain = ctx.createGain();

      doppler.type = "sine";
      doppler.frequency.setValueAtTime(1200, now);
      doppler.frequency.exponentialRampToValueAtTime(300, now + 0.55);

      dGain.gain.setValueAtTime(0.02, now);
      dGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      doppler.connect(dGain);
      dGain.connect(this.sfxGain);

      doppler.start(now);
      doppler.stop(now + 0.65);
    } catch (e) {}
  }

  // --- 10. AI ASSISTANT NARRATION / TEXT-TO-SPEECH (processed nicely) ---
  public speak(text: string) {
    if (!this.soundEnabledState || typeof window === "undefined" || !window.speechSynthesis) return;

    try {
      // Force cancel and resume to clear any blocked state in Chrome/Safari Speech engine
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Let's bind user-configured narration volume
      utterance.volume = this.narrationVolumeValue * this.masterVolumeValue;
      
      // Give the voice a premium futuristic space explorer style (slightly slower and deeper pitch)
      utterance.rate = 1.02;
      utterance.pitch = 0.95;

      // Select an elegant English voice if available
      const voices = window.speechSynthesis.getVoices();
      const spaceVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google")) || 
                         voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Google"))) ||
                         voices.find(v => v.lang.startsWith("en")) || 
                         voices[0];
      
      if (spaceVoice) {
        utterance.voice = spaceVoice;
      }

      utterance.onerror = (e) => {
        console.warn("SpeechSynthesisUtterance error:", e);
        // Force-resume in case it gets stuck
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech Synthesis blocked or failed:", err);
    }
  }

  public cancelSpeech() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioService = new AudioService();
