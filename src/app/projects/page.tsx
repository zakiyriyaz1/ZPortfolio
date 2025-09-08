"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/data/projects";
import NeonText from "@/components/NeonText";

const categories = ["Pinned", "Website", "Dashboard", "ML Project"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
      {/* Header section with title and filters */}
      <div className="flex justify-between items-baseline mb-8 flex-wrap gap-4">
        <div>
          {/* The h1 tag has been changed to a div to fix the nesting error */}
          <div className="text-2xl md:text-3xl font-bold text-light">
            <NeonText>My Projects</NeonText>
          </div>
          <p className="text-gray-400 mt-2">
            Here are some of the things I&apos;ve built.
          </p>
        </div>
        
        {/* Filter buttons */}
        <div className="flex items-center space-x-4">
          {categories.map((category, index) => (
            <React.Fragment key={category}>
              <button
                onClick={() => setActiveCategory(category)}
                className="relative py-1 text-sm transition-colors duration-300 focus:outline-none"
              >
                <span className={`flex items-center 
                  ${activeCategory === category ? 'font-bold text-accent' : 'font-semibold text-gray-500 hover:text-accent'}`
                }>
                  {category}
                </span>
                
                {activeCategory === category && (
                  <motion.div 
                    className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-accent"
                    layoutId="active-filter-underline"
                    style={{ filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.7))' }}
                  />
                )}
              </button>

              {index < categories.length - 1 && (
                <span className="text-gray-600 select-none">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Grid for project cards */}
      <motion.div
        key={activeCategory}
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

      {/* Modal for selected project */}
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

