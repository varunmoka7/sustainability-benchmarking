// BenchmarkSection.jsx
import React, { useState, useMemo } from "react";
import { Radar } from "react-chartjs-2";

export default function BenchmarkSection({ company }) {
  const { peerGroups, peers } = company;  // :contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}
  const [activeGroup, setActiveGroup] = useState(company.peerGroup);

  // In this mock, we'll show all peers regardless of group selection.
  const displayedPeers = useMemo(() => peers, [peers]);

  // Radar dataset: compare Scope 1, 2, 3 and Intensity
  const radarData = useMemo(() => ({
    labels: ["Scope 1", "Scope 2", "Scope 3", "Intensity"],
    datasets: displayedPeers.map((p, i) => ({
      label: p.name,
      data: [p.scope1, p.scope2, p.scope3, p.intensity],
      backgroundColor: `rgba(${50 + i*40},${100 + i*30},${150 + i*20},0.2)`,
      borderColor: `rgba(${50 + i*40},${100 + i*30},${150 + i*20},1)`,
      pointBackgroundColor: `rgba(${50 + i*40},${100 + i*30},${150 + i*20},1)`,
      fill: true,
    })),
  }), [displayedPeers]);

  return (
    <section aria-labelledby="benchmark-heading" className="mb-8">
      <h2 id="benchmark-heading" className="sr-only">Industry & Peer Benchmarking</h2>

      {/* Group selector */}
      <div className="flex items-center gap-4 mb-6">
        {peerGroups.map(group => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-3 py-1 rounded ${
              activeGroup === group ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Performance vs. sector radar */}
      <div className="dashboard-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance vs. Sector</h3>
        <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </div>

      {/* Detailed table */}
      <div className="dashboard-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Metric Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Scope 1</th>
                <th className="px-4 py-2">Scope 2</th>
                <th className="px-4 py-2">Scope 3</th>
                <th className="px-4 py-2">Intensity</th>
              </tr>
            </thead>
            <tbody>
              {displayedPeers.map(peer => (
                <tr key={peer.name} className="border-t">
                  <td className="px-4 py-2">{peer.name}</td>
                  <td className="px-4 py-2">{peer.scope1.toLocaleString()}</td>
                  <td className="px-4 py-2">{peer.scope2.toLocaleString()}</td>
                  <td className="px-4 py-2">{peer.scope3.toLocaleString()}</td>
                  <td className="px-4 py-2">{peer.intensity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
