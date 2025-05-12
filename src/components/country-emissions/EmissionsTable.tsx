'use client';

import React from 'react';

interface EmissionsTableProps {
  data: any[]; // Expects an array of data objects
  title?: string;
  // You can add more props for pagination, sorting controls if needed later
}

const EmissionsTable: React.FC<EmissionsTableProps> = ({ 
  data = [], 
  title = "Emissions Data Table" 
}) => {
  if (!data || data.length === 0) {
    return <p className="text-secondary-text-on-slate my-4">No data available for the table.</p>;
  }

  // Dynamically get headers from the first data object
  const headers = Object.keys(data[0]);

  return (
    <div className="my-6">
      {title && <h3 className="text-xl font-semibold text-primary-text-on-slate mb-3">{title}</h3>}
      <div className="overflow-x-auto shadow-md rounded-lg border border-neutral-light">
        <table className="min-w-full divide-y divide-neutral-light bg-white dark:bg-neutral-dark">
          <thead className="bg-table-header-bg dark:bg-deep-slate">
            <tr>
              {headers.map((header) => (
                <th 
                  key={header} 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-table-text-dark dark:text-secondary-text-on-slate uppercase tracking-wider"
                >
                  {header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {/* Add spaces before caps & capitalize */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-light">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-table-row-even-bg dark:bg-neutral-dark' : 'bg-table-row-odd-bg dark:bg-deep-slate'}>
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-table-text-dark dark:text-primary-text-on-slate">
                    {typeof row[header] === 'number' ? row[header].toLocaleString() : String(row[header] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmissionsTable;
