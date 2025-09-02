// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Layout from '@/components/Layout'; // Import our new Layout

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'A modern developer portfolio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}