ZPortfolio - A Modern Developer Portfolio
<div align="center">
<h1 style="font-size: 4rem; font-weight: bold; letter-spacing: 0.2em;">Z</h1>
</div>

A highly interactive, performance-optimized personal portfolio built with Next.js, Framer Motion, and a cyberpunk-inspired aesthetic.

This repository contains the source code for my personal developer portfolio, designed to showcase my skills in modern web development, data science, and UI/UX design. The project was born from the need to create a stable, fast, and visually stunning platform that not only lists my work but also serves as a testament to my technical capabilities.

✨ Key Features
This portfolio is more than just a list of projects; it's an interactive experience.

Fully Responsive Layout: A seamless experience on all devices, featuring an adaptive "mini icon-only" sidebar for tablets and mobiles that expands on desktop.

Interactive UI & Animations: Fluid and engaging animations powered by Framer Motion, including 3D-tilting project cards, a custom mouse cursor, and subtle micro-interactions that enhance the user experience.

Dynamic Project Filtering: A clean and intuitive interface on the projects page that allows visitors to filter projects by category, with smooth, animated transitions.

Performance Optimized: Built for speed. Heavy components like the tsparticles background are lazy-loaded using next/dynamic, and all project images are optimized with the Next.js <Image> component to ensure fast load times.

Cyberpunk Aesthetic: A sophisticated dark theme with a vibrant cyan accent color, custom fonts, and glowing neon effects to create a unique and memorable visual identity.

Theming: Features a fully functional dark and light mode toggle, managed with next-themes.

🛠️ Technology Stack
This project was built using a modern, industry-standard technology stack to ensure performance, scalability, and an excellent developer experience.

Category

Technology

Framework

Next.js 14 (with App Router)

Language

TypeScript

Styling

Tailwind CSS

Animation

Framer Motion

UI/Icons

React Icons, next-themes

Particles

tsParticles

🚀 Getting Started
To run this project locally, follow these steps:

Clone the repository:

git clone [https://github.com/zakiyriyaz1/ZPortfolio.git](https://github.com/zakiyriyaz1/ZPortfolio.git)
cd ZPortfolio

Install dependencies:

npm install

Run the development server:

npm run dev

Open http://localhost:3000 in your browser to see the result.

🗺️ Project Roadmap
This project is under active development. The roadmap below outlines what has been accomplished and what's planned for the future.

✅ Phase 1: Completed
[x] Core Architecture: Set up Next.js 14 project with TypeScript and Tailwind CSS.

[x] UI Foundation: Built all core components (Header, Sidebar, ProjectCard, StatusBar).

[x] Full Mobile Responsiveness: Implemented the adaptive "mini icon-only" sidebar and responsive project grid.

[x] Performance Optimization: Lazy-loaded the particle background and optimized all project images.

[x] Key Bug Fixes: Resolved critical hydration errors and component conflicts.

⏳ Phase 2: In Progress
[x] Functional Contact Form: Implement a serverless API route using Resend to handle form submissions.

[x] SEO & Metadata: Add unique, descriptive metadata to all pages for improved search engine ranking and social sharing.

[ ] Custom 404 Page: Design a unique "Page Not Found" experience that fits the theme.

Future Goals
[ ] Light Mode Theme: Finalize a complete and polished color scheme for the light theme.

[ ] Enhanced Project Views: Implement a detailed modal view for project case studies.

[ ] Blog / Writing Section: Add a blog powered by MDX to share technical insights.

[ ] Accessibility (a11y) Audit: Perform a full accessibility review to ensure WCAG compliance.

[ ] Code Quality Refinements: Centralize all TypeScript types and add a favicon.
