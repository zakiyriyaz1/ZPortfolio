"use client";

import NeonText from '@/components/NeonText';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from "framer-motion"; 
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

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
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        repulse: {
          distance: 80,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#22d3ee",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 200,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  }), []);

  if (!init) {
    return null;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center -m-8">
      <Particles
        id="tsparticles"
        options={particlesOptions}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      
      {/* CHANGE: Added pt-16 (padding-top) to this container to push content down */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 pt-16">
        
        <motion.div
          className="w-48 h-48 rounded-full border-2 border-accent shadow-lg shadow-accent/50 mb-10 bg-dark/30 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: [1, 1.03, 1],
          }}
          transition={{ 
            delay: 0.2, 
            duration: 0.5,
            scale: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />

        <h1 className="text-5xl md:text-7xl font-bold text-white">
          Zakiy Riyaz
        </h1>
        
        <div className="mt-4">
          <NeonText>Data Scientist</NeonText>
        </div>

        <p className="mt-6 max-w-xl text-lg text-gray-300">
          I specialize in uncovering the stories hidden within data and building modern, engaging web experiences.
        </p>
        
        <div className="mt-8">
          <Link href="/projects">
            <button className="px-8 py-3 font-semibold rounded-md bg-accent text-dark hover:bg-accent/80 transition-colors duration-300">
              View My Work
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}