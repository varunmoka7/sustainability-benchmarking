import React, { useState, useMemo } from "react";
import DashboardSection from "./DashboardSection";
import ReportsSection from "./ReportsSection";
import AnalyticsSection from "./AnalyticsSection";
import BenchmarkSection from "./BenchmarkSection";

// --- Placeholder/mock data (replace with API calls) ---
const mockCompany = {
  id: "tesla",
  name: "Tesla, Inc.",
  sector: "Automotive",
  industry: "Electric Vehicles & Clean Energy",
  region: "North America",
  businessUnits: ["EV", "Energy", "Storage"],
  fiscalYears: [2024, 2023, 2022],
  currentYear: 2024,
  priorYear: 2023,
  totalFootprint: { 2024: 1681320, 2023: 1870400 },
  emissionsByScope: {
    2024: { scope1: 245890, scope2: 189650, scope3: 1245780 },
    2023: { scope1: 267430, scope2: 215320, scope3: 1387650 },
  },
  monthlyEmissions: [
    { month: "Jun", scope1: 20000, scope2: 15000, scope3: 100000, energy: 50000 },
    { month: "Jul", scope1: 21000, scope2: 16000, scope3: 105000, energy: 52000 },
    { month: "Aug", scope1: 22000, scope2: 17000, scope3: 110000, energy: 54000 },
    { month: "Sep", scope1: 21000, scope2: 16000, scope3: 108000, energy: 53000 },
    { month: "Oct", scope1: 23000, scope2: 18000, scope3: 112000, energy: 55000 },
    { month: "Nov", scope1: 24000, scope2: 19000, scope3: 115000, energy: 56000 },
    { month: "Dec", scope1: 25000, scope2: 20000, scope3: 120000, energy: 57000 },
    { month: "Jan", scope1: 26000, scope2: 21000, scope3: 122000, energy: 58000 },
    { month: "Feb", scope1: 25500, scope2: 20500, scope3: 121000, energy: 57500 },
    { month: "Mar", scope1: 26500, scope2: 21500, scope3: 123000, energy: 58500 },
    { month: "Apr", scope1: 27000, scope2: 22000, scope3: 124000, energy: 59000 },
    { month: "May", scope1: 27500, scope2: 22500, scope3: 125000, energy: 60000 },
  ],
  peerGroup: "Automotive",
  peerGroups: ["Automotive", "Tech", "Retail"],
  industryAverages: { scope1: 200000, scope2: 180000, scope3: 1100000, intensity: 25 },
  bestInClass: { scope1: 120000, scope2: 100000, scope3: 800000, intensity: 12 },
  emissionsIntensity: 24.8,
  revenue: 68000000,
  peers: [
    { name: "Tesla", intensity: 24.8, scope1: 245890, scope2: 189650, scope3: 1245780 },
    { name: "Toyota", intensity: 30.1, scope1: 300000, scope2: 200000, scope3: 1200000 },
    { name: "Volkswagen", intensity: 27.7, scope1: 320000, scope2: 210000, scope3: 1050000 },
    { name: "Industry Avg", intensity: 25, scope1: 200000, scope2: 180000, scope3: 1100000 },
  ],
  reports: [
    { id: 1, type: "Annual Sustainability PDF", tags: ["Scope 1", "Scope 2", "Scope 3"], file: "annual.pdf" },
    { id: 2, type: "Quarterly Emissions CSV", tags: ["Scope 1", "Energy"], file: "quarterly.csv" },
    { id: 3, type: "Custom Date-range Export", tags: ["Supply Chain"], file: "custom.csv" },
  ],
};

export default function DashboardApp() {
  // In production, fetch company data from API based on user selection
  const [activeTab, setActiveTab] = useState("dashboard");
  const company = mockCompany; // Replace with selected company from landing page

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow">
        <span className="text-xl font-bold tracking-tight">SustainabilityTrack</span>
        <ul className="flex gap-6">
          {["dashboard", "reports", "analytics", "benchmark"].map(tab => (
            <li key={tab}>
              <button
                className={`uppercase text-sm font-semibold px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${activeTab === tab ? "bg-white text-gray-900" : "hover:bg-gray-800"}`}
                onClick={() => setActiveTab(tab)}
                aria-current={activeTab === tab ? "page" : undefined}
                tabIndex={0}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        {activeTab === "dashboard" && <DashboardSection company={company} />}
        {activeTab === "reports" && <ReportsSection company={company} />}
        {activeTab === "analytics" && <AnalyticsSection company={company} />}
        {activeTab === "benchmark" && <BenchmarkSection company={company} />}
      </main>
    </div>
  );
}

// Integration notes:
// - Place DashboardSection.jsx, ReportsSection.jsx, AnalyticsSection.jsx, BenchmarkSection.jsx in the same folder.
// - Replace mockCompany with real data from your backend/API.
// - All filter, chart, and table controls are ready for dynamic data.
// - All charts animate on load and update on filter changes.
// - All interactive elements are keyboard accessible and have sufficient color contrast.
// - Tailwind CSS and Chart.js must be installed in your project.
// - For a multi-company landing page, wrap this with a company selector and pass the selected company as a prop.
