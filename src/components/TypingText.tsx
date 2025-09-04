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
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startTyping = () => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false); // Typing is done
        }
      }, speed);
    };

    timeoutId = setTimeout(startTyping, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [text, delay, speed]);

  return (
    <p className={className}>
      {displayedText}
      <motion.span
        // The cursor blinks using a simple opacity animation that repeats forever
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        // The cursor is now an inline block, so it flows with the text
        className={`inline-block w-1 h-6 ml-1 ${cursorClassName}`}
        aria-hidden="true"
      />
    </p>
  );
}