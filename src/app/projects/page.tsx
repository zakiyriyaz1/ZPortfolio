// src/app/projects/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/data/projects";
import NeonText from "@/components/NeonText";

const categories = ["Pinned", "Website", "Dashboard", "ML Project"];

// Your original animation variants
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Pinned");

  const selectedProject = projectsData.find(p => p.id === selectedId);

  const filteredProjects = projectsData.filter(project => {
    if (activeCategory === "Pinned") {
      return project.pinned;
    }
    return project.category === activeCategory;
  });

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <NeonText>My Projects</NeonText>
          <p className="text-gray-400 mt-4">
            Here are some of the things I've built.
          </p>
        </div>
        <div className="flex space-x-2 p-1 bg-[#141921] rounded-lg">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${activeCategory === category ? 'bg-accent text-dark' : 'text-gray-400 hover:bg-gray-700/50'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={activeCategory} // Add key to re-trigger animation on filter change
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {filteredProjects.map((project) => (
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ProjectCard 
                project={selectedProject} 
                isSelected={true}
                onClick={() => setSelectedId(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}