// src/app/contact/page.tsx
"use client";

import { motion } from "framer-motion";
import NeonText from "@/components/NeonText";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaFileDownload, FaSpotify, FaFacebook } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the Particles component
const Particles = dynamic(() => import('@tsparticles/react'), {
  ssr: false,
});

// Resume download function
const downloadResume = () => {
  const link = document.createElement('a');
  link.href = '/resume/ZAKIY RIYAZ - RESUME.pdf';
  link.download = 'ZAKIY RIYAZ - RESUME.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const socialLinks = [
  { name: "GitHub", icon: <FaGithub />, url: "#", id: "github" },
  { name: "LinkedIn", icon: <FaLinkedin />, url: "#", id: "linkedin" },
  { name: "Instagram", icon: <FaInstagram />, url: "#", id: "instagram" },
  { name: "Gmail", icon: <FaEnvelope />, url: "mailto:your-email@example.com", id: "gmail" },
  { name: "Resume", icon: <FaFileDownload />, isDownload: true, id: "resume" },
  { name: "Spotify", icon: <FaSpotify />, url: "#", id: "spotify" },
  { name: "Facebook", icon: <FaFacebook />, url: "#", id: "facebook" },
];

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  progress?: number;
}

// --- Mobile Socials Component (3x2 Grid Layout) ---
const MobileSocials = () => {
  const mobileSocialLinks = socialLinks.filter(link => link.id !== 'facebook');

  return (
    <motion.div 
      className="grid md:hidden grid-cols-3 gap-y-6 gap-x-4 my-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {mobileSocialLinks.map((link, index) => (
        <motion.div
          key={link.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.05 }}
          whileHover={{ scale: 1.1, y: -2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer flex flex-col items-center" 
          onClick={link.isDownload ? downloadResume : undefined}
        >
          <a 
            href={link.isDownload ? undefined : link.url}
            target={link.isDownload ? undefined : "_blank"}
            rel={link.isDownload ? undefined : "noopener noreferrer"}
            className="w-14 h-14 bg-transparent border-2 border-accent/40 rounded-full flex items-center justify-center text-gray-300 hover:text-accent hover:border-accent hover:shadow-cyan-glow transition-all duration-300"
            aria-label={link.name}
          >
            {React.cloneElement(link.icon, { size: 24 })}
          </a>
          <span className="mt-1.5 text-xs text-gray-400 group-hover:text-accent transition-colors duration-300 text-center">
            {link.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>({ type: 'idle', progress: 0 });
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions: ISourceOptions = useMemo(() => ({
    fpsLimit: 120,
    interactivity: { events: { onHover: { enable: true, mode: "repulse" } }, modes: { repulse: { distance: 80, duration: 0.4 } } },
    particles: { color: { value: "#22d3ee" }, links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.15, width: 1 }, move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: true, speed: 1, straight: false }, number: { density: { enable: true }, value: 200 }, opacity: { value: 0.3 }, shape: { type: "circle" }, size: { value: { min: 1, max: 2 } } },
    detectRetina: true,
  }), []);

  const getNodePosition = (index: number) => {
    const centerX = 220, centerY = 200, radius = 140;
    const angle = (index * (360 / socialLinks.length)) * (Math.PI / 180) - (Math.PI / 2);
    return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) {
        progress = 90;
        clearInterval(interval);
      }
      setStatus(prev => ({ ...prev, progress }));
    }, 100);
    return interval;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading', progress: 0 });
    const progressInterval = simulateProgress();
    try {
      const response = await fetch('https://formspree.io/f/xeolnaeq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, message: formData.message, _replyto: formData.email, _subject: `New contact from ${formData.name}` }),
      });
      clearInterval(progressInterval);
      setStatus(prev => ({ ...prev, progress: 100 }));
      await new Promise(resolve => setTimeout(resolve, 500));
      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.', progress: 0 });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    // MODIFIED: Renamed 'error' to '_error' to fix the unused variable warning.
    } catch (_error) {
      clearInterval(progressInterval);
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.', progress: 0 });
    }
  };

  return (
    <section className="p-4 md:p-6 relative">
      {init && <Particles id="tsparticles" options={particlesOptions} className="absolute inset-0 z-0 pointer-events-none" />}
      
      <div className="relative z-10">
        <div className="mb-4 text-center md:text-left">
          <NeonText>Get In Touch</NeonText>
          <p className="text-gray-400 mt-4 text-sm md:text-base">
            Have a project in mind or just want to say hello? Feel free to reach out.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start justify-center">

          <div className="w-full max-w-md">
            
            <MobileSocials />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-3">
                 {/* MODIFIED: Restored the missing progress bar JSX */}
                 {status.type === 'loading' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Sending message...</span>
                            <span>{Math.round(status.progress || 0)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-accent via-accent/80 to-accent rounded-full relative"
                                initial={{ width: '0%' }}
                                animate={{ width: `${status.progress || 0}%` }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                            </motion.div>
                        </div>
                    </motion.div>
                 )}

                 {(status.type === 'success' || status.type === 'error') && (
                    <motion.div className={`p-2.5 rounded-md text-xs font-medium ${status.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-500/30' : 'bg-red-900/20 text-red-400 border border-red-500/30'}`}>{status.message}</motion.div>
                 )}
                 <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1">Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required disabled={status.type === 'loading'} className="w-full p-2.5 bg-[#141921] rounded-md border border-transparent focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 disabled:opacity-50 text-gray-100 placeholder-gray-500 text-sm" placeholder="Your full name" />
                 </div>
                 <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">Email *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={status.type === 'loading'} className="w-full p-2.5 bg-[#141921] rounded-md border border-transparent focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 disabled:opacity-50 text-gray-100 placeholder-gray-500 text-sm" placeholder="your.email@example.com" />
                 </div>
                 <div>
                    <label htmlFor="message" className="block text-xs font-medium text-gray-300 mb-1">Message *</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5} required disabled={status.type === 'loading'} className="w-full p-2.5 bg-[#141921] rounded-md border border-transparent focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-200 disabled:opacity-50 text-gray-100 placeholder-gray-500 resize-vertical min-h-[120px] text-sm" placeholder="Tell me about your project..."></textarea>
                 </div>
                 <motion.button type="submit" disabled={status.type === 'loading'} className="w-full px-4 py-2.5 font-semibold rounded-md bg-accent text-dark hover:bg-accent/80 transition-all duration-300 disabled:opacity-50 text-sm flex items-center justify-center" whileHover={status.type !== 'loading' ? { scale: 1.02 } : {}} whileTap={status.type !== 'loading' ? { scale: 0.98 } : {}}>
                    {status.type === 'loading' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Sending...
                      </>
                    ) : ( 'Send Message' )}
                 </motion.button>
              </form>
            </motion.div>
          </div>

          <motion.div 
            className="relative w-full h-[400px] overflow-hidden justify-center items-center hidden md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
             <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
             <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(34, 211, 238, 0)" /><stop offset="50%" stopColor="rgba(34, 211, 238, 0.6)" /><stop offset="100%" stopColor="rgba(34, 211, 238, 0)" /></linearGradient>
                  <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                {socialLinks.map((_, index) => {
                  const nextIndex = (index + 1) % socialLinks.length;
                  const currentPos = getNodePosition(index);
                  const nextPos = getNodePosition(nextIndex);
                  return (<motion.line key={`connection-${index}`} x1={currentPos.x} y1={currentPos.y} x2={nextPos.x} y2={nextPos.y} stroke="url(#connectionGradient)" strokeWidth="2" filter="url(#glow)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ pathLength: { duration: 2, delay: index * 0.15 }, opacity: { duration: 0.5, delay: index * 0.15 } }} />);
                })}
                {socialLinks.map((_, index) => {
                  if (index % 2 === 0) {
                    const skipIndex = (index + 2) % socialLinks.length;
                    const currentPos = getNodePosition(index);
                    const skipPos = getNodePosition(skipIndex);
                    return (<motion.line key={`skip-connection-${index}`} x1={currentPos.x} y1={currentPos.y} x2={skipPos.x} y2={skipPos.y} stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1" strokeDasharray="3,3" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.4 }} transition={{ pathLength: { duration: 2.5, delay: 1 + index * 0.1 }, opacity: { duration: 0.5, delay: 1 + index * 0.1 } }} />);
                  }
                  return null;
                })}
             </svg>
             {Array.from({ length: 10 }).map((_, i) => (
                <motion.div key={`particle-${i}`} className="absolute w-1 h-1 bg-accent/40 rounded-full" initial={{ opacity: 0, x: 180 + Math.cos(i * 0.5) * 120, y: 160 + Math.sin(i * 0.5) * 120 }} animate={{ opacity: [0, 1, 0], x: 180 + Math.cos(i * 0.5 + Date.now() * 0.001) * (110 + Math.sin(i) * 20), y: 160 + Math.sin(i * 0.5 + Date.now() * 0.001) * (110 + Math.cos(i) * 20) }} transition={{ duration: 8 + i * 0.5, repeat: Infinity, delay: i * 0.2, ease: "linear" }} style={{ zIndex: 0 }} />
              ))}
             {socialLinks.map((link, index) => {
                const position = getNodePosition(index);
                return (
                  <motion.div key={link.id} className="absolute group cursor-pointer" style={{ left: position.x - 40, top: position.y - 40, zIndex: 20 }} onClick={link.isDownload ? downloadResume : undefined} initial={{ opacity: 0, scale: 0, rotate: -180 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.8 + index * 0.15 }} whileHover={{ scale: 1.15, rotate: 5, zIndex: 50, transition: { duration: 0.2 } }} whileTap={{ scale: 0.95 }}>
                    <motion.div className="absolute inset-0 bg-accent/30 rounded-full blur-lg" initial={{ scale: 0, opacity: 0 }} whileHover={{ scale: 2.5, opacity: 1, transition: { duration: 0.3 } }} />
                    <div className="relative w-[80px] h-[80px] bg-transparent border-2 border-accent/40 rounded-full flex flex-col items-center justify-center group-hover:border-accent group-hover:shadow-cyan-glow transition-all duration-300 backdrop-blur-sm">
                      <div className="text-gray-300 group-hover:text-accent transition-colors duration-300 mb-0">{React.cloneElement(link.icon, { size: 30 })}</div>
                      <span className="text-xs font-medium text-gray-400 group-hover:text-accent transition-colors duration-300">{link.name}</span>
                    </div>
                    <motion.div className="absolute inset-0 bg-accent/5 rounded-full border border-accent/20" initial={{ scale: 1, opacity: 0 }} animate={{ scale: [1, 1.3, 1], opacity: [0, 0.3, 0] }} transition={{ duration: 4, repeat: Infinity, delay: index * 0.6, ease: "easeOut" }} />
                    <motion.div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-accent/95 text-dark px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none shadow-lg" initial={{ opacity: 0, y: 10, scale: 0.8 }} whileHover={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }}><div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-accent/95" />{link.isDownload ? 'Download Resume' : `Connect on ${link.name}`}</motion.div>
                    {!link.isDownload && (<a href={link.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0" />)}
                  </motion.div>
                );
             })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}