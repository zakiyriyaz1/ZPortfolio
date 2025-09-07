
# ZPortfolio

A performance-focused developer portfolio built with Next.js 14, TypeScript, and Framer Motion.

**[Live Demo](https://your-live-demo-link.com)**

This repository contains the source code for a personal developer portfolio designed to showcase projects with a clean, cyberpunk-inspired aesthetic. The primary goals were to achieve a fast, responsive, and interactive user experience while maintaining a well-structured and scalable codebase.

-----

## Features

  * **Adaptive UI:** The layout is fully responsive, featuring an icon-only sidebar on mobile and tablet devices that expands on desktop for a seamless experience across all screen sizes.
  * **Fluid Animations & UX:** User interactions are enhanced with animations powered by **Framer Motion**. Key features include 3D-tilting project cards on hover, a custom mouse cursor, and subtle micro-interactions that guide the user.
  * **Dynamic Content Filtering:** The projects page includes an intuitive category-based filter with smooth, animated transitions between filter states.
  * **Optimized for Performance:** Core performance is prioritized through modern web development practices. Heavy components like the `tsParticles` background are lazy-loaded using `next/dynamic`, and all project images are optimized via the Next.js `<Image>` component to minimize load times.
  * **Themed UI:** A sophisticated dark theme is enabled by default with a vibrant cyan accent. The project also includes a functional light/dark mode toggle, managed with `next-themes`.

-----

## 🛠️ Technology Stack

This project leverages a modern, industry-standard technology stack to ensure performance, scalability, and an excellent developer experience.

| Category    | Technology                                |
| :---------- | :---------------------------------------- |
| **Framework** | Next.js 14 (with App Router)              |
| **Language** | TypeScript                                |
| **Styling** | Tailwind CSS                              |
| **Animation** | Framer Motion                             |
| **UI/Icons** | React Icons, `next-themes`                |
| **Particles** | `tsParticles`                             |

-----

## 🚀 Running Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js (version 18.x or later) and a package manager (npm, yarn, or pnpm) installed.

### Installation & Execution

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/zakiyriyaz1/ZPortfolio.git
    cd ZPortfolio
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**

    ```sh
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to view the project.

-----

## 🗺️ Project Roadmap

This project is under active development. The roadmap below outlines completed milestones and future goals.

#### ✅ Completed

  * **Core Architecture:** Set up Next.js 14 project with TypeScript and Tailwind CSS.
  * **UI Foundation:** Built all core components (Header, Sidebar, ProjectCard, StatusBar).
  * **Full Responsiveness:** Implemented the adaptive sidebar and responsive project grid.
  * **Performance Optimization:** Lazy-loaded the particle background and optimized all images.
  * **Bug Fixes:** Resolved critical hydration errors and component conflicts.

#### ⏳ In Progress

  * **Contact Form:** Implementing a serverless API route using Resend to handle form submissions.
  * **SEO & Metadata:** Adding unique, descriptive metadata to all pages for improved search engine ranking and social sharing.
  * **Code Quality:** Centralizing TypeScript types and creating a project favicon.

#### 🎯 Future Goals

  * **UI/UX:**
      * [ ] Finalize a polished color scheme for the light theme.
      * [ ] Design a custom 404 "Page Not Found" experience.
      * [ ] Implement a detailed modal or page view for project case studies.
  * **Content:**
      * [ ] Add a blog/writing section powered by MDX.
  * **Technical Debt & a11y:**
      * [ ] Conduct a full accessibility audit to ensure WCAG compliance.
      * [ ] Refactor CSS variables for improved theme management.
