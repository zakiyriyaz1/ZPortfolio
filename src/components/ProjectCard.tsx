// components/ProjectCard.tsx
'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaGithub, FaTimes } from 'react-icons/fa';

// Define a type for a single project
type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  longDescription: string;
  githubUrl: string;
};

interface ProjectCardProps {
  project: Project;
  isSelected?: boolean;
  onClick: () => void;
}

const ProjectCard = ({ project, isSelected = false, onClick }: ProjectCardProps) => {
  const { title, description, tags, coverImage, longDescription, githubUrl, id } = project;

  // --- START OF CHANGES ---

  // 3D Tilt Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // We are now using the raw motion values directly for an instant response
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  // --- END OF CHANGES ---

  return (
    <motion.div
      layoutId={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isSelected ? 0 : rotateX,
        rotateY: isSelected ? 0 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      // Added a simple transition for smoothness when the mouse leaves
      className={`relative p-6 rounded-xl bg-gray-800/50 border border-gray-700 transition-transform duration-300 ease-out ${!isSelected && 'cursor-pointer hover:border-cyan-400/50 hover:bg-gray-800/80'}`}
    >
      {!isSelected ? (
        // Small Card View
        <div style={{ transform: 'translateZ(20px)' }}>
          <h3 className="text-xl font-bold text-gray-100">{title}</h3>
          <p className="mt-2 text-gray-400">{description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs font-medium rounded bg-cyan-500/10 text-cyan-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        // Expanded Card View
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-col h-[70vh] md:h-auto md:max-h-[80vh] overflow-y-auto"
        >
          <button onClick={onClick} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
            <FaTimes size={24} />
          </button>
          <img src={coverImage} alt={title} className="w-full h-64 object-cover rounded-t-lg" />
          <div className="p-6 bg-gray-900 rounded-b-lg">
            <h2 className="text-3xl font-bold text-cyan-400">{title}</h2>
            <div className="flex flex-wrap gap-2 my-4">
              {tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs font-medium rounded bg-cyan-500/10 text-cyan-400">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-300 mb-6">{longDescription}</p>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-md bg-cyan-500 text-black hover:bg-cyan-400 transition-colors">
              <FaGithub />
              View on GitHub
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectCard;

