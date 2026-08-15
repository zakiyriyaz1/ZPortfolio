"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { FaSun, FaMoon, FaFileDownload } from "react-icons/fa";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-loaded so the game's canvas code never lands in the initial bundle --
// it only downloads when someone actually clicks the logo.
const SpaceGame = dynamic(() => import("@/components/SpaceGame"), { ssr: false });

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume/ZAKIY RIYAZ - RESUME.pdf';
    link.download = 'ZAKIY RIYAZ - RESUME.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prevents hydration mismatch for the theme toggle icon
  if (!mounted) return <div className="h-[59px] w-full bg-light dark:bg-[#020403]"></div>;

  return (
    <motion.header
      className="relative z-20 w-full bg-light dark:bg-[#020403] text-dark dark:text-light p-3 px-6 flex justify-between items-center border-b-2 border-accent"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
    >
      {/* The logo launches the Z-WING game. Home is still reachable from the
          sidebar, so nothing is lost by repurposing it as the easter egg. */}
      <button
        onClick={() => setGameOpen(true)}
        aria-label="Play Z-WING"
        className="group relative flex items-center"
      >
        <motion.span
          className="font-cyber text-3xl text-accent cursor-pointer"
          style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }}
          whileHover={{
            scale: 1.05,
            textShadow: '0 0 20px rgba(34, 211, 238, 1)'
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Z
        </motion.span>
        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-70">
          play
        </span>
      </button>
      <div className="flex items-center space-x-5">
        <motion.button
          onClick={downloadResume}
          className="text-gray-500 dark:text-gray-400 hover:text-accent transition-colors duration-300 relative group flex items-center"
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Download Resume"
        >
          <span className="absolute -left-14 text-sm font-medium opacity-40 group-hover:opacity-100 transition-opacity duration-300">
            Resume
          </span>
          <FaFileDownload size={20} />
          {/* Neon glow effect */}
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-md group-hover:bg-accent/40 transition-all duration-300 opacity-0 group-hover:opacity-100" />
        </motion.button>
        <motion.button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-900 text-dark dark:text-light border-2 border-transparent hover:border-accent hover:shadow-cyan-glow transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
        </motion.button>
      </div>

      {gameOpen && <SpaceGame onClose={() => setGameOpen(false)} />}
    </motion.header>
  );
};

export default Header;