// src/app/contact/page.tsx
"use client";

import { motion } from "framer-motion";
import NeonText from "@/components/NeonText";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaSpotify, FaFacebook, FaEnvelope } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import dynamic from 'next/dynamic';

// Dynamically import the Particles component
const Particles = dynamic(() => import('@tsparticles/react'), {
  ssr: false,
});

// Increased icon sizes for larger nodes
const socialLinks = [
  { name: "GitHub", icon: <FaGithub size={42} />, url: "#", id: "github" },
  { name: "LinkedIn", icon: <FaLinkedin size={40} />, url: "#", id: "linkedin" },
  { name: "Instagram", icon: <FaInstagram size={40} />, url: "#", id: "instagram" },
  { name: "Gmail", icon: <FaEnvelope size={38} />, url: "mailto:your-email@example.com", id: "gmail" },
  { name: "Twitter", icon: <FaTwitter size={38} />, url: "#", id: "twitter" },
  { name: "Spotify", icon: <FaSpotify size={40} />, url: "#", id: "spotify" },
  { name: "Facebook", icon: <FaFacebook size={38} />, url: "#", id: "facebook" },
];

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  const [init, setInit] = useState(false);

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Particles options
  const particlesOptions: ISourceOptions = useMemo(() => ({
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        repulse: {
          distance: 80,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#22d3ee",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 200,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  }), []);

  // Adjusted to position the constellation properly
  const getNodePosition = (index: number) => {
    const centerX = 220; // Adjusted to center properly
    const centerY = 200; // Adjusted for better proportion
    const radius = 140; // Reduced radius for better fit
    const angle = (index * (360 / socialLinks.length)) * (Math.PI / 180) - (Math.PI / 2); // Start from top
    
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'Message sent successfully! I\'ll get back to you soon.' 
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.' 
      });
    }
  };

  return (
    <section className="p-8 relative min-h-screen">
      {/* Particles Background */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      <div className="relative z-10">
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
              {/* Status Message */}
              {status.type !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-md text-sm font-medium ${
                    status.type === 'success' 
                      ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
                      : status.type === 'error'
                      ? 'bg-red-900/20 text-red-400 border border-red-500/30'
                      : 'bg-accent/10 text-accent border border-accent/30'
                  }`}
                >
                  {status.message}
                </motion.div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  disabled={status.type === 'loading'}
                  className="w-full p-3 bg-[#141921] rounded-md border border-transparent focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-100 placeholder-gray-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  disabled={status.type === 'loading'}
                  className="w-full p-3 bg-[#141921] rounded-md border border-transparent focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-100 placeholder-gray-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message *
                </label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4} 
                  required 
                  disabled={status.type === 'loading'}
                  className="w-full p-3 bg-[#141921] rounded-md border border-transparent focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-100 placeholder-gray-500 resize-vertical min-h-[100px]"
                  placeholder="Tell me about your project or just say hello..."
                />
              </div>

              <motion.button 
                type="submit" 
                disabled={status.type === 'loading'}
                className="w-full px-6 py-3 font-semibold rounded-md bg-accent text-dark hover:bg-accent/80 focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={status.type !== 'loading' ? { scale: 1.02 } : {}}
                whileTap={status.type !== 'loading' ? { scale: 0.98 } : {}}
              >
                {status.type === 'loading' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right Column: Interactive Social Constellation */}
          <motion.div 
            className="relative w-full h-full overflow-hidden flex justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
            
            {/* Connection Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
                  <stop offset="50%" stopColor="rgba(34, 211, 238, 0.6)" />
                  <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Dynamic Connection Lines - Connect all nodes in a circle */}
              {socialLinks.map((_, index) => {
                const nextIndex = (index + 1) % socialLinks.length;
                const currentPos = getNodePosition(index);
                const nextPos = getNodePosition(nextIndex);
                
                return (
                  <motion.line
                    key={`connection-${index}`}
                    x1={currentPos.x}
                    y1={currentPos.y}
                    x2={nextPos.x}
                    y2={nextPos.y}
                    stroke="url(#connectionGradient)"
                    strokeWidth="2"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      pathLength: { duration: 2, delay: index * 0.15 },
                      opacity: { duration: 0.5, delay: index * 0.15 }
                    }}
                  />
                );
              })}
              
              {/* Additional connections for a more web-like appearance */}
              {socialLinks.map((_, index) => {
                // Create connections between every other node for a more complete web
                if (index % 2 === 0) {
                  const skipIndex = (index + 2) % socialLinks.length;
                  const currentPos = getNodePosition(index);
                  const skipPos = getNodePosition(skipIndex);
                  
                  return (
                    <motion.line
                      key={`skip-connection-${index}`}
                      x1={currentPos.x}
                      y1={currentPos.y}
                      x2={skipPos.x}
                      y2={skipPos.y}
                      stroke="rgba(34, 211, 238, 0.15)"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.4 }}
                      transition={{
                        pathLength: { duration: 2.5, delay: 1 + index * 0.1 },
                        opacity: { duration: 0.5, delay: 1 + index * 0.1 }
                      }}
                    />
                  );
                }
                return null;
              })}
            </svg>

            {/* Floating Particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-accent/40 rounded-full"
                initial={{ 
                  opacity: 0, 
                  x: 220 + Math.cos(i * 0.5) * 150, 
                  y: 200 + Math.sin(i * 0.5) * 150 
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: 220 + Math.cos(i * 0.5 + Date.now() * 0.001) * (140 + Math.sin(i) * 30),
                  y: 200 + Math.sin(i * 0.5 + Date.now() * 0.001) * (140 + Math.cos(i) * 30),
                }}
                transition={{
                  duration: 8 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "linear"
                }}
                style={{ zIndex: 0 }}
              />
            ))}

            {/* Social Network Nodes - Transparent background with larger icons */}
            {socialLinks.map((link, index) => {
              const position = getNodePosition(index);
              
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute group cursor-pointer"
                  style={{
                    left: position.x - 40, // Adjusted for new size
                    top: position.y - 40, // Adjusted for new size
                    zIndex: 20
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                    rotate: -180
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotate: 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                    delay: 0.8 + index * 0.15
                  }}
                  whileHover={{
                    scale: 1.15,
                    rotate: 5,
                    zIndex: 50,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Node Glow Ring */}
                  <motion.div
                    className="absolute inset-0 bg-accent/30 rounded-full blur-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ 
                      scale: 2.5, 
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                  />
                  
                  {/* Main Node - Transparent background with larger outlines */}
                  <div className="relative w-[80px] h-[80px] bg-transparent border-2 border-accent/40 rounded-full flex flex-col items-center justify-center group-hover:border-accent group-hover:shadow-cyan-glow transition-all duration-300 backdrop-blur-sm">
                    {/* Icon - Made larger */}
                    <div className="text-gray-300 group-hover:text-accent transition-colors duration-300 mb-0">
                      {link.icon}
                    </div>
                    
                    {/* Label */}
                    <span className="text-xs font-medium text-gray-400 group-hover:text-accent transition-colors duration-300">
                      {link.name}
                    </span>
                    
                    {/* Pulse Effect */}
                    <motion.div
                      className="absolute inset-0 bg-accent/5 rounded-full border border-accent/20"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0, 0.3, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.6,
                        ease: "easeOut"
                      }}
                    />
                  </div>

                  {/* Hover Label */}
                  <motion.div
                    className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-accent/95 text-dark px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none shadow-lg"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    whileHover={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    Connect on {link.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-accent/95" />
                  </motion.div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}