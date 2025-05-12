'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts'; // Will require installation
import { useState } from 'react';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react'; // Using BarChart3 for a different bar icon
import IconButton from '@/components/ui/IconButton'; // Assuming IconButton will be created

// Data structure for individual data points in the chart
export interface EmissionDataPoint {
  year: string | number; // Year or time period
  emissions: number | null; // Value, can be null if data is missing
  // You might add other properties if comparing multiple series, e.g., scenario: 'NDC', 'Current Policies'
}

interface ChartViewProps {
  data: EmissionDataPoint[];
  chartTitle?: string;
  yAxisLabel?: string;
  primarySeriesName?: string;
  // Colors from your palette (tailwind.config.ts)
  // These would ideally be passed as props or consumed from a theme context
  primaryColor?: string;    // e.g., 'var(--color-chart-scope1)' or actual hex
  gridColor?: string;       // e.g., 'var(--color-chart-grid)'
  axisTextColor?: string;   // e.g., 'var(--color-chart-axis-text-light)'
}

// Custom Tooltip for better styling
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-neutral-dark p-3 shadow-lg rounded-md border border-gray-200 dark:border-neutral-light">
        <p className="text-sm font-semibold text-gray-700 dark:text-secondary-text-on-slate">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.value?.toLocaleString() ?? 'N/A'} mtCO₂e`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartView({
  data = [],
  chartTitle = "Emissions Over Time",
  yAxisLabel = "Emissions (mtCO₂e)",
  primarySeriesName = "Emissions",
  primaryColor = "#5DADE2", // Default to chart_scope1_blue
  gridColor = "#e0e0e0",
  axisTextColor = "#B0BEC5"
}: ChartViewProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const handleToggleChartType = () => {
    setChartType(prev => prev === 'line' ? 'bar' : 'line');
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-secondary-text-on-slate">No data available for the chart.</div>;
  }

  return (
    <div className="bg-white dark:bg-neutral-dark p-4 sm:p-6 rounded-lg shadow-lg my-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-primary-text-on-slate">{chartTitle}</h3>
        <IconButton
            icon={chartType === 'line' ? <BarChart3 size={20} /> : <LineChartIcon size={20} />}
            onClick={handleToggleChartType}
            ariaLabel={`Switch to ${chartType === 'line' ? 'bar' : 'line'} chart`}
            className="text-action-teal hover:text-action-teal-hover"
        />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}> {/* Added bottom margin for XAxis label */}
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="year" stroke={axisTextColor} tick={{ fontSize: 12 }} label={{ value: "Year", position: 'insideBottom', offset: -15, fill: axisTextColor, fontSize: 14 }} />
            <YAxis stroke={axisTextColor} tick={{ fontSize: 12 }} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: axisTextColor, fontSize: 14, dx: -5 }}/>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(127,140,141,0.1)' }}/> {/* neutral-light with alpha */}
            <Legend wrapperStyle={{ fontSize: "14px", color: axisTextColor }} />
            <Line type="monotone" dataKey="emissions" stroke={primaryColor} strokeWidth={2} dot={{ r: 4, fill: primaryColor }} activeDot={{ r: 6 }} name={primarySeriesName} />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="year" stroke={axisTextColor} tick={{ fontSize: 12 }} label={{ value: "Year", position: 'insideBottom', offset: -15, fill: axisTextColor, fontSize: 14 }}/>
            <YAxis stroke={axisTextColor} tick={{ fontSize: 12 }} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: axisTextColor, fontSize: 14, dx: -5 }}/>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(127,140,141,0.1)' }}/>
            <Legend wrapperStyle={{ fontSize: "14px", color: axisTextColor }} />
            <Bar dataKey="emissions" fill={primaryColor} name={primarySeriesName} barSize={30} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
