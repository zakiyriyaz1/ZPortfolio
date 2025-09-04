// src/app/page.tsx
import NeonText from '@/components/NeonText';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-5xl md:text-7xl font-bold">
        Hi, I'm Zaky
      </h1>
      
      <div className="mt-4">
        <NeonText>A Creative Developer</NeonText>
      </div>

      <p className="mt-6 max-w-xl text-lg text-gray-300">
        I specialize in building modern, responsive, and engaging web experiences. Welcome to my corner of the internet.
      </p>
      
      <div className="mt-8">
        <Link href="/projects">
          <span className="px-8 py-3 font-semibold rounded-md bg-cyan-500 text-black hover:bg-cyan-400 transition-colors duration-300">
            View My Work
          </span>
        </Link>
      </div>
    </div>
  );
}