'use client'; // This makes the component interactive

import NeonText from '@/components/NeonText';
import ProjectCard from '@/components/ProjectCard';
import React, from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Updated projects array with unique IDs for animation
const projects = [
  {
    id: 'ecommerce-platform',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce website with Next.js and Stripe.',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
    coverImage: 'https://placehold.co/1200x800/111827/22d3ee?text=E-commerce+Platform',
    longDescription: 'This project is a complete e-commerce solution featuring product listings, a shopping cart, user authentication, and secure payment processing with Stripe. It was built with a focus on performance and a clean user experience.',
    githubUrl: '#',
  },
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot',
    description: 'An intelligent chatbot using the OpenAI API.',
    tags: ['React', 'Node.js', 'OpenAI', 'Socket.io'],
    coverImage: 'https://placehold.co/1200x800/111827/22d3ee?text=AI+Chatbot',
    longDescription: 'This chatbot leverages the power of the OpenAI API to provide intelligent, human-like responses. It features a real-time chat interface built with Socket.io for instant communication.',
    githubUrl: '#',
  },
  {
    id: 'data-visualization-dashboard',
    title: 'Data Visualization Dashboard',
    description: 'A dashboard for visualizing sales data, built with D3.js and React.',
    tags: ['React', 'D3.js', 'SASS'],
    coverImage: 'https://placehold.co/1200x800/111827/22d3ee?text=Data+Dashboard',
    longDescription: 'This project is a data visualization dashboard that allows users to explore sales data through interactive charts and graphs. It was built with D3.js for powerful data manipulation and visualization capabilities.',
    githubUrl: '#', 
  },
  {
    id: 'mobile-fitness-app',
    title: 'Mobile Fitness App',
    description: 'A cross-platform mobile app for tracking workouts and nutrition.',
    tags: ['React Native', 'Firebase', 'GraphQL'],
    coverImage: 'https://placehold.co/1200x800/111827/22d3ee?text=Mobile+Fitness+App',
    longDescription: 'This project is a mobile fitness app that helps users track their workouts and nutrition. It was built with React Native for cross-platform compatibility and uses Firebase for real-time data storage.',
    githubUrl: '#'
  },
];

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedId);

  return (
    <div>
      <NeonText>My Projects</NeonText>
      <p className="mt-4 text-gray-400">Here are some of the things I've built.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
      style={{ perspective: '1000px' }} // <-- ADD THIS LINE
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedId(project.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedId && selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)} // Close by clicking the background
          >
            {/* This inner div stops the click from propagating to the background */}
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl">
              <ProjectCard
                project={selectedProject}
                isSelected={true}
                onClick={() => setSelectedId(null)} // Pass the close function
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

