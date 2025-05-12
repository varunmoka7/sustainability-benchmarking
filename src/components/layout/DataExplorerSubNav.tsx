'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const subNavItems = [
  { href: '/data-explorer', label: 'Data Explorer Home' }, // Or a specific default like '/country-emissions-analysis'
  { href: '/country-ratings', label: 'Country Ratings' },
  { href: '/country-emissions-analysis', label: 'Country Emissions Analysis' },
  { href: '/sector-indicators', label: 'Sector Indicators' },
];

export default function DataExplorerSubNav() {
  const pathname = usePathname();

  // Determine the base path for Data Explorer to correctly highlight "Data Explorer Home"
  // if it links to a specific sub-page by default.
  // For this example, let's assume /data-explorer might redirect or be an overview.
  // The active logic for the main "Data Explorer" nav item in NavBar.tsx handles the broader group.

  return (
    <nav className="bg-gray-100 shadow-sm sticky top-16 z-40 text-gray-700"> {/* Adjust top if NavBar height changes */}
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-6 h-12 overflow-x-auto"> {/* Increased space-x for clarity */}
          {subNavItems.map((item) => {
            // More precise active check for sub-navigation
            const isActive = pathname === item.href || 
                             (item.href === '/data-explorer' && pathname.startsWith('/data-explorer') && !subNavItems.slice(1).some(subItem => pathname.startsWith(subItem.href))) ||
                             (item.href === '/country-emissions-analysis' && pathname.startsWith(item.href)); // Example for default active sub-item

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium whitespace-nowrap py-3 transition-colors hover:text-action-teal ${
                  isActive
                    ? 'text-action-teal border-b-2 border-action-teal'
                    : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
