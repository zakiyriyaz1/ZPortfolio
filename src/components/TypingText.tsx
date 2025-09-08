// src/components/TypingText.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursorClassName?: string;
}

export default function TypingText({
  text,
  delay = 0,
  speed = 50,
  className = "",
  cursorClassName = ""
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  // Removed the unused 'isTyping' state
  // const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // Changed 'let' to 'const'
    const timeoutId = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          // setIsTyping(false); // This was the only use, so it can be removed
        }
      }, speed);

      // Cleanup interval on component unmount
      return () => clearInterval(typingInterval);
    }, delay * 1000);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [text, delay, speed]);

  return (
    <p className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className={`inline-block w-1 h-6 ml-1 ${cursorClassName}`}
        aria-hidden="true"
      />
    </p>
  );
}