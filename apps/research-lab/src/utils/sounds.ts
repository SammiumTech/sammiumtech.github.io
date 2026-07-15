/**
 * Sound Manager for Sammium Research Lab
 * Uses standard Web Audio API to generate premium retro-futuristic gamer & neo-galactic sounds.
 */
class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  // Voice Actor mode is locked to Kanae Itō (Japanese Voice Actress for Yui)
  public yuiVoiceActor: "kana" = "kana";
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeSpeakTimeout: any = null;

  // Low frequency ambient hum oscillators
  private humOsc1: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  constructor() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Warm up and pre-load voices immediately on load
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.enabled = true;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggle(force?: boolean, isOverdrive: boolean = false) {
    if (force !== undefined) {
      this.enabled = force;
    } else {
      this.enabled = !this.enabled;
    }
    if (this.enabled) {
      this.init();
      this.playBeep(600, "sine", 0.1, 0.05);
      this.startAmbientHum(isOverdrive);
    } else {
      this.stopAmbientHum();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private playBeep(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }

  // Neon laser sound for spawning entities
  public playLaser() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // Low heavy rumble for engaging features or singularities
  public playSingularity() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.6);

      gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch (e) {}
  }

  // Clean satisfying mechanical switch click
  public playClick() {
    this.playBeep(900, "sine", 0.05, 0.04);
  }

  // Time-jump cosmic warp sweep sound
  public playTimeJump() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // Primary sweeping oscillator for spatial displacement feel
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start();
      osc1.stop(now + 0.35);

      // Secondary frequency riser for futuristic high-frequency sparkle
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(250, now + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(2200, now + 0.2);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.03, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start();
      osc2.stop(now + 0.25);
    } catch (e) {}
  }

  // Subtle soft mouse hover click
  public playHover() {
    this.playBeep(1200, "sine", 0.02, 0.015);
  }

  // Error buzz
  public playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // RGB overclock dynamic riser cascade sound
  public playOverdrive() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // Tone 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(100, now);
      osc1.frequency.exponentialRampToValueAtTime(1600, now + 0.8);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start();
      osc1.stop(now + 0.8);

      // Tone 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(200, now);
      osc2.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
      gain2.gain.setValueAtTime(0.03, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start();
      osc2.stop(now + 0.6);
    } catch (e) {}
  }

  // Sword Art Online "Link Start" audio sequence
  public playLinkStart() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Trigger Kirito Speech Synthesis simultaneously
      this.playKiritoVoice();

      // 2. Ascending Chiptune Arpeggio (SAO interface style)
      const notes = [523.25, 659.25, 783.99, 987.77, 1318.51, 1567.98]; // C5, E5, G5, B5, E6, G6
      const ctx = this.ctx;
      if (ctx) {
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.10);

          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.05, now + idx * 0.10 + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.10 + 0.35);

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(now + idx * 0.10);
          osc.stop(now + idx * 0.10 + 0.35);
        });
      }

      // 3. Deep Cybernetic Sweep (NerveGear Link Riser)
      const sweepOsc = this.ctx.createOscillator();
      const sweepOsc2 = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();

      sweepOsc.type = "sawtooth";
      sweepOsc.frequency.setValueAtTime(120, now + 0.5);
      sweepOsc.frequency.exponentialRampToValueAtTime(3200, now + 2.8);

      sweepOsc2.type = "triangle";
      sweepOsc2.frequency.setValueAtTime(122, now + 0.5); // Slightly detuned for width
      sweepOsc2.frequency.exponentialRampToValueAtTime(3210, now + 2.8);

      // Lowpass resonant filter for sweeping sound sweeps
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, now + 0.5);
      filter.frequency.exponentialRampToValueAtTime(14000, now + 2.6);
      filter.Q.setValueAtTime(4, now + 0.5);

      sweepGain.gain.setValueAtTime(0, now);
      sweepGain.gain.linearRampToValueAtTime(0.07, now + 0.7);
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      sweepOsc.connect(filter);
      sweepOsc2.connect(filter);
      filter.connect(sweepGain);
      sweepGain.connect(this.ctx.destination);

      sweepOsc.start(now + 0.5);
      sweepOsc2.start(now + 0.5);
      sweepOsc.stop(now + 2.8);
      sweepOsc2.stop(now + 2.8);

      // 4. High-frequency digital crystal chime confirming link completion
      const finalOsc = this.ctx.createOscillator();
      const finalGain = this.ctx.createGain();
      finalOsc.type = "sine";
      finalOsc.frequency.setValueAtTime(2093.00, now + 2.5); // C7
      finalOsc.frequency.exponentialRampToValueAtTime(2637.02, now + 2.8); // E7

      finalGain.gain.setValueAtTime(0, now);
      finalGain.gain.setValueAtTime(0.06, now + 2.5);
      finalGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

      finalOsc.connect(finalGain);
      finalGain.connect(this.ctx.destination);
      finalOsc.start(now + 2.5);
      finalOsc.stop(now + 3.4);

    } catch (e) {
      console.warn("Link Start sound synthesis failed:", e);
    }
  }

  // Play the official Japanese voice actor's voice (Yoshitsugu Matsuoka as Kirito) shouting "Link Start!"
  public playKiritoVoice() {
    if (!this.enabled || typeof window === "undefined") return;

    // Secure, direct public mp3 URLs containing Kirito's official "Link Start!" audio clip
    const voiceUrls = [
      "https://www.myinstants.com/media/sounds/sao-link-start.mp3",
      "https://www.myinstants.com/media/sounds/link-start.mp3",
      "https://www.myinstants.com/media/sounds/sao-link-start_rNnZ8jF.mp3",
      "https://www.myinstants.com/media/sounds/link-start_1.mp3"
    ];

    let currentIndex = 0;

    const tryPlayNext = () => {
      if (currentIndex >= voiceUrls.length) {
        console.warn("All official Kirito voice actor links failed to load or were rate-limited.");
        return;
      }

      try {
        const audio = new Audio(voiceUrls[currentIndex]);
        audio.volume = 1.0;

        // Ensure browser loads audio cleanly
        audio.preload = "auto";

        const onError = () => {
          cleanup();
          currentIndex++;
          tryPlayNext();
        };

        const onCanPlay = () => {
          cleanup();
          audio.play().catch((err) => {
            console.warn(`Kirito audio playback interrupted on index ${currentIndex}:`, err);
            currentIndex++;
            tryPlayNext();
          });
        };

        const cleanup = () => {
          audio.removeEventListener("error", onError);
          audio.removeEventListener("canplaythrough", onCanPlay);
        };

        // If the resource takes too long or fails, fall back to next URL
        audio.addEventListener("error", onError);
        audio.addEventListener("canplaythrough", onCanPlay);

        // Add a 1.5 second timeout to prevent hanging on slower servers
        const timeoutId = setTimeout(() => {
          cleanup();
          currentIndex++;
          tryPlayNext();
        }, 1500);

        audio.load();
      } catch (e) {
        console.warn("Failed to initialize Audio object on index " + currentIndex, e);
        currentIndex++;
        tryPlayNext();
      }
    };

    tryPlayNext();
  }

  // Futuristic walkie-talkie / communication link opened
  public playCommOn() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(1109.73, now + 0.08); // C#6

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } catch (e) {}
  }

  // Communication link closed
  public playCommOff() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(587.33, now + 0.08); // D5

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  // Starts the low-frequency ambient hum loop
  public startAmbientHum(isOverdrive: boolean = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Guard against duplicated active hums
    if (this.humOsc1 || this.humOsc2) {
      this.updateAmbientHumPitch(isOverdrive);
      return;
    }

    try {
      const now = this.ctx.currentTime;
      
      // Biquad lowpass filter makes the tone thick and non-fatiguing
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(isOverdrive ? 180 : 120, now);

      // Create dual slightly detuned oscillators for a rich, warm chorus hum
      this.humOsc1 = this.ctx.createOscillator();
      this.humOsc2 = this.ctx.createOscillator();

      this.humOsc1.type = "triangle";
      this.humOsc2.type = "sine";

      const baseFreq = isOverdrive ? 82.41 : 55.00; // E2 (intense load) vs A1 (relaxed)
      this.humOsc1.frequency.setValueAtTime(baseFreq, now);
      this.humOsc2.frequency.setValueAtTime(baseFreq + 0.5, now); // Detune by 0.5 Hz for beat frequency wave

      this.humGain = this.ctx.createGain();
      // Keep it extremely low in the background
      const targetGain = isOverdrive ? 0.035 : 0.02;
      this.humGain.gain.setValueAtTime(targetGain, now);

      // Connect: oscillators -> lowpass filter -> volume gain -> speakers
      this.humOsc1.connect(this.filterNode);
      this.humOsc2.connect(this.filterNode);
      this.filterNode.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);

      this.humOsc1.start(now);
      this.humOsc2.start(now);
    } catch (e) {
      console.warn("Failed to start ambient hum:", e);
    }
  }

  // Stops the low-frequency ambient hum loop
  public stopAmbientHum() {
    try {
      if (this.humOsc1) {
        this.humOsc1.stop();
        this.humOsc1.disconnect();
        this.humOsc1 = null;
      }
      if (this.humOsc2) {
        this.humOsc2.stop();
        this.humOsc2.disconnect();
        this.humOsc2 = null;
      }
      if (this.humGain) {
        this.humGain.disconnect();
        this.humGain = null;
      }
      if (this.filterNode) {
        this.filterNode.disconnect();
        this.filterNode = null;
      }
    } catch (e) {
      console.warn("Failed to stop ambient hum:", e);
    }
  }

  // Transitions the pitch dynamically with a futuristic frequency-glide effect
  public updateAmbientHumPitch(isOverdrive: boolean) {
    if (!this.enabled || !this.ctx) {
      this.stopAmbientHum();
      return;
    }
    
    if (!this.humOsc1 || !this.humOsc2) {
      this.startAmbientHum(isOverdrive);
      return;
    }

    try {
      const now = this.ctx.currentTime;
      const targetBaseFreq = isOverdrive ? 82.41 : 55.00;
      const targetFilterFreq = isOverdrive ? 180 : 120;
      const targetGain = isOverdrive ? 0.035 : 0.02;

      // Glide frequency smoothly over 0.8s to mimic server fan/reactor speed changes
      this.humOsc1.frequency.linearRampToValueAtTime(targetBaseFreq, now + 0.8);
      this.humOsc2.frequency.linearRampToValueAtTime(targetBaseFreq + 0.5, now + 0.8);
      
      if (this.filterNode) {
        this.filterNode.frequency.linearRampToValueAtTime(targetFilterFreq, now + 0.8);
      }
      if (this.humGain) {
        this.humGain.gain.linearRampToValueAtTime(targetGain, now + 0.8);
      }
    } catch (e) {
      console.warn("Failed to update ambient hum pitch:", e);
    }
  }

  // Futuristic VR view toggle cyber sound
  public playVrToggle(enabled: boolean) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      if (enabled) {
        // Ascending harmonic space chime
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.4);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      } else {
        // Descending powered-down chime
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  // Synthesizes a unique, short sound signature for each of the 13 research stations
  public playStationChime(stationId: string) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, now);

      switch (stationId) {
        case "ai-nexus": {
          // Sparkly, ascending intelligence chime
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          osc1.type = "sine";
          osc2.type = "sine";
          osc1.frequency.setValueAtTime(523.25, now); // C5
          osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6
          osc2.frequency.setValueAtTime(659.25, now); // E5
          osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.25); // E6
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
          osc1.connect(gain);
          osc2.connect(gain);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.3);
          osc2.stop(now + 0.3);
          break;
        }

        case "neural-observatory": {
          // Cosmic, sweeping observatory scanner
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.4);
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(500, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
          osc.connect(filter);
          filter.connect(gain);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }

        case "ai-vault": {
          // Double-staccato metallic digital lock
          const osc = this.ctx.createOscillator();
          osc.type = "square";
          osc.frequency.setValueAtTime(293.66, now); // D4
          osc.frequency.setValueAtTime(587.33, now + 0.08); // D5
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.setValueAtTime(0.02, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
          osc.connect(gain);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }

        case "ai-lab": {
          // 3-note upbeat research tone arpeggio
          const osc = this.ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
          osc.connect(gain);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case "robotics-swarm": {
          // Quick insect-like high frequency mechanical chatter
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          osc1.type = "square";
          osc2.type = "triangle";
          osc1.frequency.setValueAtTime(1200, now);
          osc1.frequency.setValueAtTime(1400, now + 0.05);
          osc1.frequency.setValueAtTime(1000, now + 0.1);
          osc2.frequency.setValueAtTime(1100, now);
          osc2.frequency.setValueAtTime(1300, now + 0.05);
          osc2.frequency.setValueAtTime(900, now + 0.1);
          gain.gain.setValueAtTime(0.015, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
          osc1.connect(gain);
          osc2.connect(gain);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.25);
          osc2.stop(now + 0.25);
          break;
        }

        case "quantum-orbit": {
          // Fast frequency-modulating warp wave
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.15);
          osc.frequency.linearRampToValueAtTime(440, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
          osc.connect(gain);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        case "cellular-matrix": {
          // Clean, high-speed binary grid tick-tock
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(987.77, now); // B5
          osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
          osc.connect(gain);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case "telemetry-center": {
          // Sonar echo / radar sweep sound
          const osc = this.ctx.createOscillator();
          const biquad = this.ctx.createBiquadFilter();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
          biquad.type = "bandpass";
          biquad.frequency.setValueAtTime(1000, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
          osc.connect(biquad);
          biquad.connect(gain);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        case "prototype-sandbox": {
          // Playful springy upward slant
          const osc = this.ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
          osc.connect(gain);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case "knowledge-core": {
          // Rich, warm major-seventh structural triad chord
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const osc3 = this.ctx.createOscillator();
          osc1.type = "sine";
          osc2.type = "sine";
          osc3.type = "sine";
          osc1.frequency.setValueAtTime(329.63, now); // E4
          osc2.frequency.setValueAtTime(392.00, now); // G4
          osc3.frequency.setValueAtTime(493.88, now); // B4
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
          osc1.connect(gain);
          osc2.connect(gain);
          osc3.connect(gain);
          osc1.start(now);
          osc2.start(now);
          osc3.start(now);
          osc1.stop(now + 0.4);
          osc2.stop(now + 0.4);
          osc3.stop(now + 0.4);
          break;
        }

        case "experiment-timeline": {
          // Precise chronological double chronometer ticks
          const osc = this.ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.setValueAtTime(600, now + 0.08);
          osc.frequency.setValueAtTime(1200, now + 0.16);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
          osc.connect(gain);
          osc.start(now);
          osc.stop(now + 0.28);
          break;
        }

        case "impact-simulator": {
          // Deep heavy low-frequency rumble impact chime
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          osc1.type = "triangle";
          osc2.type = "sawtooth";
          osc1.frequency.setValueAtTime(110.00, now); // A2
          osc1.frequency.linearRampToValueAtTime(55.00, now + 0.35);
          osc2.frequency.setValueAtTime(55.00, now); // A1
          const lp = this.ctx.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.setValueAtTime(150, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
          osc1.connect(lp);
          osc2.connect(lp);
          lp.connect(gain);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.4);
          osc2.stop(now + 0.4);
          break;
        }

        case "research-rankings": {
          // Upward rising pentatonic celebratory chime (A3 -> C4 -> D4 -> E4)
          const notes = [220.00, 261.63, 293.66, 329.63];
          const ctx = this.ctx;
          if (ctx) {
            notes.forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq, now + idx * 0.06);
              const itemGain = ctx.createGain();
              itemGain.gain.setValueAtTime(0.025, now + idx * 0.06);
              itemGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.15);
              osc.connect(itemGain);
              itemGain.connect(ctx.destination);
              osc.start(now + idx * 0.06);
              osc.stop(now + idx * 0.06 + 0.15);
            });
          }
          break;
        }

        default: {
          // Standard pleasant synth beep
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
          osc.connect(gain);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }
      }

      gain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Station chime play failed:", e);
    }
  }

  // Speaks response using Yui's official Japanese voice (Kanae Itō) with cute, high-pitched parameters
  public speakYui(text: string, force: boolean = false) {
    // Voice-over completely disabled as requested
  }
}

export const sounds = new SoundManager();
