// src/app/page.tsx
import NeonText from '@/components/NeonText';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      
      {/* Profile Picture Placeholder (Stable Version) */}
      <div 
        className="w-48 h-48 rounded-full bg-[#141921] border-2 border-accent mb-8 shadow-cyan-glow"
      />

      <h1 className="text-5xl md:text-7xl font-bold">
        Zakiy Riyaz
      </h1>
      
      <div className="mt-4">
        <NeonText>A Creative Developer</NeonText>
      </div>

      <p className="mt-6 max-w-xl text-lg text-gray-300">
        I specialize in building modern, responsive, and engaging web experiences. Welcome to my corner of the internet.
      </p>
      
      <div className="mt-8">
        <Link href="/projects">
          <button className="px-8 py-3 font-semibold rounded-md bg-accent text-dark hover:bg-accent/80 transition-colors duration-300">
            View My Work
          </button>
        </Link>
      </div>
    </div>
  );
}