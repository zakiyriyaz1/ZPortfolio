// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cyber = localFont({
  src: "../assets/fonts/sacredhertz.otf",
  variable: "--font-cyber",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.zakiyriyaz.com"),
  title: {
    default: "Zakiy Riyaz | Portfolio",
    template: "%s | Zakiy Riyaz",
  },
  description: "A modern developer portfolio",
  openGraph: {
    title: "Zakiy Riyaz | Portfolio",
    description: "A modern developer portfolio",
    url: "https://www.zakiyriyaz.com",
    siteName: "Zakiy Riyaz | Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cyber.variable} bg-light dark:bg-dark text-dark dark:text-light cursor-none`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}