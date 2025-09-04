// src/app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import NeonText from "@/components/NeonText";
import { FaReact, FaNodeJs, FaAws } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiMongodb, SiPostgresql } from "react-icons/si";

const skills = [
  { name: "React", icon: <FaReact size={40} /> },
  { name: "Next.js", icon: <SiNextdotjs size={40} /> },
  { name: "Node.js", icon: <FaNodeJs size={40} /> },
  { name: "TypeScript", icon: <SiTypescript size={40} /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss size={40} /> },
  { name: "MongoDB", icon: <SiMongodb size={40} /> },
  { name: "PostgreSQL", icon: <SiPostgresql size={40} /> },
  { name: "AWS", icon: <FaAws size={40} /> },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export default function AboutPage() {
  return (
    <section className="p-8">
      <NeonText>About Me</NeonText>
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Column: Bio */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-gray-300 space-y-4 text-lg"
        >
          <p>
            Hello! I'm Zakiy, a creative developer with a passion for building beautiful, high-performance web applications. My journey into the world of code began with a fascination for how things work, and it has evolved into a career dedicated to crafting seamless digital experiences.
          </p>
          <p>
            I specialize in the modern JavaScript ecosystem, with a strong focus on React and Next.js. Whether it's a dynamic user interface or a robust back-end, I thrive on solving complex problems and turning ideas into reality.
          </p>
          <p>
            When I'm not coding, you can find me exploring the latest tech trends, contributing to open-source projects, or searching for the best cup of coffee.
          </p>
        </motion.div>

        {/* Right Column: Skills */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 sm:grid-cols-4 gap-6"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              whileHover={{ scale: 1.1, y: -5, color: '#22d3ee', filter: 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.8))' }}
              className="flex flex-col items-center justify-center p-4 bg-[#141921] rounded-xl text-gray-400 transition-colors duration-300"
            >
              {skill.icon}
              <span className="mt-2 text-sm font-semibold">{skill.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}