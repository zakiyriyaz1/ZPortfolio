// components/Layout.tsx
'use client';
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    // The main container is now a column
    <div className="min-h-screen flex flex-col">
      <Header /> {/* Header is now at the top */}
      <div className="flex flex-1"> {/* This container holds the sidebar and main content */}
        <Sidebar />
        <main className="flex-1 p-8 sm:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;