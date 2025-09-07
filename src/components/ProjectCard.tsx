"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Project } from "@/data/projects";
import { FaGithub } from "react-icons/fa";

interface ProjectCardProps {
  project: Project;
  isSelected?: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isSelected = false, onClick }) => {
  const { id, title, description, tags, coverImage, longDescription, githubUrl, liveUrl } = project;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  return (
    <motion.div
      layoutId={id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: isSelected ? 0 : rotateX,
        rotateY: isSelected ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={!isSelected ? { 
        scale: 1.03, 
        boxShadow: "0 0 30px rgba(34, 211, 238, 0.8)" 
      } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      // === THE FIX IS HERE ===
      // h-auto on mobile, h-[180px] on medium screens and up
      className={`relative rounded-2xl flex flex-col ${isSelected ? 'w-full max-w-3xl h-auto overflow-hidden cursor-default' : 'bg-[#141921] h-auto md:h-[180px] cursor-pointer'}`}
    >
      {!isSelected ? (
        // Small Card View
        <div className="p-8 flex flex-col flex-grow" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-xl font-bold text-light mb-2">{title}</h3>
          <p className="text-[#707886] mb-6 line-clamp-2 flex-grow">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-[#122934] text-[#00d5f5] text-xs font-bold px-3 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        // Expanded Modal View
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="h-auto max-h-[90vh] overflow-y-auto"
        >
          <img src={coverImage} alt={title} className="w-full h-64 object-cover" />
          <div className="p-6 bg-[#141921]">
            <h2 className="text-3xl font-bold text-accent" style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.8)' }}>{title}</h2>
            <div className="flex flex-wrap gap-2 my-4">
              {tags.map((tag) => (
                <span key={tag} className="bg-[#122934] text-[#00d5f5] text-xs font-bold px-3 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-300 mb-6">{longDescription}</p>
            <div className="flex space-x-4">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-md bg-accent text-dark hover:bg-accent/80 transition-colors">
                <FaGithub />
                View on GitHub
              </a>
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-md bg-gray-700 text-light hover:bg-gray-600 transition-colors">
                  View Live
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectCard;
