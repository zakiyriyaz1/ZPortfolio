"use client";

import { useEffect } from "react"; // CHANGE: Added useEffect
import { motion, Variants, useAnimation } from "framer-motion"; // CHANGE: Added useAnimation

interface Skill {
  name: string;
  icon: React.ReactNode;
}

interface AutoScrollerProps {
  skills: Skill[];
  duration?: number;
  isPaused: boolean; // CHANGE: Added isPaused to the props
}

export default function AutoScroller({ skills, duration = 40, isPaused }: AutoScrollerProps) {
  // CHANGE: Set up animation controls
  const controls = useAnimation();

  // CHANGE: Added useEffect to control the animation based on the isPaused prop
  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start("animate");
    }
  }, [isPaused, controls]);

  if (!Array.isArray(skills)) {
    return null;
  }
  
  const extendedSkills = [...skills, ...skills];

  const scrollVariants: Variants = {
    animate: {
      y: "-50%",
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: duration,
          ease: "linear",
        },
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-3 gap-4"
      variants={scrollVariants}
      animate={controls} // CHANGE: The 'animate' prop now uses our controls
    >
      {extendedSkills.map((skill, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center justify-center p-4 bg-[#141921] rounded-xl text-gray-400"
          whileHover={{ 
            scale: 1.1,
            y: -5,
            boxShadow: "0 0 15px rgba(34, 211, 238, 0.8)",
            color: "rgb(34, 211, 238)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="text-current">{skill.icon}</div> 
          <span className="mt-2 text-xs font-semibold text-center text-current">{skill.name}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}