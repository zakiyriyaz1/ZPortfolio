// src/data/projects.ts

export type Project = {
  id: string;
  title: string;
  category: 'Website' | 'Dashboard' | 'ML Project';
  pinned: boolean;
  description: string;
  tags: string[]; // This should match what ProjectCard.tsx expects
  coverImage: string;
  longDescription: string;
  githubUrl: string;
  liveUrl?: string; // Optional live URL
};

const projectsData: Project[] = [
  {
    id: "project-1",
    title: "E-commerce Platform",
    category: 'Website',
    pinned: true, // This project will show in the "Pinned" tab
    description: "A full-stack e-commerce website with Next.js and Stripe.",
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    coverImage: "https://picsum.photos/seed/project1/1200/800",
    longDescription: "This was a comprehensive project aimed at building a feature-rich e-commerce platform. It includes user authentication, product catalogs, a shopping cart, and a secure checkout process powered by Stripe. The entire frontend is built with Next.js for optimal performance.",
    githubUrl: "https://github.com",
    liveUrl: "#",
  },
  {
    id: "project-2",
    title: "AI Chatbot",
    category: 'ML Project',
    pinned: true, // This project will also show in the "Pinned" tab
    description: "An intelligent chatbot using the OpenAI API.",
    tags: ["React", "Node.js", "OpenAI", "Socket.io"],
    coverImage: "https://picsum.photos/seed/project2/1200/800",
    longDescription: "This project leverages the power of OpenAI's GPT models to create a smart, conversational AI. It features a real-time chat interface built with Socket.io and a Node.js backend to handle API requests securely and efficiently.",
    githubUrl: "https://github.com",
  },
  {
    id: "project-3",
    title: "Data Visualization Dashboard",
    category: 'Dashboard',
    pinned: false,
    description: "A dashboard for visualizing sales data with D3.js.",
    tags: ["React", "D3.js", "SASS"],
    coverImage: "https://picsum.photos/seed/project3/1200/800",
    longDescription: "A powerful data visualization tool that transforms raw sales data into insightful charts and graphs. Built with React and the D3.js library, it allows users to filter, sort, and explore data interactively to identify trends and make informed decisions.",
    githubUrl: "https://github.com",
    liveUrl: "#",
  },
  {
    id: "project-4",
    title: "Mobile Fitness App",
    category: 'Website', // You can adjust the category as needed
    pinned: false,
    description: "A cross-platform mobile app for tracking workouts.",
    tags: ["React Native", "Firebase", "GraphQL"],
    coverImage: "https://picsum.photos/seed/project4/1200/800",
    longDescription: "This mobile application, built with React Native, allows users to track their fitness goals, log workouts, and monitor their progress over time. It uses Firebase for real-time data synchronization and user authentication, providing a seamless cross-platform experience.",
    githubUrl: "https://github.com",
  },
  {
    id: "project-5",
    title: "Cloud File Storage Service",
    category: 'Website',
    pinned: true,
    description: "A secure, scalable cloud storage solution similar to Dropbox or Google Drive.",
    tags: ["Node.js", "Express", "React", "AWS S3"],
    coverImage: "https://picsum.photos/seed/project5/1200/800",
    longDescription: "This application provides a robust backend for file uploads, downloads, and management, using AWS S3 for scalable object storage. The frontend, built with React, allows for easy drag-and-drop file handling and folder organization.",
    githubUrl: "https://github.com",
    liveUrl: "#",
  },
  {
    id: "project-6",
    title: "Real-time Stock Market Tracker",
    category: 'Dashboard',
    pinned: false,
    description: "A live dashboard tracking stock market changes using WebSocket technology.",
    tags: ["Vue.js", "WebSocket", "Node.js", "Financial APIs"],
    coverImage: "https://picsum.photos/seed/project6/1200/800",
    longDescription: "A real-time financial dashboard that connects to stock market APIs via WebSockets to provide live price updates. The interface, built with Vue.js, features interactive charts and a customizable watchlist for tracking specific stocks.",
    githubUrl: "https://github.com",
    liveUrl: "#",
  },
  {
    id: "project-7",
    title: "Sentiment Analysis API",
    category: 'ML Project',
    pinned: false,
    description: "A machine learning API that analyzes the sentiment of a given text.",
    tags: ["Python", "Flask", "NLTK", "Scikit-learn"],
    coverImage: "https://picsum.photos/seed/project7/1200/800",
    longDescription: "This project is a RESTful API built with Python and Flask that performs sentiment analysis. It uses the Natural Language Toolkit (NLTK) for text processing and a model trained with Scikit-learn to classify text as positive, negative, or neutral.",
    githubUrl: "https://github.com",
  },
  {
    id: "project-8",
    title: "Personal Blog Platform",
    category: 'Website',
    pinned: false,
    description: "A fully-featured, SEO-friendly personal blog built with a headless CMS.",
    tags: ["Next.js", "GraphQL", "Tailwind CSS", "Strapi"],
    coverImage: "https://picsum.photos/seed/project8/1200/800",
    longDescription: "A modern blogging platform built with Next.js for a fast, static frontend and Strapi as a headless CMS for easy content management. It uses GraphQL for efficient data fetching and is fully optimized for SEO and performance.",
    githubUrl: "https://github.com",
    liveUrl: "#",
  }
];

export default projectsData;