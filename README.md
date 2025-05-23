# Sustainability Benchmarking Project

A comprehensive dashboard application for analyzing, visualizing, and benchmarking corporate sustainability metrics, with a focus on carbon emissions data.

## Project Overview

The Sustainability Benchmarking Project is a data-driven application that allows companies to:

1. **Analyze Emissions** - View and understand Scope 1, 2, and 3 emissions data
2. **Compare Performance** - Benchmark against industry peers and standards
3. **Track Progress** - Monitor emissions reductions over time
4. **Set Targets** - Define and track sustainability goals
5. **Create Custom Peer Groups** - Build tailored comparison groups for meaningful benchmarking

## Key Components

The project consists of the following main components:

### 1. Database Layer

- **SQLite Database**: `corporate_emissions.sqlite`
- **Tables**:
  - Companies - Core company information
  - Emissions - Detailed emissions data by scope and category
  - DataSources - References to data sources
  - IndustryBenchmarks - Industry-specific benchmarking data
  - CompanyTargets - Emissions reduction targets and goals
  - PeerGroups & PeerGroupCompanies - Custom peer group functionality
  - EmissionsIntensity - Normalized metrics (per employee, per revenue)

### 2. Data Processing Scripts

- `load_csv_to_sqlite.py` - Imports raw CSV data into SQLite
- `structure_database.py` - Transforms raw data into structured tables
- `setup_benchmarking.py` - Creates and populates benchmarking tables
- Various export scripts for data extraction and transformation

### 3. Visualization Interfaces

- **Streamlit Dashboard** (`dashboard_app.py`):
  - Overview tab with global emissions data
  - Company Deep Dive for individual company analysis
  - Sector/Industry Analysis for broader trends
  - Benchmarking for comparative analysis
  
- **Peer Group Manager** (`peer_group_manager.py`):
  - Create and manage custom peer groups
  - Analyze emissions within defined peer sets
  - Rank companies within tailored comparison groups

- **Next.js Web Application** (in development):
  - Modern, responsive interface
  - Advanced data visualization
  - Improved user experience and interaction

## Getting Started

### Prerequisites

- Python 3.7 or higher
- Required Python packages: streamlit, pandas, plotly, sqlite3

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sustainability_benchmarking.git
   cd sustainability_benchmarking
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize the database and benchmark data:
   ```bash
   python scripts/load_csv_to_sqlite.py
   python scripts/structure_database.py
   python scripts/setup_benchmarking.py
   ```

4. Run the dashboard:
   ```bash
   streamlit run dashboard_app.py
   ```

5. Run the peer group manager (optional):
   ```bash
   streamlit run peer_group_manager.py
   ```

## Data Model

The project uses a relational data model with the following key relationships:

- Companies have many Emissions records
- Companies belong to Industries and Sectors
- Companies can belong to multiple PeerGroups
- IndustryBenchmarks provide reference points for comparison
- EmissionsIntensity normalizes data for fair comparison
- CompanyTargets track sustainability goals and commitments

## Future Development

The project is evolving from a Streamlit-based prototype to a more comprehensive Next.js web application with:

- Enhanced user interface and experience
- Advanced data visualization capabilities
- Improved filtering and comparison tools
- API-based data access layer
- User authentication and profiles
- Advanced analytics and reporting

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to suggest improvements or report bugs.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
