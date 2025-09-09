// src/components/CustomCursor.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [preClickVariant, setPreClickVariant] = useState("default");

  useEffect(() => {
    const style = document.createElement('style');
    // This is the updated, more forceful CSS rule
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      let newVariant = "default";
      if (e.target instanceof Element) {
          if (e.target.closest('input, textarea, [contenteditable="true"]')) {
              newVariant = "text";
          } else if (e.target.closest('a, button, [role="button"]')) {
              newVariant = "linkHover";
          }
      }
      setCursorVariant(newVariant);
      setPreClickVariant(newVariant);
    };
    
    const handleMouseDown = () => setCursorVariant("clicking");
    const handleMouseUp = () => setCursorVariant(preClickVariant);

    window.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [preClickVariant]);

  const svgVariants: Variants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
      scale: 1,
      transition: { type: "spring", stiffness: 1000, damping: 60 }
    },
    linkHover: {
      x: mousePosition.x,
      y: mousePosition.y,
      scale: 1.2,
      transition: { type: "spring", stiffness: 800, damping: 40 }
    },
    clicking: {
        x: mousePosition.x,
        y: mousePosition.y,
        scale: 0.8,
        transition: { type: "spring", stiffness: 600, damping: 30 }
    },
    text: {
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: 1,
        transition: { type: "spring", stiffness: 1000, damping: 60 }
    }
  };

  const arrowVariants: Variants = {
    default: { opacity: 1 },
    linkHover: { opacity: 1 },
    clicking: { opacity: 1 },
    text: { opacity: 0 }
  };
  
  const iBeamVariants: Variants = {
    default: { opacity: 0 },
    linkHover: { opacity: 0 },
    clicking: { opacity: 0 },
    text: { opacity: 1, transition: { delay: 0.1 } }
  };

  return (
    <motion.svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      variants={svgVariants}
      animate={cursorVariant}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ originX: 0, originY: 0 }}
    >
      <defs>
        <filter id="cyber-glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
          <feColorMatrix in="blur1" mode="matrix" values="1 0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="yellowGlow" />
          <feMerge><feMergeNode in="yellowGlow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <motion.g variants={arrowVariants} animate={cursorVariant}>
        <path
          d="M 2 2 L 28 16 L 2 30 L 10 16 L 2 2 Z"
          fill="#FFEC00"
          filter="url(#cyber-glow-yellow)"
          transform="rotate(-125 16 16)"
        />
      </motion.g>

      <motion.g variants={iBeamVariants} animate={cursorVariant}>
          <path d="M16 4 L16 28 M12 4 L20 4 M12 28 L20 28" stroke="#FFEC00" strokeWidth="2" filter="url(#cyber-glow-yellow)" />
      </motion.g>

    </motion.svg>
  );
};

export default CustomCursor;