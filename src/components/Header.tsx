// src/components/Header.tsx
"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { FaSun, FaMoon, FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-[84px]"></div>; // Placeholder to prevent layout shift

  return (
    <motion.header
      className="w-full bg-trueBlack text-light p-4 px-8 flex justify-between items-center border-b-2 border-accent"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
    >
      <Link href="/">
        <motion.h1
          className="font-cyber text-4xl text-accent cursor-pointer"
          style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }} // Added neon glow
          whileHover={{ 
            scale: 1.05,
            textShadow: '0 0 20px rgba(34, 211, 238, 1)' // Intensify glow on hover
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Z
        </motion.h1>
      </Link>
      <div className="flex items-center space-x-6">
        {/* GitHub Link */}
        <motion.a
          href="https://github.com" // Replace with your actual GitHub link
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-accent transition-colors duration-300"
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaGithub size={24} />
        </motion.a>

        {/* LinkedIn Link */}
        <motion.a
          href="https://linkedin.com" // Replace with your actual LinkedIn link
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-accent transition-colors duration-300"
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaLinkedin size={24} />
        </motion.a>

        {/* Theme Toggle */}
        <motion.button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full bg-gray-900 text-light border-2 border-transparent hover:border-accent hover:shadow-cyan-glow transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;