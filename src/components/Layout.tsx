// components/Layout.tsx
import React from 'react';
import Sidebar from './Sidebar'; // Import the real sidebar

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar /> {/* Use the real sidebar here */}
      <main className="flex-1 p-8 sm:p-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;