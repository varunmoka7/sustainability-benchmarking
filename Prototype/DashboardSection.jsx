import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";

const scopeColors = {
  scope1: "bg-blue-600 text-white",
  scope2: "bg-yellow-500 text-gray-900",
  scope3: "bg-orange-500 text-white",
};

export default function DashboardSection({ company }) {
  const [fiscalYear, setFiscalYear] = useState(company.currentYear);
  const [region, setRegion] = useState(company.region);
  const [businessUnit, setBusinessUnit] = useState(company.businessUnits[0]);

  const sparklineData = useMemo(() => ({
    labels: company.monthlyEmissions.map(m => m.month),
    datasets: [
      {
        label: "Total Emissions",
        data: company.monthlyEmissions.map(m => m.scope1 + m.scope2 + m.scope3),
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,0.1)",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  }), [company]);

  return (
    <section aria-labelledby="dashboard-heading" className="mb-8">
      <h2 id="dashboard-heading" className="sr-only">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Total Carbon Footprint */}
        <div className="dashboard-card flex flex-col gap-2" tabIndex={0} aria-label="Total Carbon Footprint">
          <span className="text-gray-500 text-sm">Total Carbon Footprint</span>
          <span className="text-2xl font-bold">{company.totalFootprint[fiscalYear].toLocaleString()} tCO₂e</span>
          <span className="text-xs text-gray-400">
            {fiscalYear} vs {company.priorYear}: <span className={company.totalFootprint[fiscalYear] < company.totalFootprint[company.priorYear] ? "text-green-600" : "text-red-600"}>
              {company.totalFootprint[fiscalYear] < company.totalFootprint[company.priorYear] ? "▼" : "▲"}
              {Math.abs(company.totalFootprint[fiscalYear] - company.totalFootprint[company.priorYear]).toLocaleString()} tCO₂e
            </span>
          </span>
        </div>
        {/* Card 2: Scope 1 */}
        <div className={`dashboard-card flex flex-col gap-2 ${scopeColors.scope1}`} tabIndex={0} aria-label="Scope 1 Emissions">
          <span className="text-sm">Scope 1</span>
          <span className="text-2xl font-bold">{company.emissionsByScope[fiscalYear].scope1.toLocaleString()} tCO₂e</span>
        </div>
        {/* Card 3: Scope 2 */}
        <div className={`dashboard-card flex flex-col gap-2 ${scopeColors.scope2}`} tabIndex={0} aria-label="Scope 2 Emissions">
          <span className="text-sm">Scope 2</span>
          <span className="text-2xl font-bold">{company.emissionsByScope[fiscalYear].scope2.toLocaleString()} tCO₂e</span>
        </div>
        {/* Card 4: Scope 3 */}
        <div className={`dashboard-card flex flex-col gap-2 ${scopeColors.scope3}`} tabIndex={0} aria-label="Scope 3 Emissions">
          <span className="text-sm">Scope 3</span>
          <span className="text-2xl font-bold">{company.emissionsByScope[fiscalYear].scope3.toLocaleString()} tCO₂e</span>
        </div>
      </div>
      {/* Filters and sparkline */}
      <div className="flex flex-wrap gap-4 items-center mt-6">
        <label>
          <span className="text-xs text-gray-600">Fiscal Year</span>
          <select className="ml-2 p-1 border rounded" value={fiscalYear} onChange={e => setFiscalYear(Number(e.target.value))}>
            {company.fiscalYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label>
          <span className="text-xs text-gray-600">Region</span>
          <select className="ml-2 p-1 border rounded" value={region} onChange={e => setRegion(e.target.value)}>
            <option value={company.region}>{company.region}</option>
            {/* Add more regions as needed */}
          </select>
        </label>
        <label>
          <span className="text-xs text-gray-600">Business Unit</span>
          <select className="ml-2 p-1 border rounded" value={businessUnit} onChange={e => setBusinessUnit(e.target.value)}>
            {company.businessUnits.map(bu => <option key={bu} value={bu}>{bu}</option>)}
          </select>
        </label>
        <div className="flex-1 min-w-[120px]">
          <Line
            data={sparklineData}
            options={{
              plugins: { legend: { display: false } },
              scales: { x: { display: false }, y: { display: false } },
              elements: { line: { borderWidth: 2 }, point: { radius: 0 } },
              animation: { duration: 800 },
              responsive: true,
              maintainAspectRatio: false,
            }}
            height={40}
          />
        </div>
      </div>
    </section>
  );
}
