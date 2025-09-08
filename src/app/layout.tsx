import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CustomCursor from "@/components/CustomCursor";
import StatusBar from "@/components/StatusBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cyber = localFont({
  src: "../assets/fonts/sacredhertz.otf",
  variable: "--font-cyber",
});

export const metadata: Metadata = {
  title: "Zakiy Riyaz | Portfolio",
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
              {/* Padding removed from this main element */}
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
            <StatusBar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}