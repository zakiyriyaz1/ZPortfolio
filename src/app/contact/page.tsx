// src/app/contact/page.tsx
"use client";

import { motion } from "framer-motion";
import NeonText from "@/components/NeonText";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaSpotify, FaFacebook, FaEnvelope } from "react-icons/fa";
import { useRef } from "react";

const socialLinks = [
  { name: "GitHub", icon: <FaGithub size={32} />, url: "#", size: 105, id: "github" },
  { name: "LinkedIn", icon: <FaLinkedin size={30} />, url: "#", size: 95, id: "linkedin" },
  { name: "Instagram", icon: <FaInstagram size={30} />, url: "#", size: 100, id: "instagram" },
  { name: "Gmail", icon: <FaEnvelope size={28} />, url: "mailto:your-email@example.com", size: 90, id: "gmail" },
  { name: "Twitter", icon: <FaTwitter size={28} />, url: "#", size: 85, id: "twitter" },
  { name: "Spotify", icon: <FaSpotify size={30} />, url: "#", size: 95, id: "spotify" },
  { name: "Facebook", icon: <FaFacebook size={28} />, url: "#", size: 85, id: "facebook" },
];

const bubblePositions = [
  { x: 0, y: 0 }, { x: 95, y: 45 }, { x: -100, y: 40 },
  { x: -80, y: -80 }, { x: 80, y: -90 }, { x: 10, y: 105 }, { x: -100, y: 115 },
];

// Changed from 10 to 100
const fillerBubbles = Array.from({ length: 250 }).map((_, i) => ({
  id: `filler-${i}`,
  size: Math.random() * (20 - 5) + 5, // Made them slightly smaller on average
  position: bubblePositions[i % bubblePositions.length],
}));

export default function ContactPage() {
  const constraintsRef = useRef(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Form submitted! (This is a demo)");
  };

  return (
    <section className="p-8">
      <NeonText>Get In Touch</NeonText>
      <p className="text-gray-400 mt-4 mb-8">
        Have a project in mind or just want to say hello? Feel free to reach out.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input type="text" id="name" required className="w-full p-2 bg-[#141921] rounded-md border border-transparent focus:border-accent focus:ring-accent focus:outline-none transition" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" id="email" required className="w-full p-2 bg-[#141921] rounded-md border border-transparent focus:border-accent focus:ring-accent focus:outline-none transition" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea id="message" rows={3} required className="w-full p-2 bg-[#141921] rounded-md border border-transparent focus:border-accent focus:ring-accent focus:outline-none transition" />
            </div>
            <button type="submit" className="px-6 py-2 font-semibold rounded-md bg-accent text-dark hover:bg-accent/80 transition-colors duration-300">
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Right Column: Social Bubble Graph */}
        <motion.div ref={constraintsRef} className="relative w-full h-[350px]">
          {/* Decorative Filler Bubbles */}
          {fillerBubbles.map((bubble, index) => (
            <motion.div
              key={bubble.id}
              className="absolute bg-[#141921]/40 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: bubble.position.x + (Math.random() - 0.5) * 250, y: bubble.position.y + (Math.random() - 0.5) * 250 }}
              transition={{ type: "spring", stiffness: 50, damping: 10, delay: index * 0.01 }}
              style={{ width: bubble.size, height: bubble.size, top: `calc(35% - ${bubble.size / 2}px)`, left: `calc(65% - ${bubble.size / 2}px)`, zIndex: 0 }}
            />
          ))}
          {/* Main Social Bubbles */}
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute flex flex-col items-center justify-center bg-[#141921]/80 rounded-full text-gray-300 border-2 border-transparent hover:text-accent hover:border-accent/50 hover:shadow-cyan-glow cursor-pointer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: bubblePositions[index].x, y: bubblePositions[index].y }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(34, 211, 238, 0.8)", zIndex: 50, transition: { duration: 0 } }}
              drag dragConstraints={constraintsRef} dragElastic={0.8} dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
              style={{ width: link.size, height: link.size, top: `calc(35% - ${link.size / 2}px)`, left: `calc(65% - ${link.size / 2}px)` }}
            >
              {link.icon}
              <span className="mt-1 text-xs font-semibold">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}