'use client';

import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
  // Add any other specific props, e.g., variant, size
}

const IconButton: React.FC<IconButtonProps> = ({ icon, ariaLabel, className, ...props }) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-action-teal focus:ring-opacity-50 transition-colors ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
