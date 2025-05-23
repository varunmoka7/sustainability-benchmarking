// ReportsSection.jsx
import React, { useState, useMemo } from "react";

export default function ReportsSection({ company }) {
  const { reports } = company;  // from mockCompany.reports :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = useMemo(
    () => Array.from(new Set(reports.flatMap(r => r.tags))),
    [reports]
  );

  const filtered = useMemo(
    () =>
      selectedTag === "All"
        ? reports
        : reports.filter(r => r.tags.includes(selectedTag)),
    [reports, selectedTag]
  );

  return (
    <section aria-labelledby="reports-heading" className="mb-8">
      <h2 id="reports-heading" className="sr-only">Reports</h2>

      {/* Tag filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Filter by tag:</span>
        <select
          value={selectedTag}
          onChange={e => setSelectedTag(e.target.value)}
          className="p-1 border rounded"
        >
          <option value="All">All</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(report => (
          <div
            key={report.id}
            className="dashboard-card flex flex-col justify-between p-4"
          >
            <h3 className="font-semibold text-gray-800">{report.type}</h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {report.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-gray-200 rounded px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={report.file}
              download
              className="mt-4 inline-block bg-green-600 text-white text-sm font-medium px-3 py-1 rounded hover:bg-green-700"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
