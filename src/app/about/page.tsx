"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import NeonText from "@/components/NeonText";
import AutoScroller from "@/components/AutoScroller";
import TypingText from "@/components/TypingText";

// Icon Imports (assuming they are in the same file)
import { FaPython, FaJava, FaHtml5, FaCss3Alt, FaJsSquare, FaGithub } from "react-icons/fa";
import { SiCplusplus, SiR, SiTableau, SiGooglecolab, SiNextdotjs } from "react-icons/si";
import { BsFiletypeSql, BsBarChartFill } from "react-icons/bs";

// --- Data Arrays ---
const languages = [
  { name: "Python", icon: <FaPython size={40} /> },
  { name: "Next.js", icon: <SiNextdotjs size={40} /> },
  { name: "JavaScript", icon: <FaJsSquare size={40} /> },
  { name: "Java", icon: <FaJava size={40} /> },
  { name: "R", icon: <SiR size={40} /> },
  { name: "SQL", icon: <BsFiletypeSql size={40} /> },
  { name: "C++", icon: <SiCplusplus size={40} /> },
  {
    name: "HTML/CSS",
    icon: (
      <div className="flex gap-2">
        <FaHtml5 size={30} />
        <FaCss3Alt size={30} />
      </div>
    ),
  },
];

const tools = [
  { name: "Power BI", icon: <BsBarChartFill size={40} /> },
  { name: "Tableau", icon: <SiTableau size={40} /> },
  { name: "GitHub", icon: <FaGithub size={40} /> },
  { name: "Colabs", icon: <SiGooglecolab size={40} /> },
];

const allSkills = [...languages, ...tools];

export default function AboutPage() {
  const [isPaused, setIsPaused] = useState(false);

  const introText = "Hello! I'm Zakiy.";
  const bioText = `I  am a recent Data Science graduate with a knack for turning complex data into stories that make sense.\n\nWhether it's building sleek dashboards, crafting intuitive websites, or exploring side projects, I enjoy creating solutions that don't just look good—but actually drive insight and impact.\n\nBeyond the numbers, I'm fueled by a love for philosophy, global politics, and the arts—music, poetry, and literature. These interests shape how I approach problems: technical yet human, analytical yet creative.`;

  return (
    <section className="p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-16 items-start">
        {/* Left Column: Bio and Title */}
        <div className="space-y-6">
          <NeonText>About Me</NeonText>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <p className="text-gray-300 text-xl font-bold">{introText}</p>
            
            {/* MODIFIED: New container to handle layout stability */}
            <div className="relative">
              {/* 1. Invisible text that sets the final height of the container */}
              <p className="text-gray-300 text-lg whitespace-pre-wrap leading-relaxed opacity-0 pointer-events-none">
                {bioText}
              </p>
              
              {/* 2. The typing animation is absolutely positioned on top */}
              <div className="absolute top-0 left-0 w-full h-full">
                <TypingText
                  text={bioText}
                  delay={0.5}
                  speed={20}
                  className="text-gray-300 text-lg whitespace-pre-wrap leading-relaxed"
                  cursorClassName="bg-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Auto-scrolling Skills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div
            className="h-[350px] md:h-[500px] overflow-hidden px-4"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AutoScroller skills={allSkills} duration={10} isPaused={isPaused} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}