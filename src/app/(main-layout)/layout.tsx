import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Example: Using Inter font
import '@/styles/globals.css'; // Ensure Tailwind is imported
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';

// Setup Inter font (or any other font you choose)
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', // CSS variable for Tailwind
});

export const metadata: Metadata = {
  title: 'Corporate Emissions Tracker', // Default title, can be overridden by pages
  description: 'Tracking corporate emissions data and climate action.',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-deep-slate text-primary-text-on-slate flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8"> 
          {/* py-8 for top/bottom padding in main content area */}
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
