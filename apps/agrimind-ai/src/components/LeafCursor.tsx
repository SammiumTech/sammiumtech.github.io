import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { Leaf } from "lucide-react";

interface ClickEvent {
  id: number;
  x: number;
  y: number;
}

interface WhirlwindLeaf {
  id: string;
  x: number;
  y: number;
  delay: number;
  rotationDirection: number;
  angle: number;
  size: number;
}

interface AmbientLeaf {
  id: string;
  startX: number;
  duration: number;
  size: number;
  delay: number;
  swayWidth: number;
  colorType: "green" | "emerald" | "amber" | "yellow";
}

// Procedurally synthesize a crisp water droplet plop "bloop"
const playWaterDropSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    const now = ctx.currentTime;
    
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {
    console.warn("AudioContext playback failed or blocked:", e);
  }
};

// Procedurally synthesize an organic howling/whistling wind gust sound
const playWindWhistleSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Wind gust 1: Whistling high sweep
    const osc1 = ctx.createOscillator();
    const filter1 = ctx.createBiquadFilter();
    const gainNode1 = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(750, now);
    // Mimic blowing wind gusts with slow smooth sweeps
    osc1.frequency.linearRampToValueAtTime(1050, now + 0.35);
    osc1.frequency.exponentialRampToValueAtTime(600, now + 0.9);
    osc1.frequency.linearRampToValueAtTime(850, now + 1.4);
    osc1.frequency.exponentialRampToValueAtTime(120, now + 2.0);

    filter1.type = "bandpass";
    filter1.frequency.setValueAtTime(850, now);
    filter1.Q.setValueAtTime(12, now);
    filter1.frequency.exponentialRampToValueAtTime(650, now + 1.1);

    gainNode1.gain.setValueAtTime(0.001, now);
    gainNode1.gain.linearRampToValueAtTime(0.09, now + 0.25);
    gainNode1.gain.linearRampToValueAtTime(0.06, now + 0.8);
    gainNode1.gain.linearRampToValueAtTime(0.08, now + 1.3);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc1.connect(filter1);
    filter1.connect(gainNode1);
    gainNode1.connect(ctx.destination);

    // Wind gust 2: High altitude draft pitch
    const osc2 = ctx.createOscillator();
    const filter2 = ctx.createBiquadFilter();
    const gainNode2 = ctx.createGain();

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1150, now);
    osc2.frequency.linearRampToValueAtTime(1380, now + 0.4);
    osc2.frequency.exponentialRampToValueAtTime(900, now + 0.95);
    osc2.frequency.linearRampToValueAtTime(1250, now + 1.45);
    osc2.frequency.exponentialRampToValueAtTime(250, now + 2.0);

    filter2.type = "bandpass";
    filter2.frequency.setValueAtTime(1200, now);
    filter2.Q.setValueAtTime(15, now);

    gainNode2.gain.setValueAtTime(0.001, now);
    gainNode2.gain.linearRampToValueAtTime(0.05, now + 0.3);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc2.connect(filter2);
    filter2.connect(gainNode2);
    gainNode2.connect(ctx.destination);

    // Subtly blended white noise for airy rustling leaves backdrop
    const bufferSize = ctx.sampleRate * 2; // 2 seconds duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(350, now);
    noiseFilter.Q.setValueAtTime(2.0, now);
    noiseFilter.frequency.linearRampToValueAtTime(750, now + 0.8);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 2.0);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.035, now + 0.45);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 2.0);
    osc2.start(now);
    osc2.stop(now + 2.0);
    noise.start(now);
    noise.stop(now + 2.0);
  } catch (err) {
    console.warn("AudioContext wind synthesis error:", err);
  }
};

export default function LeafCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [whirlwindLeaves, setWhirlwindLeaves] = useState<WhirlwindLeaf[]>([]);
  const [ambientLeaves, setAmbientLeaves] = useState<AmbientLeaf[]>([]);

  // Track coordinates of the last spawned trail leaf to throttle by distance rather than time
  const lastSpawnRef = useRef({ x: -1000, y: -1000 });

  // Smooth springs for tracking mouse coordinates with a slight trailing effect
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 320, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Periodic ambient leaves spawning
  useEffect(() => {
    const spawnAmbientLeaf = () => {
      const colors: ("green" | "emerald" | "amber" | "yellow")[] = ["green", "emerald", "amber", "yellow"];
      const newLeaf: AmbientLeaf = {
        id: `ambient-${Date.now()}-${Math.random()}`,
        startX: Math.random() * window.innerWidth,
        duration: 8 + Math.random() * 6, // 8-14s slide duration
        size: 10 + Math.random() * 14, // 10-24px size
        delay: Math.random() * 2,
        swayWidth: 40 + Math.random() * 80, // sway offset
        colorType: colors[Math.floor(Math.random() * colors.length)],
      };

      setAmbientLeaves(prev => {
        // Keep screen leaf count within 15 to safeguard DOM performance
        const cleaned = prev.slice(-14);
        return [...cleaned, newLeaf];
      });
    };

    // Initial batch of leaves so the screen doesn't start completely barren
    for (let i = 0; i < 4; i++) {
      spawnAmbientLeaf();
    }

    const interval = setInterval(spawnAmbientLeaf, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const touchMediaQuery = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(touchMediaQuery.matches);

    const handleTouchChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };

    touchMediaQuery.addEventListener("change", handleTouchChange);

    // Track mouse coordinates
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) {
        setIsVisible(true);
      }

      // Calculate Euclidean distance from the last trailing leaf spawn coordinates
      const dx = e.clientX - lastSpawnRef.current.x;
      const dy = e.clientY - lastSpawnRef.current.y;
      const distance = Math.hypot(dx, dy);

      // If moved more than 40 pixels, spawn a beautiful spiraling trail leaf
      if (distance > 40) {
        lastSpawnRef.current = { x: e.clientX, y: e.clientY };
        
        const randomAngle = Math.random() * Math.PI * 2;
        const newTrailLeaf: WhirlwindLeaf = {
          id: `trail-${Date.now()}-${Math.random()}`,
          x: e.clientX,
          y: e.clientY,
          delay: 0,
          rotationDirection: Math.random() > 0.5 ? 1 : -1,
          angle: randomAngle,
          size: 10 + Math.random() * 10, // 10-20px size
        };

        setWhirlwindLeaves(prev => {
          // Maintain a healthy pool of dynamic trail/whirlwind leaves to prevent browser lag
          const cleaned = prev.slice(-35);
          return [...cleaned, newTrailLeaf];
        });
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Hover effect over clickable/interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.getAttribute("role") === "button";

      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      
      // Trigger synthesized droplet & wind whistling sound effects in parallel
      playWaterDropSound();
      playWindWhistleSound();

      // Spawn teardrop ripples coords
      const x = e.clientX;
      const y = e.clientY;
      const newClickId = Date.now() + Math.random();
      setClickEvents(prev => [...prev, { id: newClickId, x, y }]);

      // Spawn a spiral whirlwind of 10 falling leaf particles around the click vortex!
      const newWhirlwindLeaves: WhirlwindLeaf[] = Array.from({ length: 10 }).map((_, idx) => {
        const angleOffset = Math.random() * Math.PI * 2;
        const rad = (idx * (Math.PI * 2) / 10) + angleOffset;
        return {
          id: `whirlwind-${Date.now()}-${idx}-${Math.random()}`,
          x,
          y,
          delay: idx * 0.03, // smooth staggered release
          rotationDirection: Math.random() > 0.5 ? 1 : -1,
          angle: rad,
          size: 12 + Math.random() * 12, // 12-24px leaves
        };
      });

      setWhirlwindLeaves(prev => {
        const cleaned = prev.slice(-20); // Keep buffer healthy
        return [...cleaned, ...newWhirlwindLeaves];
      });

      // Clear click event ripple
      setTimeout(() => {
        setClickEvents(prev => prev.filter(evt => evt.id !== newClickId));
      }, 1000);
    };

    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Dynamic style elements for fine-pointer fine cursor override
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @media (pointer: fine) {
        body, button, a, select, input, textarea, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      touchMediaQuery.removeEventListener("change", handleTouchChange);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      styleEl.remove();
    };
  }, [isVisible, cursorX, cursorY]);

  // Clean up whirlwind leaf particles from memory once animation triggers complete
  useEffect(() => {
    if (whirlwindLeaves.length > 0) {
      const timer = setTimeout(() => {
        setWhirlwindLeaves([]);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [whirlwindLeaves.length]);

  return (
    <>
      {/* 1. Ambient Falling Leaves Layer */}
      <div className="fixed inset-0 pointer-events-none z-[10] overflow-hidden">
        {ambientLeaves.map((leaf) => {
          let leafColor = "text-emerald-500/60 fill-emerald-500/10";
          if (leaf.colorType === "green") leafColor = "text-green-500/60 fill-green-500/15";
          else if (leaf.colorType === "amber") leafColor = "text-amber-500/50 fill-amber-500/10";
          else if (leaf.colorType === "yellow") leafColor = "text-yellow-400/50 fill-yellow-400/10";

          return (
            <motion.div
              key={leaf.id}
              className={`absolute top-0 ${leafColor}`}
              style={{ width: leaf.size, height: leaf.size }}
              initial={{ 
                x: leaf.startX, 
                y: -50, 
                rotate: Math.random() * 360,
                scale: 0.8
              }}
              animate={{
                y: window.innerHeight + 100,
                x: [
                  leaf.startX,
                  leaf.startX + leaf.swayWidth,
                  leaf.startX - leaf.swayWidth / 2,
                  leaf.startX + leaf.swayWidth * 0.8
                ],
                rotate: [0, 180, 360, 540],
                scale: [0.8, 1.1, 0.9, 1]
              }}
              transition={{
                duration: leaf.duration,
                delay: leaf.delay,
                ease: "linear",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Whirlwind Spiral Leaf & Wind Gust Blast */}
      <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
        <AnimatePresence>
          {whirlwindLeaves.map((leaf) => {
            // Spiral coordinates calculation
            const rad = leaf.angle;
            // The leaf will spiral outwards with rotational wind displacement
            const xSteps = [
              0,
              Math.cos(rad) * (leaf.size * 2),
              Math.cos(rad + 1.5) * (leaf.size * 5),
              Math.cos(rad + 3.0) * (leaf.size * 8.5)
            ];
            const ySteps = [
              0,
              Math.sin(rad) * (leaf.size * 2) - 15,
              Math.sin(rad + 1.5) * (leaf.size * 5) - 60,
              Math.sin(rad + 3.0) * (leaf.size * 8.5) - 140 // upward whirlwind lift!
            ];

            const colors = [
              "text-emerald-400 fill-emerald-300/30",
              "text-green-400 fill-green-300/20",
              "text-amber-400 fill-amber-300/30",
              "text-lime-400 fill-lime-300/25"
            ];
            const selectedColor = colors[Math.floor(Math.random() * colors.length)];

            return (
              <motion.div
                key={leaf.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${selectedColor}`}
                style={{ left: leaf.x, top: leaf.y, width: leaf.size, height: leaf.size }}
                initial={{ x: 0, y: 0, scale: 0.1, opacity: 1, rotate: Math.random() * 360 }}
                animate={{
                  x: xSteps,
                  y: ySteps,
                  scale: [0.1, 1.3, 0.9, 0],
                  opacity: [1, 1, 0.75, 0],
                  rotate: [0, 360 * leaf.rotationDirection, 720 * leaf.rotationDirection]
                }}
                transition={{
                  duration: 1.6,
                  delay: leaf.delay,
                  ease: "easeOut"
                }}
              >
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_2px_8px_rgba(16,185,129,0.35)]">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </motion.div>
            );
          })}

          {/* Click Water Ripples Visual Layer */}
          {clickEvents.map((evt) => (
            <div
              key={evt.id}
              className="absolute"
              style={{ left: evt.x, top: evt.y }}
            >
              {/* Concentric Water Ripples */}
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-emerald-400/60 bg-emerald-400/5"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-sky-400/40"
                initial={{ scale: 0.3, opacity: 1 }}
                animate={{ scale: 3.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              />

              {/* Spattering Teardrop Particles (3 splash directions) */}
              {[0, 120, 240].map((angle, idx) => {
                const rad = (angle * Math.PI) / 180;
                const targetX = Math.cos(rad) * 48;
                const targetY = Math.sin(rad) * 48 - 18; 
                
                return (
                  <motion.div
                    key={idx}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    initial={{ x: 0, y: 0, scale: 0.1, opacity: 1, rotate: angle + 90 }}
                    animate={{ 
                      x: targetX, 
                      y: targetY, 
                      scale: [0.1, 1, 0],
                      opacity: [1, 0.9, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <svg 
                      className="w-4 h-4 text-emerald-400/90 fill-emerald-300/50 drop-shadow-[0_1px_3px_rgba(52,211,153,0.4)]" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. Main Custom Mouse Cursor */}
      {isVisible && !isTouchDevice && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          <motion.div
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
            className="absolute top-0 left-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isClicked ? 0.75 : isHovered ? 1.3 : 1,
              opacity: 1 
            }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            {/* Main Ring / Orbs Wrapper */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              
              {/* Rotating Sun Orbs Ring */}
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: isHovered ? 2 : 4, 
                  ease: "linear" 
                }}
              >
                {/* Sun Orb 1 */}
                <motion.div 
                  className="absolute w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                  style={{ top: "4px", left: "32px", x: "-50%", y: "-50%" }}
                  animate={{ scale: isHovered ? [1, 1.4, 1] : [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                />
                
                {/* Sun Orb 2 */}
                <motion.div 
                  className="absolute w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                  style={{ top: "46px", left: "56px", x: "-50%", y: "-50%" }}
                  animate={{ scale: isHovered ? [1, 1.4, 1] : [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.4 }}
                />
                
                {/* Sun Orb 3 */}
                <motion.div 
                  className="absolute w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                  style={{ top: "46px", left: "8px", x: "-50%", y: "-50%" }}
                  animate={{ scale: isHovered ? [1, 1.4, 1] : [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.8 }}
                />
              </motion.div>

              {/* Glowing trail expansion ring */}
              <motion.div
                className="absolute w-8 h-8 rounded-full border border-emerald-400/30 bg-emerald-400/5"
                animate={{ 
                  scale: isHovered ? [1, 1.7, 1] : [1, 1.3, 1],
                  opacity: isHovered ? [0.4, 0.1, 0.4] : [0.25, 0.05, 0.25]
                }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              />

              {/* Center Leaf Pointer */}
              <div className="relative z-10 p-1.5 bg-emerald-500 rounded-full border border-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.5)] text-white">
                <Leaf className="w-4 h-4 fill-emerald-100 rotate-45 transform" />
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
