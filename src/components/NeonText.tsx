// src/components/NeonText.tsx
import React from 'react';

// Add className as an optional prop
interface NeonTextProps {
  children: React.ReactNode;
  className?: string;
}

const NeonText: React.FC<NeonTextProps> = ({ children, className }) => {
  return (
    // Combine the default classes with any passed className
    <h1 className={`text-4xl font-bold text-cyan-400 transition-all duration-300 ${className}`} style={{ textShadow: '0 0 5px currentColor' }}>
      {children}
    </h1>
  );
};

export default NeonText;