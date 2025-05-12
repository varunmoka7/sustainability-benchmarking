'use client';

import { Download } from 'lucide-react'; // Will require installation

interface DataDownloadButtonProps {
  dataToDownload: any[]; // Array of objects
  filename?: string;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
}

export default function DataDownloadButton({
  dataToDownload,
  filename = 'emissions_data.csv',
  buttonText = 'DATA DOWNLOAD',
  className = "flex items-center px-4 py-2.5 bg-action-teal text-white text-sm font-medium rounded-md shadow-sm hover:bg-action-teal-hover transition-colors",
  disabled = false,
}: DataDownloadButtonProps) {
  
  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';
    
    // Ensure all objects have the same keys for consistent CSV headers
    // Taking keys from the first object
    const headers = Object.keys(data[0]);
    
    const csvRows = [
      headers.join(','), // header row
      ...data.map(row => 
        headers.map(fieldName => {
          let value = row[fieldName];
          // Handle null, undefined, and objects/arrays (e.g. stringify them or take a specific property)
          if (value === null || value === undefined) {
            return '';
          }
          if (typeof value === 'object') {
            return JSON.stringify(value); // Simple stringification for complex types
          }
          // Escape commas and quotes in string values
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ];
    return csvRows.join('\\n'); // Use \n for newline character
  };

  const handleDownload = () => {
    if (disabled || !dataToDownload || dataToDownload.length === 0) return;

    const csvData = convertToCSV(dataToDownload);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) { // Check if HTML5 download attribute is supported
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the object URL
    } else {
      // Fallback for older browsers (less common now)
      alert("Your browser doesn't support direct file downloads. Please try a different browser.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || !dataToDownload || dataToDownload.length === 0}
      className={`${className} disabled:opacity-60 disabled:cursor-not-allowed`}
      aria-label={`Download ${filename}`}
    >
      <Download size={18} className="mr-2" />
      {buttonText}
    </button>
  );
}
