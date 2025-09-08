// src/components/CustomCursor.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if the target or its parent is a link or button
      if (target.closest('a, button')) {
        setCursorVariant("linkHover");
      }
    };

    const handleMouseLeave = () => {
      setCursorVariant("default");
    };

    window.addEventListener("mousemove", mouseMove);
    // Add listeners for entering and leaving clickable elements
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave, true);


    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, []);

  const variants: Variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
      backgroundColor: "rgba(255, 0, 0, 0.6)",
      boxShadow: "0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.4)",
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    linkHover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(255, 0, 0, 0.1)", // More transparent
      border: "2px solid rgba(255, 0, 0, 0.6)",
      boxShadow: "0 0 15px rgba(255, 0, 0, 0.6)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <motion.div
      variants={variants}
      animate={cursorVariant} // Animate based on the cursorVariant state
      className="rounded-full fixed top-0 left-0 pointer-events-none z-[999]"
    />
  );
};

export default CustomCursor;