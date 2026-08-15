// src/components/StatusBar.tsx
"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const StatusBar = () => {
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDay(now.toLocaleDateString([], { weekday: 'short' }));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const currentPage = pathname === '/' ? '/home' : pathname;

  // Baked in at build time by next.config.mjs. Hovering shows the exact build
  // timestamp, which changes on every deploy even when the version doesn't.
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;

  return (
    <footer className="w-full h-7 bg-trueBlack/80 backdrop-blur-sm text-cyan-300 px-4 flex justify-between items-center text-xs italic lowercase">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div>
          <span>last updated: sep 2025</span>
        </div>
        <div>
          <span>page: {currentPage}</span>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {version && (
          <span
            className="opacity-70"
            title={buildTime ? `built ${buildTime}` : undefined}
          >
            v{version}
          </span>
        )}
        <span>{day}</span>
        <span>{time}</span>
      </div>
    </footer>
  );
};

export default StatusBar;