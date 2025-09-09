"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NeonText from '@/components/NeonText';

// Dynamic import for the Particles component to ensure it's not server-side rendered.
const Particles = dynamic(() => import('@tsparticles/react'), {
  ssr: false,
});

export default function Home() {
  const [init, setInit] = useState(false);

  // Initialize the tsParticles engine once on component mount.
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
        // MODIFIED: Particle count restored to 200 as requested.
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

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Conditionally render Particles only when the engine is initialized. */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center text-center">

        {/* Profile picture container */}
        <motion.div
          className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-accent shadow-lg shadow-accent/50 mt-12 mb-6 md:mt-5 md:mb-10 overflow-hidden bg-dark/30 backdrop-blur-sm relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: [1.1, 1.03, 1.1],
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
        >
          <Image
            src="/images/Screenshot_20250907_230028_Gallery.jpg"
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
            priority
          />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white">
          Zakiy Riyaz
        </h1>

        <div className="mt-4">
          <NeonText className="text-2xl md:text-4xl">Data Scientist</NeonText>
        </div>

        <p className="mt-6 max-w-sm md:max-w-xl text-lg text-gray-300">
          I specialize in uncovering the stories hidden within data and building modern, engaging web experiences.
        </p>

        {/* Buttons now stack on mobile (flex-col) and are side-by-side on larger screens (sm:flex-row). */}
        <div className="mt-8 flex w-full max-w-xs sm:max-w-none sm:w-auto flex-col sm:flex-row items-center gap-4">
          <Link href="/projects" className="w-full sm:w-auto">
            <motion.button
              className="w-full sm:w-auto px-7 py-3 font-bold rounded-md bg-transparent text-white border-2 border-white"
              style={{
                boxShadow: "0 0 8px #fff, inset 0 0 8px #fff",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 12px #fff, inset 0 0 12px #fff" }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.button>
          </Link>

          <Link href="/contact" className="w-full sm:w-auto">
            <motion.button
              className="w-full sm:w-auto px-8 py-3.5 font-bold rounded-md bg-accent text-dark hover:bg-accent/80 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me!
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}