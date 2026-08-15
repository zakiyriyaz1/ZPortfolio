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
          {/* pt-* gives content breathing room below the header. It sits on
              <main> rather than on each page so every route gets it, and it
              stacks with the my-auto centering inside PageTransition: short
              pages stay centred, tall pages keep a guaranteed gap instead of
              butting up against the header. */}
          <main className="flex-1 overflow-y-auto flex flex-col pt-6 md:pt-10">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <StatusBar />
      </div>
    </ThemeProvider>
  );
}

