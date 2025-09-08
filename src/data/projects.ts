export type Project = {
  id: string;
  title: string;
  // These two properties are now included in the type definition
  category: 'Website' | 'Dashboard' | 'ML Project';
  pinned: boolean;
  description: string;
  tags: string[];
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
    longDescription: "This was a comprehensive project aimed at building a feature-rich e-commerce platform...",
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
    longDescription: "This project leverages the power of OpenAI's GPT models to create a smart, conversational AI...",
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
    longDescription: "A powerful data visualization tool that transforms raw sales data into insightful charts and graphs...",
    githubUrl: "https://github.com",
    liveUrl: "#",
  },
  {
    id: "project-4",
    title: "Mobile Fitness App",
    category: 'Website',
    pinned: false,
    description: "A cross-platform mobile app for tracking workouts.",
    tags: ["React Native", "Firebase", "GraphQL"],
    coverImage: "https://picsum.photos/seed/project4/1200/800",
    longDescription: "This mobile application, built with React Native, allows users to track their fitness goals...",
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
    longDescription: "This application provides a robust backend for file uploads, downloads, and management, using AWS S3 for scalable object storage...",
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
    longDescription: "A real-time financial dashboard that connects to stock market APIs via WebSockets to provide live price updates...",
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
    longDescription: "This project is a RESTful API built with Python and Flask that performs sentiment analysis...",
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
    longDescription: "A modern blogging platform built with Next.js for a fast, static frontend and Strapi as a headless CMS...",
    githubUrl: "https://github.com",
    liveUrl: "#",
  }
];

export default projectsData;

