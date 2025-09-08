"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from "framer-motion";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NeonText from '@/components/NeonText';

// Dynamic import for the Particles component
const Particles = dynamic(() => import('@tsparticles/react'), {
  ssr: false,
});

// TileText component (unchanged)
const TileText = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(' ');
  const parentVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const wordVariants: Variants = { hidden: { opacity: 0, y: 50, rotateX: 90 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } } };
  return (
    <motion.h1 className={`text-5xl md:text-7xl font-bold text-white whitespace-nowrap ${className}`} variants={parentVariants} initial="hidden" animate="visible">
      {words.map((word, i) => (
        <motion.span key={i} className="inline-block mr-2 overflow-hidden" variants={wordVariants}>
          {word.split('').map((letter, j) => (<motion.span key={j} className="inline-block">{letter}</motion.span>))}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// SpaceStars component restored to use vw/vh for the better visual effect
const SpaceStars = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; brightness: number; speed: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 120 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        brightness: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
      }));
      setStars(newStars);
    };
    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-cyan-900/5 to-teal-900/8" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/6 via-blue-500/3 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-teal-500/6 via-cyan-500/3 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{ width: star.size, height: star.size, opacity: star.brightness, filter: `brightness(${star.brightness + 0.5})` }}
          initial={{ x: `${star.x}vw`, y: `${star.y}vh` }}
          animate={{
            x: [`${star.x}vw`, `${star.x + 8}vw`, `${star.x - 4}vw`, `${star.x}vw`],
            y: [`${star.y}vh`, `${star.y - 6}vh`, `${star.y + 10}vh`, `${star.y}vh`],
            scale: [1, 1.2, 0.8, 1],
            opacity: [star.brightness, star.brightness + 0.3, star.brightness - 0.1, star.brightness],
          }}
          transition={{ duration: 25 + star.speed * 10, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 5 }}
        />
      ))}
      {Array.from({ length: 4 }).map((_, i) => {
        const startSide = Math.floor(Math.random() * 4);
        const speed = 3 + Math.random() * 4;
        const delay = i * 8 + Math.random() * 10;
        let startPos, endPos;
        switch(startSide) {
          case 0: startPos = { x: `${Math.random() * 100}vw`, y: '-5vh' }; endPos = { x: `${Math.random() * 100}vw`, y: '105vh' }; break;
          case 1: startPos = { x: '105vw', y: `${Math.random() * 100}vh` }; endPos = { x: '-5vw', y: `${Math.random() * 100}vh` }; break;
          case 2: startPos = { x: `${Math.random() * 100}vw`, y: '105vh' }; endPos = { x: `${Math.random() * 100}vw`, y: '-5vh' }; break;
          default: startPos = { x: '-5vw', y: `${Math.random() * 100}vh` }; endPos = { x: '105vw', y: `${Math.random() * 100}vh` };
        }
        return (
          <motion.div
            key={`shooting-${i}`}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full"
            style={{ boxShadow: '0 0 8px #22d3ee, 0 0 16px #22d3ee, 0 0 24px #22d3ee' }}
            initial={{ x: startPos.x, y: startPos.y, opacity: 0 }}
            animate={{ x: endPos.x, y: endPos.y, opacity: [0, 1, 1, 0] }}
            transition={{ duration: speed, repeat: Infinity, delay: delay, ease: "easeOut" }}
          ><div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent w-16 h-0.5 -translate-y-0.5" /></motion.div>
        );
      })}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={`twinkle-${i}`}
          className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions: ISourceOptions = useMemo(() => ({
    fpsLimit: 120,
    interactivity: { events: { onHover: { enable: true, mode: "bubble" } }, modes: { bubble: { distance: 120, size: 4, duration: 2, opacity: 0.8 } } },
    particles: {
      color: { value: ["#ffffff", "#22d3ee", "#3b82f6", "#06b6d4"] },
      move: { direction: "none", enable: true, outModes: { default: "out" }, random: true, speed: 0.4, straight: false },
      number: { density: { enable: true }, value: 60 },
      opacity: { value: { min: 0.1, max: 0.6 }, animation: { enable: true, speed: 0.5, minimumValue: 0.1 } },
      shape: { type: "circle" },
      size: { value: { min: 0.5, max: 2 }, animation: { enable: true, speed: 1, minimumValue: 0.5 } },
    },
    detectRetina: true,
  }), []);

  return (
    // --- NEW, ROBUST STRUCTURE ---

    // 1. A simple container that fills the available space from your layout.
    <div className="relative w-full h-full">

      {/* 2. A dedicated "canvas" for the background. It's clipped perfectly to the container's size. */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <SpaceStars />
        {init && (
          <Particles
            id="tsparticles"
            options={particlesOptions}
            className="absolute inset-0 z-0 pointer-events-none"
          />
        )}
      </div>

      {/* 3. The foreground content, centered and layered on top of the background canvas. */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-8">
        
        <motion.div
          className="w-44 h-44 rounded-full border-2 border-accent shadow-xl shadow-accent/60 mb-10 overflow-hidden bg-dark/20 backdrop-blur-sm relative"
          initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
          animate={{ opacity: 1, scale: [1.1, 1.03, 1.1], rotateY: 0 }}
          transition={{ delay: 0.3, duration: 0.8, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          whileHover={{ scale: 1.15, boxShadow: "0 0 40px rgba(34, 211, 238, 0.8)", transition: { duration: 0.3 } }}
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-accent via-cyan-400 to-accent rounded-full opacity-30 blur-md animate-pulse" />
          <Image src="/images/Screenshot_20250907_230028_Gallery.jpg" alt="Profile Picture" layout="fill" objectFit="cover" className="rounded-full relative z-10" />
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`profile-particle-${i}`}
              className="absolute w-1 h-1 bg-accent rounded-full"
              style={{ top: `${20 + Math.sin(i * 0.8) * 60}%`, left: `${20 + Math.cos(i * 0.8) * 60}%` }}
              animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3], x: [0, Math.cos(i * 2) * 10, 0], y: [0, Math.sin(i * 2) * 10, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>

        <TileText text="Zakiy Riyaz" />

        <motion.div className="mt-4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 0.6 }}>
          <NeonText className="text-3xl md:text-4xl">Data Scientist</NeonText>
        </motion.div>

        <motion.p className="mt-6 max-w-xl text-lg text-gray-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}>
          I specialize in uncovering the stories hidden within data and building modern, engaging web experiences.
        </motion.p>

        <motion.div className="mt-8 flex gap-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }}>
          <Link href="/projects">
            <motion.button className="px-7 py-3 font-bold rounded-md bg-transparent text-white border-2 border-white backdrop-blur-sm relative overflow-hidden group" style={{ boxShadow: "0 0 8px #fff, inset 0 0 8px #fff" }} whileHover={{ scale: 1.05, boxShadow: "0 0 20px #fff, inset 0 0 20px #fff, 0 0 40px rgba(255,255,255,0.3)" }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7, duration: 0.4 }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">View My Work</span>
            </motion.button>
          </Link>
          <Link href="/contact">
            <motion.button className="px-8 py-3.5 font-bold rounded-md bg-accent text-dark hover:bg-accent/80 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-accent/30" whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 211, 238, 0.6), 0 0 60px rgba(34, 211, 238, 0.3)" }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: 0.4 }}>
              <motion.div className="absolute inset-0 bg-accent/20 rounded-md" animate={{ scale: [1, 1.1, 1], opacity: [0, 0.3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 2 }} />
              <span className="relative z-10">Contact Me!</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}