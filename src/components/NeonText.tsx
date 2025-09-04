// src/components/NeonText.tsx
import React from 'react';

const NeonText = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="text-4xl font-bold text-cyan-400 transition-all duration-300" style={{ textShadow: '0 0 5px currentColor' }}>
      {children}
    </h1>
  );
};

export default NeonText;