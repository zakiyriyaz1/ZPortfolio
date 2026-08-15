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
  // Track how many characters are revealed, and derive the string from that.
  //
  // This used to accumulate instead (setDisplayedText(prev => prev + char)),
  // which is fragile: the displayed string was built from a running total, so
  // any hiccup in timing permanently corrupted it -- a dropped tick lost a
  // character forever ("I am" typing out as "Iam"), and a leftover interval
  // from a previous mount appended a second stream of characters into the same
  // string (producing garbled text like "knack ffrrturning" mid-sentence).
  //
  // Deriving from an index makes both impossible: the rendered text is always
  // exactly text.slice(0, n), so it can only ever be a correct prefix no matter
  // how irregularly the timer fires.
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);

    // Tracked out here so the cleanup below can actually clear it. Previously
    // the clearInterval was returned from inside the setTimeout callback, where
    // a returned function is discarded -- so the interval outlived unmount.
    let typingInterval: ReturnType<typeof setInterval> | undefined;

    const timeoutId = setTimeout(() => {
      typingInterval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            if (typingInterval) clearInterval(typingInterval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [text, delay, speed]);

  return (
    <p className={className}>
      {text.slice(0, count)}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className={`inline-block w-1 h-6 ml-1 ${cursorClassName}`}
        aria-hidden="true"
      />
    </p>
  );
}
