// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cyber = localFont({
  src: "../assets/fonts/sacredhertz.otf", // Corrected filename
  variable: "--font-cyber",
});

export const metadata: Metadata = {
  title: "Zakiy Riyaz | Portfolio", // Corrected name
  description: "A modern developer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cyber.variable} bg-light dark:bg-dark text-dark dark:text-light cursor-none`}>
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
              <main className="flex-1 p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}