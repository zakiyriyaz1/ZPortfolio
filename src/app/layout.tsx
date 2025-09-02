// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@/components/ThemeProvider'; // Import the provider

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'A modern developer portfolio.',
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}