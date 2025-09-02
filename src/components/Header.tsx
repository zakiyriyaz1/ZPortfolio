// components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder or null to avoid layout shift
    return <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-black h-[73px]"></header>;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-black">
      <motion.h1 // <-- Change h1 to motion.h1
        className="text-2xl font-bold text-cyan-400 font-cyberpunk transition-all duration-300 cursor-pointer" // Added cursor-pointer
        initial={{ textShadow: '0 0 5px currentColor' }}
        whileHover={{ textShadow: '0 0 15px currentColor, 0 0 25px currentColor' }} // More intense glow on hover
        transition={{ duration: 0.3 }}
      >
        Personal Portfolio
      </motion.h1>
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-gray-100 focus:outline-none transition-colors duration-300 hover:bg-gray-700"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <FaMoon />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <FaSun className="text-yellow-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </header>
  );
};

export default Header;