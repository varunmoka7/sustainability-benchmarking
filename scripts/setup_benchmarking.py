import sqlite3
import pandas as pd
import numpy as np

DATABASE_NAME = 'corporate_emissions.sqlite'

def connect_db():
    """Connects to the SQLite database."""
    return sqlite3.connect(DATABASE_NAME)

def create_benchmarks_tables():
    """Creates tables for industry benchmarks and targets"""
    conn = connect_db()
    cursor = conn.cursor()
    
    # Create Industry Benchmarks Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS IndustryBenchmarks (
        benchmark_id INTEGER PRIMARY KEY AUTOINCREMENT,
        sector TEXT,
        industry TEXT,
        year INTEGER,
        scope_type TEXT,
        scope_3_category TEXT,
        median_value REAL,
        p25_value REAL,
        p75_value REAL,
        best_in_class_value REAL,
        unit TEXT,
        intensity_factor TEXT,
        notes TEXT
    )
    ''')
    
    # Create Company Targets Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS CompanyTargets (
        target_id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id TEXT,
        target_type TEXT, -- e.g., 'net-zero', 'reduction', 'SBTi'
        scope_type TEXT,
        base_year INTEGER,
        target_year INTEGER,
        reduction_percentage REAL,
        status TEXT, -- e.g., 'committed', 'set', 'achieved'
        validation_source TEXT,
        details TEXT,
        FOREIGN KEY (company_id) REFERENCES Companies(company_id)
    )
    ''')
    
    # Create Peer Groups Table for custom benchmarking
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS PeerGroups (
        group_id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create junction table for PeerGroups and Companies
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS PeerGroupCompanies (
        group_id INTEGER,
        company_id TEXT,
        PRIMARY KEY (group_id, company_id),
        FOREIGN KEY (group_id) REFERENCES PeerGroups(group_id),
        FOREIGN KEY (company_id) REFERENCES Companies(company_id)
    )
    ''')
    
    # Create EmissionsIntensity Table for normalized comparisons
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS EmissionsIntensity (
        intensity_id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id TEXT,
        reporting_period TEXT,
        scope_type TEXT,
        revenue_intensity REAL, -- emissions per million USD revenue
        employee_intensity REAL, -- emissions per employee
        unit TEXT,
        FOREIGN KEY (company_id) REFERENCES Companies(company_id)
    )
    ''')
    
    conn.commit()
    print("Benchmark tables created successfully")
    conn.close()

def generate_initial_benchmarks():
    """Generate initial industry benchmarks based on existing data"""
    conn = connect_db()
    
    # Get all emissions data by industry and scope
    emissions_query = '''
    SELECT 
        C.sector,
        C.industry,
        E.reporting_period as year,
        E.scope_type,
        E.scope_3_category_detail,
        E.value,
        E.unit
    FROM Emissions E
    JOIN Companies C ON E.company_id = C.company_id
    WHERE E.scope_type IN ('Scope 1', 'Scope 2', 'Scope 3 Total')
    '''
    
    df_emissions = pd.read_sql_query(emissions_query, conn)
    
    # Convert reporting_period to numeric for calculations
    df_emissions['year'] = pd.to_numeric(df_emissions['year'], errors='coerce')
    
    # Group by sector, industry, year, and scope_type to calculate benchmarks
    benchmarks = []
    
    for (sector, industry, year, scope_type), group in df_emissions.groupby(['sector', 'industry', 'year', 'scope_type']):
        if len(group) >= 3:  # Only calculate benchmarks if we have at least 3 companies
            values = group['value'].dropna()
            median = values.median()
            p25 = values.quantile(0.25)
            p75 = values.quantile(0.75)
            best_in_class = values.min() if scope_type in ['Scope 1', 'Scope 2', 'Scope 3 Total'] else None
            
            unit = group['unit'].mode()[0] if not group['unit'].empty else 'mtCO2e'
            
            benchmarks.append({
                'sector': sector,
                'industry': industry,
                'year': year,
                'scope_type': scope_type,
                'scope_3_category': None,
                'median_value': median,
                'p25_value': p25,
                'p75_value': p75,
                'best_in_class_value': best_in_class,
                'unit': unit,
                'intensity_factor': None,
                'notes': f'Based on {len(group)} companies'
            })
    
    # Now create benchmarks for Scope 3 categories
    s3_query = '''
    SELECT 
        C.sector,
        C.industry,
        E.reporting_period as year,
        E.scope_type,
        E.scope_3_category_detail,
        E.value,
        E.unit
    FROM Emissions E
    JOIN Companies C ON E.company_id = C.company_id
    WHERE E.scope_type = 'Scope 3 Category'
    '''
    
    df_s3 = pd.read_sql_query(s3_query, conn)
    df_s3['year'] = pd.to_numeric(df_s3['year'], errors='coerce')
    
    for (sector, industry, year, cat), group in df_s3.groupby(['sector', 'industry', 'year', 'scope_3_category_detail']):
        if len(group) >= 3:
            values = group['value'].dropna()
            median = values.median()
            p25 = values.quantile(0.25)
            p75 = values.quantile(0.75)
            best_in_class = values.min()
            
            unit = group['unit'].mode()[0] if not group['unit'].empty else 'mtCO2e'
            
            benchmarks.append({
                'sector': sector,
                'industry': industry,
                'year': year,
                'scope_type': 'Scope 3 Category',
                'scope_3_category': cat,
                'median_value': median,
                'p25_value': p25,
                'p75_value': p75,
                'best_in_class_value': best_in_class,
                'unit': unit,
                'intensity_factor': None,
                'notes': f'Based on {len(group)} companies'
            })
    
    # Insert benchmarks into database
    if benchmarks:
        df_benchmarks = pd.DataFrame(benchmarks)
        df_benchmarks.to_sql('IndustryBenchmarks', conn, if_exists='append', index=False)
        print(f"Added {len(benchmarks)} industry benchmarks to database")
    else:
        print("No benchmarks could be generated from the current data")
    
    conn.close()

def calculate_emissions_intensity():
    """Calculate emissions intensity metrics for all companies"""
    conn = connect_db()
    
    # Get emissions data and company revenue/employee information
    query = '''
    SELECT 
        E.company_id,
        C.company_name,
        E.reporting_period,
        E.scope_type,
        E.value,
        E.unit,
        C.employees
    FROM Emissions E
    JOIN Companies C ON E.company_id = C.company_id
    WHERE E.scope_type IN ('Scope 1', 'Scope 2', 'Scope 3 Total')
    '''
    
    df = pd.read_sql_query(query, conn)
    
    # Convert employees to numeric
    df['employees'] = pd.to_numeric(df['employees'], errors='coerce')
    
    # Calculate intensity metrics where employee data is available
    intensities = []
    
    for (company_id, reporting_period, scope_type), group in df.groupby(['company_id', 'reporting_period', 'scope_type']):
        # Get the first value (there should only be one per company/year/scope)
        value = group['value'].iloc[0]
        unit = group['unit'].iloc[0]
        employees = group['employees'].iloc[0]
        
        # Calculate employee intensity if employee data is available
        employee_intensity = value / employees if pd.notna(employees) and employees > 0 else None
        
        intensities.append({
            'company_id': company_id,
            'reporting_period': reporting_period,
            'scope_type': scope_type,
            'revenue_intensity': None,  # We don't have revenue data yet
            'employee_intensity': employee_intensity,
            'unit': f"{unit}/employee" if employee_intensity is not None else unit
        })
    
    # Insert into database
    if intensities:
        df_intensities = pd.DataFrame(intensities)
        df_intensities.to_sql('EmissionsIntensity', conn, if_exists='append', index=False)
        print(f"Added {len(intensities)} intensity records to database")
    else:
        print("No intensity metrics could be calculated")
    
    conn.close()

if __name__ == '__main__':
    print("Creating new benchmark tables...")
    create_benchmarks_tables()
    
    print("\nGenerating initial industry benchmarks...")
    generate_initial_benchmarks()
    
    print("\nCalculating emissions intensity metrics...")
    calculate_emissions_intensity()
    
    print("\nBenchmarking database setup complete!")
