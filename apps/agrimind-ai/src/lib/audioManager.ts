// Procedural "Nature + AI" Sound Identity Synthesizer using Web Audio API
// No external assets required. 100% synthesized locally, low-latency, and safe.

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;

  // Background Ambience Nodes
  private windSource: AudioBufferSourceNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windLfo: OscillatorNode | null = null;
  private padOscs: OscillatorNode[] = [];
  private padGain: GainNode | null = null;
  
  // Timers and State trackers
  private ambienceActive = false;
  private calibrationActive = false;
  private ambientInterval: number | null = null;
  private aiPulseInterval: number | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    // Lazy initialized on first user interaction to satisfy browser policies
  }

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create static white noise buffer
      const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } catch (e) {
      console.warn("Web Audio API not supported on this browser:", e);
    }
  }

  public async resume() {
    this.initContext();
    if (this.ctx && this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  // Helper: Create exponential envelope
  private createEnv(gainNode: GainNode, start: number, end: number, attack: number, decay: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(start, now);
    gainNode.gain.linearRampToValueAtTime(end, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  }

  // --- INTERACTIVE / TRIGGERED SOUNDS ---

  // Hover Effect: Soft glass-like click / bamboo tap
  public playHover() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    // Bamboo/Glass frequency
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(8, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Click Effect: Crystal chime
  public playClick() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    // Build a crystal tone (2 resonant sines)
    const now = this.ctx.currentTime;
    [880, 1318.5].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      
      const vol = idx === 0 ? 0.08 : 0.04;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(now + 0.5);
    });
  }

  // Sound Notification - Glass Tap, Leaf Shimmer, Crystal tone
  public playNotification(type: "glass" | "bamboo" | "crystal" | "leaf") {
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    if (type === "glass") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(now + 0.25);
    } else if (type === "bamboo") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(now + 0.15);
    } else if (type === "crystal") {
      [1046.5, 1318.5, 1568].forEach((f, i) => { // C6 major triad
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(f, now + i * 0.03);
        gain.gain.setValueAtTime(0.06, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.03);
        osc.stop(now + 0.8);
      });
    } else if (type === "leaf") {
      // Shimmering white noise bursts
      for (let i = 0; i < 5; i++) {
        const source = this.ctx.createBufferSource();
        source.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(6000 + Math.random() * 2000, now + i * 0.04);
        filter.Q.setValueAtTime(15, now + i * 0.04);

        gain.gain.setValueAtTime(0.015, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.12);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        source.start(now + i * 0.04);
        source.stop(now + i * 0.04 + 0.15);
      }
    }
  }

  // --- PROCEDURAL NATURE GENERATORS ---

  // Soil/Roots Creep crackle
  private playSoilCreep() {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800 + Math.random() * 400, now);
    filter.Q.setValueAtTime(12, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start(now);
    source.stop(now + 0.1);
  }

  // Water Droplet (plop)
  private playWaterDrip() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    const startFreq = 1600 + Math.random() * 400;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.06);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Procedural Bird Chirp
  private playBirdChirp() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const baseFreq = 2800 + Math.random() * 500;
    const chirpCount = 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < chirpCount; i++) {
      const chirpTime = now + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, chirpTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 800, chirpTime + 0.04);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 400, chirpTime + 0.08);

      gain.gain.setValueAtTime(0.008, chirpTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(chirpTime);
      osc.stop(chirpTime + 0.12);
    }
  }

  // Heartbeat/AI bass pulse
  public playHeartbeat() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    
    // Double pulse: badum
    [0, 0.22].forEach((delay) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(55, now + delay); // A1 low frequency
      osc.frequency.exponentialRampToValueAtTime(20, now + delay + 0.15);

      const vol = delay === 0 ? 0.25 : 0.18;
      gain.gain.setValueAtTime(vol, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 0.25);
    });
  }

  // Beautiful synthetic piano note/chord for bloom
  private playBloomPianoChord() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // C6 Major-9th rich chord fundamental notes
    const freqs = [130.81, 164.81, 196.00, 246.94, 293.66, 392.00, 523.25]; // C3, E3, G3, B3, D4, G4, C5
    
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Mix sine & triangle for a warm, hollow string pluck feel
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(freq * 1.005, now + idx * 0.04);

      // Slower attack for the strings/orchestral swell
      gain.gain.setValueAtTime(0.001, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.06 / freqs.length, now + idx * 0.04 + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 3.0); // rich long decay

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.04);
      subOsc.start(now + idx * 0.04);
      
      osc.stop(now + 3.5);
      subOsc.stop(now + 3.5);
    });

    // Glass/Crystal sparkle shimmer accompanying bloom
    for (let i = 0; i < 12; i++) {
      const sparkleTime = now + 0.3 + i * 0.15;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2000 + Math.random() * 1500, sparkleTime);
      gain.gain.setValueAtTime(0.008, sparkleTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, sparkleTime + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(sparkleTime);
      osc.stop(sparkleTime + 0.45);
    }
  }

  // Beautiful, futuristic Vision Pro/Tesla style AI confirmation chime
  private playAiActivationChime() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // Chime notes: C5 -> E5 -> G5 -> C6 beautiful upward arpeggios
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const delay = idx * 0.08;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);

      filter.type = "highpass";
      filter.frequency.setValueAtTime(300, now);

      gain.gain.setValueAtTime(0.04, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 1.0);
    });
  }

  // TTS AI Calm Voice assistant greeting
  private playAiVoice() {
    if (!window.speechSynthesis) return;
    
    // Stop any existing speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      "Good morning, Sam. Weather conditions are favorable. Two irrigation recommendations are available."
    );

    // Attempt to locate a high-quality calm natural voice
    const voices = window.speechSynthesis.getVoices();
    // Search for beautiful voices (e.g. Google US English, Apple Samantha/Daniel, Microsoft Aria)
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes("Google US English") ||
        v.name.includes("Natural") ||
        v.name.includes("Samantha") ||
        v.name.includes("Siri")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.volume = 0.5;
    utterance.rate = 0.88; // elegant, slower cadence
    utterance.pitch = 1.05; // soft and gentle tone

    window.speechSynthesis.speak(utterance);
  }

  // --- CALIBRATION TIMELINE TRIGGERS ---

  private calibrationStage: number = 0;

  public triggerStageAudio(stage: 1 | 2 | 3 | 4 | 5) {
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    if (stage === 1) {
      // Stage 1 - System Boot (0-2s)
      // Soft ambient low-frequency hum & digital startup
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2 low hum
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.0);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 2.1);

      // Micro digital pulses
      for (let i = 0; i < 4; i++) {
        const pulseTime = this.ctx.currentTime + i * 0.4;
        const pOsc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();
        pOsc.frequency.setValueAtTime(440 + i * 110, pulseTime);
        pGain.gain.setValueAtTime(0.02, pulseTime);
        pGain.gain.exponentialRampToValueAtTime(0.0001, pulseTime + 0.08);
        pOsc.connect(pGain);
        pGain.connect(this.masterGain);
        pOsc.start(pulseTime);
        pOsc.stop(pulseTime + 0.1);
      }
    } 
    else if (stage === 2) {
      // Stage 2 - Calibration (2-5s)
      // Play soil particles and roots growing procedurally
      this.playSoilCreep();
      this.playWaterDrip();
      
      // Start rapid subtle digital clicks
      const clickInterval = setInterval(() => {
        if (!this.ctx || !this.masterGain) {
          clearInterval(clickInterval);
          return;
        }
        if (Math.random() > 0.4) {
          this.playSoilCreep();
        }
        if (Math.random() > 0.7) {
          this.playWaterDrip();
        }
      }, 350);

      setTimeout(() => clearInterval(clickInterval), 3000);
    } 
    else if (stage === 3) {
      // Stage 3 - Growth (5-8s)
      // Heart-like pulse, strings, birds, glowing synth arpeggios
      this.playHeartbeat();
      this.playBirdChirp();

      const growthInterval = setInterval(() => {
        if (!this.ctx || !this.masterGain) {
          clearInterval(growthInterval);
          return;
        }
        if (Math.random() > 0.6) {
          this.playBirdChirp();
        }
        this.playWaterDrip();
      }, 500);

      setTimeout(() => clearInterval(growthInterval), 3000);
    } 
    else if (stage === 4) {
      // Stage 4 - Bloom (8-10s)
      this.playBloomPianoChord();
    } 
    else if (stage === 5) {
      // Stage 5 - AI Online (Transition complete)
      this.playAiActivationChime();
      setTimeout(() => {
        this.playAiVoice();
      }, 600);
    }
  }

  // --- DASHBOARD BACKGROUND AMBIENCE ---

  public startDashboardAmbience() {
    this.resume();
    if (this.ambienceActive) return;
    this.ambienceActive = true;

    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    // Create background ambience gain
    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    // Smoothly fade in background ambience over 5 seconds
    this.ambienceGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 5.0);
    this.ambienceGain.connect(this.masterGain);

    // A. Synth Pad (extremely subtle, low-frequency atmospheric wash)
    const baseFreqs = [110, 165, 220, 330]; // A2, E3, A3, E4 warm fifths
    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.ambienceGain) return;
      const osc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq + Math.sin(idx) * 0.5, this.ctx.currentTime);

      // Slowly modulate volume for moving pad feel
      pGain.gain.setValueAtTime(0.12 / baseFreqs.length, this.ctx.currentTime);
      
      osc.connect(pGain);
      pGain.connect(this.ambienceGain);
      osc.start();

      this.padOscs.push(osc);
    });

    // B. Wind Noise (passed through custom bandpass modulated by LFO)
    this.windSource = this.ctx.createBufferSource();
    this.windSource.buffer = this.noiseBuffer;
    this.windSource.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = "lowpass";
    this.windFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(3, this.ctx.currentTime);

    // LFO to modulate filter cutoff
    this.windLfo = this.ctx.createOscillator();
    this.windLfo.type = "sine";
    this.windLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow 0.08Hz modulation

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime); // swing by 150Hz

    this.windLfo.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);

    this.windSource.connect(this.windFilter);
    this.windFilter.connect(this.ambienceGain);

    this.windLfo.start();
    this.windSource.start();

    // C. Natural random triggers: Birds & Water Drips & heartbeats
    this.ambientInterval = window.setInterval(() => {
      if (!this.ambienceActive) return;
      const rand = Math.random();
      if (rand < 0.25) {
        this.playBirdChirp();
      } else if (rand < 0.6) {
        this.playWaterDrip();
      }
    }, 4000);

    // D. Subtle AI pulse every 15 seconds
    this.aiPulseInterval = window.setInterval(() => {
      if (!this.ambienceActive) return;
      this.playHeartbeat();
    }, 15000);
  }

  public stopDashboardAmbience() {
    this.ambienceActive = false;
    
    // Clear timers
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.aiPulseInterval) {
      clearInterval(this.aiPulseInterval);
      this.aiPulseInterval = null;
    }

    // Stop and clean nodes
    this.padOscs.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.padOscs = [];

    if (this.windSource) {
      try { this.windSource.stop(); } catch (e) {}
      this.windSource = null;
    }
    if (this.windLfo) {
      try { this.windLfo.stop(); } catch (e) {}
      this.windLfo = null;
    }

    if (this.ambienceGain && this.ctx) {
      const now = this.ctx.currentTime;
      // Fade out over 0.8s
      this.ambienceGain.gain.cancelScheduledValues(now);
      this.ambienceGain.gain.setValueAtTime(this.ambienceGain.gain.value, now);
      this.ambienceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        if (this.ambienceGain) {
          this.ambienceGain.disconnect();
          this.ambienceGain = null;
        }
      }, 900);
    }
  }
}

export const audioManager = new AudioManager();
