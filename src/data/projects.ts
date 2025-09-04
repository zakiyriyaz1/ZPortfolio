// src/data/projects.ts

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  longDescription: string;
  githubUrl: string;
};

// "export" has been removed from this line
const projectsData: Project[] = [
  {
    id: "project-1",
    title: "E-commerce Platform",
    description: "A full-stack e-commerce website with Next.js and Stripe.",
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    coverImage: "https://picsum.photos/seed/project1/1200/800",
    longDescription: "This was a comprehensive project aimed at building a feature-rich e-commerce platform...",
    githubUrl: "https://github.com",
  },
  {
    id: "project-2",
    title: "AI Chatbot",
    description: "An intelligent chatbot using the OpenAI API.",
    tags: ["React", "Node.js", "OpenAI", "Socket.io"],
    coverImage: "https://picsum.photos/seed/project2/1200/800",
    longDescription: "This project leverages the power of OpenAI's GPT models to create a smart, conversational AI...",
    githubUrl: "https://github.com",
  },
  {
    id: "project-3",
    title: "Data Visualization Dashboard",
    description: "A dashboard for visualizing sales data with D3.js.",
    tags: ["React", "D3.js", "SASS"],
    coverImage: "https://picsum.photos/seed/project3/1200/800",
    longDescription: "A powerful data visualization tool that transforms raw sales data into insightful charts and graphs...",
    githubUrl: "https://github.com",
  },
  {
    id: "project-4",
    title: "Mobile Fitness App",
    description: "A cross-platform mobile app for tracking workouts.",
    tags: ["React Native", "Firebase", "GraphQL"],
    coverImage: "https://picsum.photos/seed/project4/1200/800",
    longDescription: "This mobile application, built with React Native, allows users to track their fitness goals...",
    githubUrl: "https://github.com",
  },
];

// This is the new line that makes it a default export
export default projectsData;