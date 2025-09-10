"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Project } from "@/data/projects";
import { FaGithub } from "react-icons/fa";
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  isSelected?: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isSelected = false, onClick }) => {
  const { id, title, description, tags, coverImage, longDescription, githubUrl } = project;

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

  // Smart truncation function for consistent description lengths
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    
    // Find the last space before the maxLength to avoid cutting words
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + "..." : truncated + "...";
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
      className={`relative rounded-2xl flex flex-col ${isSelected ? 'w-full max-w-4xl mx-auto h-auto overflow-hidden cursor-default' : 'bg-[#141921] h-auto md:h-[180px] cursor-pointer'}`}
    >
      {!isSelected ? (
        // Small Card View
        <div className="p-6 sm:p-8 flex flex-col flex-grow h-full" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-lg sm:text-xl font-bold text-light mb-2 flex-shrink-0">{title}</h3>
          
          {/* Improved description with consistent 2-line display */}
          <div className="text-[#707886] mb-4 sm:mb-6 flex-grow text-sm sm:text-base">
            <p className="line-clamp-2 leading-tight" style={{ 
              height: '2.5rem', 
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {truncateDescription(description, 100)}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            {tags.map((tag) => (
              <span key={tag} className="bg-[#122934] text-[#00d5f5] text-xs font-bold px-3 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        // Expanded Modal View - Consistent Width
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="h-auto max-h-[90vh] overflow-hidden flex flex-col w-full"
          style={{ width: '100%', maxWidth: '64rem' }} // Consistent expanded width
        >
          {/* Increased Image Height Section */}
          <div className="flex-shrink-0">
            <Image
              src={coverImage}
              alt={title}
              width={1200}
              height={400}
              className="w-full h-32 sm:h-40 md:h-48 object-cover" // Increased from h-24/h-28/h-32
            />
          </div>
          
          {/* Content Section with Reduced Text Area Height */}
          <div className="flex-1 bg-[#141921] flex flex-col min-h-0">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 flex-shrink-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-accent mb-3" style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.8)' }}>
                {title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="bg-[#122934] text-[#00d5f5] text-xs font-bold px-3 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Reduced Height Scrollable Text Area */}
            <div className="flex-1 px-4 sm:px-6 pb-2 overflow-hidden flex flex-col min-h-0" style={{ minHeight: '200px' }}> {/* Reduced from 300px */}
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 py-4">
                <div className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap min-h-full">
                  {longDescription}
                  {/* Add extra spacing for better scrolling experience */}
                  <div className="h-8"></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced GitHub Button Section */}
            <div className="px-4 sm:px-6 py-4 bg-gradient-to-t from-[#0f1419] to-[#141921] border-t border-gray-700/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg bg-accent text-dark hover:bg-accent/80 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaGithub className="text-lg" />
                  View on GitHub
                </a>
                
                {/* Enhanced Visual Element */}
                <div className="text-xs text-gray-500 hidden sm:block">
                  Click outside to close
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectCard;