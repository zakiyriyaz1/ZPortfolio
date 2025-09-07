"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CustomCursor from "@/components/CustomCursor";
import StatusBar from "@/components/StatusBar";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "@/components/theme-provider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
    >
      <CustomCursor />
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <StatusBar />
      </div>
    </ThemeProvider>
  );
}

