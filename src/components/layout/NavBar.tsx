'use client'; // For useState and client-side interactions

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import DataExplorerSubNav from './DataExplorerSubNav';
import { usePathname } from 'next/navigation';

const mainNavItems = [
  { href: '/', label: 'Home' },
  { href: '/global', label: 'Global' },
  { href: '/countries', label: 'Countries' },
  { href: '/sectors', label: 'Sectors' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/publications', label: 'Publications' },
  { href: '/blog', label: 'Blog' },
  { href: '/data-explorer', label: 'Data Explorer' }, // Will link to /data-explorer/country-emissions-analysis by default
  { href: '/media', label: 'Media' },
  { href: '/about', label: 'About' },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Determine if any Data Explorer related page is active
  const isDataExplorerRouteActive = 
    pathname.startsWith('/data-explorer') ||
    pathname.startsWith('/country-ratings') ||
    pathname.startsWith('/country-emissions-analysis') ||
    pathname.startsWith('/sector-indicators');

  // Default Data Explorer link
  const dataExplorerBaseHref = '/country-emissions-analysis';


  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50 text-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center" aria-label="Homepage">
              {/* Replace with your actual logo path */}
              <Image src="/images/logo.svg" alt="Site Logo" width={150} height={30} priority />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-5">
              {mainNavItems.map((item) => {
                const isActive = item.href === '/data-explorer' 
                  ? isDataExplorerRouteActive 
                  : pathname === item.href;
                const actualHref = item.href === '/data-explorer' ? dataExplorerBaseHref : item.href;

                return (
                  <Link
                    key={item.label}
                    href={actualHref}
                    className={`text-sm font-medium transition-colors hover:text-action-teal ${
                      isActive
                        ? 'text-action-teal border-b-2 border-action-teal'
                        : 'text-gray-700'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button aria-label="Search" className="text-gray-600 hover:text-action-teal">
                <Search size={20} />
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
                className="text-gray-600 hover:text-action-teal"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 absolute w-full shadow-lg">
            <nav className="flex flex-col space-y-1 p-4">
              {mainNavItems.map((item) => {
                 const isActive = item.href === '/data-explorer' 
                 ? isDataExplorerRouteActive 
                 : pathname === item.href;
               const actualHref = item.href === '/data-explorer' ? dataExplorerBaseHref : item.href;

                return (
                  <Link
                    key={item.label}
                    href={actualHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-100 hover:text-action-teal ${
                      isActive
                        ? 'text-action-teal bg-blue-50' // A light blue for active mobile item
                        : 'text-gray-700'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button aria-label="Search" className="flex items-center px-3 py-2 text-gray-600 hover:text-action-teal text-base font-medium">
                <Search size={20} className="mr-2" /> Search
              </button>
            </nav>
          </div>
        )}
      </header>
      {/* Conditionally render DataExplorerSubNav based on route */}
      {isDataExplorerRouteActive && <DataExplorerSubNav />}
    </>
  );
}
