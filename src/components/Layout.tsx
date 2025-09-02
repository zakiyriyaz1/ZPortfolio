// components/Layout.tsx
import React from 'react';
// We will create Sidebar.tsx in the next step
// import Sidebar from './Sidebar'; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      {/* <Sidebar /> */}
      <aside className="w-64 p-8 border-r border-gray-800">
         <h1 className="text-white font-bold text-2xl">My Portfolio</h1>
         <p className="text-gray-400 text-sm mt-2">Sidebar placeholder</p>
      </aside>
      <main className="flex-1 p-8 sm:p-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;