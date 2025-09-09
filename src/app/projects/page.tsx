"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/data/projects";
import NeonText from "@/components/NeonText";

// MODIFIED: Changed "ML Project" to "Machine Learning"
const categories = ["Pinned", "Website", "Dashboard", "Machine Learning"];

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
    // MODIFIED: Updated this check to match the new category name
    if (activeCategory === "Machine Learning") {
      return project.category === "ML Project"; // Assuming data still uses "ML Project"
    }
    return project.category === activeCategory;
  });

  return (
    // MODIFIED: Reduced padding on mobile (p-4) and kept it larger for medium screens and up (md:p-8).
    <section className="p-4 md:p-8">
      {/* Header section with title and filters */}
      <div className="flex justify-between items-baseline mb-8 flex-wrap gap-4">
        <div>
          <div className="text-2xl md:text-3xl font-bold text-light">
            <NeonText>My Projects</NeonText>
          </div>
          <p className="text-gray-400 mt-2">
            Here are some of the things I&apos;ve built.
          </p>
        </div>
        
        {/* MODIFIED: Added 'flex-wrap' and 'gap-4' to allow filters to wrap on small screens. Removed 'space-x-4'. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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

              {/* MODIFIED: Hide the divider on mobile when buttons might wrap */}
              {index < categories.length - 1 && (
                <span className="text-gray-600 select-none hidden sm:inline">|</span>
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
        // MODIFIED: Reduced gap on mobile (gap-4) for a tighter layout.
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
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