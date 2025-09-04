// src/app/projects/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/data/projects";
import NeonText from "@/components/NeonText";

// Animation variants for the container to orchestrate the stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for each individual card
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProject = projectsData.find(p => p.id === selectedId);

  return (
    <section className="p-8">
      <NeonText>My Projects</NeonText>
      <p className="text-gray-400 mt-4 mb-8">
        Here are some of the things I've built.
      </p>

      {/* The motion.div now orchestrates the animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {projectsData.map((project) => (
          // Each card is now a motion.div with its own animation variant
          <motion.div key={project.id} variants={itemVariants}>
            <ProjectCard 
              project={project}
              onClick={() => setSelectedId(project.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <ProjectCard 
              project={selectedProject} 
              isSelected={true}
              onClick={() => setSelectedId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}