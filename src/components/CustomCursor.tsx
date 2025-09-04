// src/components/CustomCursor.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const variants: Variants = {
    default: {
      x: mousePosition.x - 8, // Offset adjusted for new smaller size (h-4 w-4 means 16px, so -8 to center)
      y: mousePosition.y - 8,
      // Color changed to vibrant red
      backgroundColor: "rgba(255, 0, 0, 0.6)", 
      // Shadow adjusted for a sharper, laser-like glow
      boxShadow: "0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.4)",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      animate="default"
      // Size changed from h-8 w-8 to h-4 w-4
      className="h-4 w-4 rounded-full fixed top-0 left-0 pointer-events-none z-[999]"
    />
  );
};

export default CustomCursor;