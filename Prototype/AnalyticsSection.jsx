// AnalyticsSection.jsx
import React, { useMemo } from "react";
import { Bar, Radar } from "react-chartjs-2";

export default function AnalyticsSection({ company }) {
  const { emissionsByScope, currentYear, industryAverages, bestInClass, peers } = company;  // :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}

  // Bar chart: Scope breakdown for current year
  const barData = useMemo(() => ({
    labels: ["Scope 1", "Scope 2", "Scope 3"],
    datasets: [
      {
        label: `${currentYear} Emissions (tCO₂e)`,
        data: [
          emissionsByScope[currentYear].scope1,
          emissionsByScope[currentYear].scope2,
          emissionsByScope[currentYear].scope3,
        ],
        backgroundColor: ["#3B82F6", "#FBBF24", "#F97316"],
      },
    ],
  }), [emissionsByScope, currentYear]);

  // Radar chart: Intensity comparison across peers
  const radarData = useMemo(() => ({
    labels: peers.map(p => p.name),
    datasets: [{
      label: "Emissions Intensity (tCO₂e per $M revenue)",
      data: peers.map(p => p.intensity),
      backgroundColor: "rgba(34,211,238,0.2)",
      borderColor: "#22D3EE",
      pointBackgroundColor: "#22D3EE",
    }],
  }), [peers]);

  return (
    <section aria-labelledby="analytics-heading" className="mb-8">
      <h2 id="analytics-heading" className="sr-only">Analytics & Insights</h2>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card text-center p-4">
          <span className="block text-sm text-gray-500">Emissions Intensity</span>
          <span className="block text-2xl font-bold">{company.emissionsIntensity}</span>
        </div>
        <div className="dashboard-card text-center p-4">
          <span className="block text-sm text-gray-500">Revenue</span>
          <span className="block text-2xl font-bold">${company.revenue.toLocaleString()}</span>
        </div>
        <div className="dashboard-card text-center p-4">
          <span className="block text-sm text-gray-500">Industry Avg Intensity</span>
          <span className="block text-2xl font-bold">{industryAverages.intensity}</span>
        </div>
        <div className="dashboard-card text-center p-4">
          <span className="block text-sm text-gray-500">Best-in-Class Intensity</span>
          <span className="block text-2xl font-bold">{bestInClass.intensity}</span>
        </div>
      </div>

      {/* Scope breakdown bar chart */}
      <div className="dashboard-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Emissions by Scope</h3>
        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
      </div>

      {/* Peer intensity radar */}
      <div className="dashboard-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Peer Emissions Intensity</h3>
        <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
      </div>
    </section>
  );
}
