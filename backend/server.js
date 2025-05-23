// Simple Express API for CarbonTrack
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to SQLite DB
const db = new sqlite3.Database('./database.sqlite');

// Get all companies
app.get('/api/companies', (req, res) => {
  db.all('SELECT * FROM companies', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get one company by id
app.get('/api/companies/:id', (req, res) => {
  db.get('SELECT * FROM companies WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Get emissions for a company
app.get('/api/emissions/:companyId', (req, res) => {
  db.all('SELECT * FROM emissions WHERE company_id = ?', [req.params.companyId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
