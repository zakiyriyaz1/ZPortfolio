// components/ProjectCard.tsx
import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
}

const ProjectCard = ({ title, description, tags }: ProjectCardProps) => {
  return (
    <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 transition-all duration-300 hover:border-cyan-400/50 hover:bg-gray-800/80">
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
  );
};

export default ProjectCard;