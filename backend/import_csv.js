// import_csv.js
// Usage: node import_csv.js
// This script loads company and emissions data from CSV into SQLite

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const path = require('path');

const db = new sqlite3.Database('./database.sqlite');

// Paths to your CSV files (adjust as needed)
const companyCsv = path.join(__dirname, '../data_analysis/excel_dashboard_data_CODE2.csv');

// 1. Create tables
function createTables() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT,
      sector TEXT,
      industry TEXT,
      status TEXT,
      overview TEXT,
      sustainabilityRating INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS emissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id TEXT,
      year INTEGER,
      scope1 INTEGER,
      scope2 INTEGER,
      scope3 INTEGER,
      FOREIGN KEY(company_id) REFERENCES companies(id)
    )`);
  });
}

// 2. Import companies and emissions from CSV
function importData() {
  const companies = {};
  // emissionsMap: { [company_id]: { [year]: { scope1, scope2, scope3 } } }
  const emissionsMap = {};
  fs.createReadStream(companyCsv)
    .pipe(csv({ mapHeaders: ({ header }) => header && header.trim() })) // Ensure headers are trimmed
    .on('data', (row) => {
      if (!global.__loggedHeaders) {
        console.log('CSV Row Keys:', Object.keys(row));
        global.__loggedHeaders = true;
      }
      const id = row.company_id;
      if (!id) return;
      // Fill company info (use first occurrence)
      if (!companies[id]) {
        companies[id] = {
          id,
          name: row.company_name || row['Company Name'] || row['company name'] || null, // Try common variants
          sector: row.sector,
          industry: row.industry,
          status: null,
          overview: null,
          sustainabilityRating: 0
        };
      }
      // Aggregate emissions by year and scope
      const year = parseInt(row.year_of_disclosure);
      if (!year) return;
      if (!emissionsMap[id]) emissionsMap[id] = {};
      if (!emissionsMap[id][year]) emissionsMap[id][year] = { scope1: 0, scope2: 0, scope3: 0 };
      const val = parseFloat(row.value) || 0;
      if (row.scope_type === 'Scope 1') emissionsMap[id][year].scope1 += val;
      if (row.scope_type === 'Scope 2') emissionsMap[id][year].scope2 += val;
      if (row.scope_type && row.scope_type.startsWith('Scope 3')) emissionsMap[id][year].scope3 += val;
    })
    .on('end', () => {
      db.serialize(() => {
        const insertCompany = db.prepare('INSERT OR REPLACE INTO companies (id, name, sector, industry, status, overview, sustainabilityRating) VALUES (?, ?, ?, ?, ?, ?, ?)');
        Object.values(companies).forEach(c => {
          insertCompany.run([c.id, c.name, c.sector, c.industry, c.status, c.overview, c.sustainabilityRating]);
        });
        insertCompany.finalize();
        const insertEmissions = db.prepare('INSERT INTO emissions (company_id, year, scope1, scope2, scope3) VALUES (?, ?, ?, ?, ?)');
        Object.entries(emissionsMap).forEach(([cid, years]) => {
          Object.entries(years).forEach(([year, e]) => {
            insertEmissions.run([cid, year, e.scope1, e.scope2, e.scope3]);
          });
        });
        insertEmissions.finalize();
        console.log('Import complete!');
        db.close();
      });
    });
}

createTables();
importData();
