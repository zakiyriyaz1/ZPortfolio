// app/projects/page.tsx
import NeonText from '@/components/NeonText';
import ProjectCard from '@/components/ProjectCard';
import React from 'react';

const projects = [
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce website built with Next.js and Stripe for payments.',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
  },
  {
    title: 'AI Chatbot',
    description: 'An intelligent chatbot using the OpenAI API with a real-time chat interface.',
    tags: ['React', 'Node.js', 'OpenAI', 'Socket.io'],
  },
  {
    title: 'Data Visualization Dashboard',
    description: 'A dashboard for visualizing sales data, built with D3.js and React.',
    tags: ['React', 'D3.js', 'SASS'],
  },
  {
    title: 'Mobile Fitness App',
    description: 'A cross-platform mobile app for tracking workouts and nutrition.',
    tags: ['React Native', 'Firebase', 'GraphQL'],
  },
];

export default function ProjectsPage() {
  return (
    <div>
      <NeonText>My Projects</NeonText>
      <p className="mt-4 text-gray-300">Here are some of the things I've built.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            tags={project.tags}
          />
        ))}
      </div>
    </div>
  );
}