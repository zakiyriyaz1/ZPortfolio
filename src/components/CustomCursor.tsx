"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// Memoized Spaceship component
const Spaceship = React.memo(function Spaceship({ isMoving, isHovering }: { isMoving: boolean; isHovering: boolean }) {
  return (
    <motion.div
      className="relative w-full h-full"
      animate={{ scale: isMoving ? 1.1 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <motion.div className="absolute left-1/2 bottom-[-8px] w-[8px] h-[24px]" style={{ transform: 'translateX(-50%)' }} animate={{ opacity: isMoving ? [0.9, 1, 0.9] : 0.7, scale: isMoving ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="absolute inset-0 rounded-full" style={{ background: isHovering ? 'rgba(255, 255, 0, 0.5)' : 'rgba(0, 255, 255, 0.5)', filter: 'blur(8px)', transition: 'background 0.3s ease' }} />
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-full" style={{ background: 'rgba(255, 255, 255, 1)', filter: 'blur(2px)' }} />
      </motion.div>
      <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 0%, 100% 75%, 80% 100%, 20% 100%, 0% 75%)', background: isHovering ? 'linear-gradient(180deg, #444 0%, #222 100%)' : 'linear-gradient(180deg, #ddd 0%, #999 100%)', transition: 'background 0.3s ease' }} />
      <div className="absolute top-[15%] left-1/2 w-[25%] h-[20%]" style={{ transform: 'translateX(-50%)', clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', background: isHovering ? '#ff007f' : '#00ffff', boxShadow: `0 0 6px ${isHovering ? '#ff007f' : '#00ffff'}, inset 0 0 2px #fff`, transition: 'background 0.3s ease, box-shadow 0.3s ease' }} />
      <div className="absolute top-[50%] left-[-15%] w-[30%] h-[40%]" style={{ background: isHovering ? '#ff007f' : '#00ffff', clipPath: 'polygon(100% 0, 100% 100%, 0 50%)', boxShadow: `-1px 0 4px ${isHovering ? '#ff007f' : '#00ffff'}`, transition: 'background 0.3s ease, box-shadow 0.3s ease' }} />
      <div className="absolute top-[50%] right-[-15%] w-[30%] h-[40%]" style={{ background: isHovering ? '#ff007f' : '#00ffff', clipPath: 'polygon(0 0, 100% 50%, 0 100%)', boxShadow: `1px 0 4px ${isHovering ? '#ff007f' : '#00ffff'}`, transition: 'background 0.3s ease, box-shadow 0.3s ease' }} />
      <div className="absolute top-[78%] left-1/2 w-[70%] h-[2px]" style={{ transform: 'translateX(-50%)', background: isHovering ? '#ffff00' : '#ff007f', boxShadow: `0 0 4px ${isHovering ? '#ffff00' : '#ff007f'}`, transition: 'background 0.3s ease, box-shadow 0.3s ease' }} />
    </motion.div>
  );
});

// Define types for our effects
type TrailPoint = { x: number; y: number; id: number };
type Laser = { id: number; rotation: number; startX: number; startY: number; endX: number; endY: number };

const CustomCursor = () => {
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isMoving, setIsMoving] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [lasers, setLasers] = useState<Laser[]>([]);
  
  const movementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevMousePosition = useRef({ x: 0, y: 0 });

  const rotation = useSpring(0, { stiffness: 80, damping: 40, mass: 1 });
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { stiffness: 700, damping: 40 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const removeLaser = (id: number) => {
    setLasers(prev => prev.filter(laser => laser.id !== id));
  };

  useEffect(() => {
    document.body.style.cursor = 'none';
    
    const mouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      cursorX.set(newPos.x);
      cursorY.set(newPos.y);

      setIsMoving(true);
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);

      const dx = newPos.x - prevMousePosition.current.x;
      const dy = newPos.y - prevMousePosition.current.y;
      
      prevMousePosition.current = newPos;
      
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        const newRotation = Math.atan2(dy, dx) * (180 / Math.PI);
        rotation.set(newRotation + 90);
      }
      
      movementTimeoutRef.current = setTimeout(() => setIsMoving(false), 150);
      setTrail(prev => [...prev.slice(-15), { x: newPos.x, y: newPos.y, id: Date.now() }]);
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      const currentRotation = rotation.get();
      const angleRad = (currentRotation - 90) * (Math.PI / 180);
      const shipTipOffset = 13;
      const travelDistance = 400;
      const startX = e.clientX + Math.cos(angleRad) * shipTipOffset;
      const startY = e.clientY + Math.sin(angleRad) * shipTipOffset;
      const endX = startX + Math.cos(angleRad) * travelDistance;
      const endY = startY + Math.sin(angleRad) * travelDistance;

      setLasers(prev => [...prev, { id: Date.now(), rotation: currentRotation, startX, startY, endX, endY }]);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [role="button"], input, textarea, select')) {
        setCursorVariant("linkHover");
      }
    };
    const handleMouseLeave = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [role="button"], input, textarea, select')) {
        setCursorVariant("default");
      }
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseLeave);
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
      document.body.style.cursor = 'auto';
    };
  }, []);

  const isHovering = cursorVariant === 'linkHover';

  return (
    <>
      {/* Fire Trail */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-[998]"
          initial={{ x: point.x - 4, y: point.y, scale: 1, opacity: 1 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            width: `${Math.max(10 - index * 0.6, 2)}px`,
            height: `${Math.max(20 - index * 1.2, 5)}px`,
            background: `linear-gradient(to top, rgba(255, 120, 0, ${0.8 - index * 0.05}), rgba(255, 220, 50, ${0.7 - index * 0.05}), transparent)`,
            borderRadius: '50%',
            filter: `blur(${Math.max(4 - index * 0.3, 0)}px)`,
          }}
        />
      ))}
      
      {/* Laser Blasts */}
      {lasers.map((laser) => (
        <motion.div
          key={laser.id}
          className="fixed pointer-events-none z-[998]"
          initial={{ x: laser.startX, y: laser.startY, rotate: laser.rotation, opacity: 1 }}
          animate={{ x: laser.endX, y: laser.endY, opacity: 0 }}
          transition={{ duration: 0.4, ease: "linear" }}
          onAnimationComplete={() => removeLaser(laser.id)}
          style={{
            width: '2px', height: '15px', background: isHovering ? '#ffff00' : '#ff007f',
            boxShadow: `0 0 8px ${isHovering ? '#ffff00' : '#ff007f'}`,
          }}
        />
      ))}

      {/* Main Spaceship Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[999] top-0 left-0"
        style={{
          width: '26px', height: '26px',
          x: smoothX,
          y: smoothY,
          translateX: '-13px',
          translateY: '-13px',
          rotate: rotation,
        }}
      >
        <Spaceship isMoving={isMoving} isHovering={isHovering} />
      </motion.div>
    </>
  );
};

export default CustomCursor;