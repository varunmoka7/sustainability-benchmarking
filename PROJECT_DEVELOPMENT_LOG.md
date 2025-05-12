# Project Development Log: Corporate Emissions Dashboard

This document summarizes the development process of the Corporate Emissions Dashboard, tracking the evolution from an initial Streamlit application to a more complex Next.js web application.

## Phase 1: Initial Data Exploration & Streamlit Dashboard (Proof of Concept)

**Objective:** Analyze company emissions data from `Data for Varun.csv` and create an interactive dashboard.

**Key Steps & Decisions:**

1.  **Data Access:**
    *   Initial attempt to read `../Data for Varun.csv` failed due to size.
    *   User provided `data for varun lite - Sheet1.csv` for schema understanding.
    *   **Decision:** Proceed with the "lite" version for initial development, then adapt for the full dataset.

2.  **Streamlit App (`dashboard_app.py`) - Iteration 1 (Focus on Banks):**
    *   **Goal:** Filter bank data, analyze Scope 1, 2, 3 emissions, and create a visual dashboard.
    *   **Plan:** Load CSV, use SQL to filter banks, structure data, build dashboard.
    *   **User Feedback:** Shifted strategy away from focusing solely on banks.

3.  **Streamlit App - Iteration 2 (Full Dataset & General Dashboard):**
    *   **Goal:** Create an interactive dashboard for the full dataset (`../Data for Varun.csv`) showing Scope 1, 2, 3, and Scope 3 category emissions.
    *   **Data Loading (`scripts/load_csv_to_sqlite.py`):**
        *   Created Python script to read the large CSV in chunks and load it into an SQLite database (`corporate_emissions.sqlite`) in a table named `RawEmissionData`.
        *   Addressed Python 2 vs Python 3 f-string syntax errors.
        *   Addressed `ImportError: No module named pandas` by ensuring `python3` (which had pandas) was used.
    *   **Database Structuring (`scripts/structure_database.py`):**
        *   Created Python script to process `RawEmissionData` and populate structured tables: `Companies`, `Emissions`, `DataSources`.
        *   Handled potential integrity errors during population.
    *   **Dashboard Implementation (`dashboard_app.py`):**
        *   Initial version with sidebar filters (Reporting Year, Country, Sector, Industry).
        *   Tabs: Overview, Company Deep Dive, Sector/Industry Analysis.
        *   KPI cards and Plotly charts.
    *   **Visual Iterations & Debugging:**
        *   Addressed `TypeError: Failed to fetch dynamically imported module` (likely browser/Plotly rendering issue, often resolved by hard refresh or running on a new port).
        *   User feedback on small font sizes led to several CSS updates to enlarge text and improve layout.
        *   User feedback on "no data available" when filters applied. Debugging showed this was due to specific filter combinations having no matching data, not a bug in filter logic itself.
        *   **Key Change:** Removed sidebar filters to focus on a main dashboard presentation. `df_all_data` loaded initially. Company selection moved into the "Company Deep Dive" tab.
        *   **Company Deep Dive Tab Changes:**
            *   Removed emissions trend line chart.
            *   Added a new table for annual Scope 1, 2, 3 Total emissions.
            *   Modified Scope 3 Category Emissions table.
            *   **Decision:** Filter data in this tab for the selected company's **own last 5 available reporting years**, not globally last 5 years. This was a key refinement to ensure data relevance.

## Phase 2: Pivot to Next.js Application

**Objective:** Build a responsive, data-driven web app with a look & feel similar to Climate Action Tracker’s “Data Explorer → Country emissions” page, using Next.js, React, Tailwind CSS, and the company emissions database.

**Key Requirements & Outputs:**

1.  **Layout & Navigation:**
    *   Fixed top bar (logo, main menu items).
    *   Data Explorer sub-navigation.
    *   Mobile-friendly hamburger menu.
2.  **"Company Emissions" View (adapted from "Country Emissions"):**
    *   Hero section with title.
    *   Company selector (searchable dropdown).
    *   "Add to compare", "RESET", "DATA DOWNLOAD" buttons.
    *   Graph toggler.
3.  **Charts & Tables:**
    *   Line/bar chart for emissions over time.
    *   Responsive table for raw values.
    *   Interactive tooltips.
4.  **Styling & Theming:**
    *   Defined color palette (pastel blue banner, teal accents, WCAG AA focus).
    *   Consistent typography and spacing.
5.  **Extras:** Cookie banner, informational notes, footer.

**Generated Files & Structure for Next.js Project:**

*   **`color_palette.json`:** Defines the color scheme.
    *   *Note: Initial version had comments, which were removed as JSON doesn't support them.*
*   **`.streamlit/config.toml`:** (This was for the Streamlit app, now superseded by Tailwind config for Next.js).
*   **`tailwind.config.ts`:** Tailwind CSS configuration with custom colors and font setup.
    *   *Note: Pointed out potential TypeScript errors due to missing Node/Tailwind types in a bare environment.*
*   **`src/styles/globals.css`:** Base Tailwind styles and custom global CSS.
*   **`src/lib/data-fetchers.ts`:** Conceptual server-side functions to query `corporate_emissions.sqlite` using `sqlite` and `sqlite3` libraries. Includes functions like `getAllCompanyNames`, `getCompanyEmissionsById`, `getAnnualCompanyScopeTotals`, `getCompanyScope3Categories`.
*   **App Router Layouts:**
    *   `src/app/(main-layout)/layout.tsx`: Root layout including NavBar, Footer, CookieBanner.
    *   `src/app/(data-explorer-layout)/layout.tsx`: Layout for data explorer sections.
*   **Core Components (`src/components/layout/`):**
    *   `NavBar.tsx`
    *   `DataExplorerSubNav.tsx`
    *   `Footer.tsx`
    *   `CookieBanner.tsx`
*   **UI Components (`src/components/ui/`):**
    *   `IconButton.tsx`
*   **Company Emissions Components (initially in `src/components/country-emissions/`, to be renamed to `src/components/company-emissions/`):**
    *   `CompanySelectorControls.tsx` (adapted from CountrySelector)
    *   `ChartView.tsx`
    *   `DataDownloadButton.tsx`
    *   `EmissionsTable.tsx`
*   **Page Component (`src/app/(data-explorer-layout)/country-emissions-analysis/page.tsx`):**
    *   Main page for displaying company emissions.
    *   Adapted to use "Company" data and new data fetchers.
    *   Includes hero section, selector, chart, tables, download button.
    *   Uses mock data fetching initially, to be replaced by calls to `data-fetchers.ts` (likely via API routes or Server Components).
*   **`STYLE_GUIDE.md`:** Document outlining target visual styles for the Next.js app.

**Final State & Next Steps for User:**

The process concluded with the generation of the foundational files for the Next.js application. The user's next steps are:
1.  Set up a new Next.js project environment (`npx create-next-app`).
2.  Install all necessary dependencies (`next`, `react`, `tailwindcss`, `lucide-react`, `recharts`, `@headlessui/react`, `sqlite`, `sqlite3`, and relevant `@types/*`).
3.  Copy the generated files into this new project structure, renaming directories/files as needed (e.g., `country-emissions` to `company-emissions`).
4.  Place `corporate_emissions.sqlite` in the project root (or adjust path in `data-fetchers.ts`).
5.  Implement the actual server-side data fetching logic (e.g., using Next.js API Routes or Server Components that call functions in `data-fetchers.ts`).
6.  Run `npm run dev` to start the development server and view/debug the application.

This log captures the main trajectory of our collaborative development effort.
