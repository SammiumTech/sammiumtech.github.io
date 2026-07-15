import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface LivingCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  noFloat?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function LivingCard({ 
  children, 
  className = "", 
  id, 
  delay = 0, 
  noFloat = false,
  onClick,
}: LivingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [reflectionPos, setReflectionPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Get mouse coordinates relative to the card container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Translate coordinates to percentage values for the radial light reflection
    const xPct = (x / width) * 100;
    const yPct = (y / height) * 100;
    setReflectionPos({ x: xPct, y: yPct });

    // Calculate rotation values (-3 to +3 degrees) for cursor tilt
    const xc = width / 2;
    const yc = height / 2;
    const rotX = -((y - yc) / yc) * 3.5;
    const rotY = ((x - xc) / xc) * 3.5;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      id={id}
      className={`relative overflow-hidden group transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: (noFloat || isHovered) ? 0 : [0, -3, 0],
        rotateX: rotateX,
        rotateY: rotateY,
        scale: isHovered ? 1.015 : 1,
      }}
      transition={{
        y: {
          repeat: (noFloat || isHovered) ? 0 : Infinity,
          duration: 5 + delay * 0.4,
          ease: "easeInOut",
          delay: delay * 0.15,
        },
        rotateX: { type: "spring", stiffness: 220, damping: 18 },
        rotateY: { type: "spring", stiffness: 220, damping: 18 },
        scale: { type: "spring", stiffness: 220, damping: 20 },
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onClick={onClick}
    >
      {/* Dynamic Light Reflection following mouse cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 180px at ${reflectionPos.x}% ${reflectionPos.y}%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 80%)`,
          mixBlendMode: "overlay"
        }}
      />
      {children}
    </motion.div>
  );
}
