// src/lib/data-fetchers.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; // Using 'sqlite' wrapper for async/await
import path from 'path';

// Define the path to your SQLite database file
// This path needs to be correct relative to where your Next.js server-side code executes.
// For local development, if the db is in the project root:
const DATABASE_PATH = path.join(process.cwd(), 'corporate_emissions.sqlite'); 
// Note: For Vercel/Netlify, file-based SQLite is problematic. Consider a managed DB or other solutions.

// Define interfaces for your data structures (mirroring your SQLite schema)
export interface Company {
  company_id: string;
  lei?: string | null;
  company_name: string;
  country?: string | null;
  sector?: string | null;
  industry?: string | null;
  employees?: number | null;
  // Add other fields from your Companies table
}

export interface EmissionRecord {
  reporting_period: string;
  scope_type: string; // 'Scope 1', 'Scope 2', 'Scope 3 Total', 'Scope 3 Category'
  scope_3_category_detail?: string | null;
  value: number | null;
  unit?: string | null;
  // Add other fields from your Emissions table
}

export interface CompanyEmissionsData {
  company: Company;
  emissions: EmissionRecord[];
}

// Helper function to open the database connection
async function openDb() {
  return open({
    filename: DATABASE_PATH,
    driver: sqlite3.Database
  });
}

// Fetch all company names for the selector
export async function getAllCompanyNames(): Promise<Pick<Company, 'company_id' | 'company_name'>[]> {
  const db = await openDb();
  try {
    const companies = await db.all<Pick<Company, 'company_id' | 'company_name'>[]>(
      "SELECT company_id, company_name FROM Companies ORDER BY company_name ASC"
    );
    return companies || [];
  } catch (error) {
    console.error("Failed to fetch company names:", error);
    return []; // Return empty array on error
  } finally {
    await db.close();
  }
}

// Fetch detailed emissions data for a specific company
export async function getCompanyEmissionsById(companyId: string): Promise<CompanyEmissionsData | null> {
  if (!companyId) return null;

  const db = await openDb();
  try {
    const company = await db.get<Company>(
      "SELECT * FROM Companies WHERE company_id = ?", 
      companyId
    );

    if (!company) {
      console.warn(`Company with ID ${companyId} not found.`);
      return null;
    }

    // Fetch emissions data for this company (example: last 5-10 years)
    // You might want to add more sophisticated year filtering here
    const emissions = await db.all<EmissionRecord[]>(
      `SELECT reporting_period, scope_type, scope_3_category_detail, value, unit 
       FROM Emissions 
       WHERE company_id = ? 
       ORDER BY reporting_period DESC`, // Fetch all, then filter/process in JS if needed for "last 5"
      companyId
    );
    
    return {
      company,
      emissions: emissions || []
    };

  } catch (error) {
    console.error(`Failed to fetch emissions data for company ${companyId}:`, error);
    return null; 
  } finally {
    await db.close();
  }
}

// Example: Fetching data specifically for the "Annual Scope 1, 2, & 3 Total Emissions" table
export async function getAnnualCompanyScopeTotals(companyId: string, lastNYears: string[]): Promise<any[]> {
  if (!companyId || !lastNYears || lastNYears.length === 0) return [];
  const db = await openDb();
  try {
    // Constructing IN clause for years. Ensure years are properly escaped if not using placeholders directly.
    const placeholders = lastNYears.map(() => '?').join(',');
    const query = `
      SELECT reporting_period, scope_type, value, unit
      FROM Emissions
      WHERE company_id = ? 
        AND scope_type IN ('Scope 1', 'Scope 2', 'Scope 3 Total')
        AND reporting_period IN (${placeholders})
      ORDER BY reporting_period DESC;
    `;
    const params = [companyId, ...lastNYears];
    const results = await db.all(query, params);
    return results || [];
  } catch (error) {
    console.error(`Failed to fetch annual scope totals for ${companyId}:`, error);
    return [];
  } finally {
    await db.close();
  }
}

// Example: Fetching Scope 3 Category data for a company for specific years
export async function getCompanyScope3Categories(companyId: string, lastNYears: string[]): Promise<any[]> {
    if (!companyId || !lastNYears || lastNYears.length === 0) return [];
    const db = await openDb();
    try {
      const placeholders = lastNYears.map(() => '?').join(',');
      const query = `
        SELECT reporting_period, scope_3_category_detail, value, unit
        FROM Emissions
        WHERE company_id = ?
          AND scope_type = 'Scope 3 Category'
          AND reporting_period IN (${placeholders})
        ORDER BY reporting_period DESC, scope_3_category_detail ASC;
      `;
      const params = [companyId, ...lastNYears];
      const results = await db.all(query, params);
      return results || [];
    } catch (error) {
      console.error(`Failed to fetch scope 3 categories for ${companyId}:`, error);
      return [];
    } finally {
      await db.close();
    }
}

// Add other data fetching functions as needed (e.g., for sector overview, etc.)
