import sqlite3
import pandas as pd
import json

DATABASE_NAME = 'corporate_emissions.sqlite'
RAW_DATA_TABLE = 'RawEmissionData'

def connect_db():
    """Connects to the SQLite database."""
    return sqlite3.connect(DATABASE_NAME)

def create_structured_tables(conn):
    """Creates the structured tables if they don't already exist."""
    cursor = conn.cursor()

    # Drop tables if they exist for a clean run (optional, good for development)
    # cursor.execute("DROP TABLE IF EXISTS Emissions")
    # cursor.execute("DROP TABLE IF EXISTS Companies")
    # cursor.execute("DROP TABLE IF EXISTS DataSources")

    # Create Companies Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Companies (
        company_id TEXT PRIMARY KEY,
        lei TEXT UNIQUE,
        figi TEXT,
        ticker TEXT,
        mic_code TEXT,
        exchange TEXT,
        permid TEXT,
        company_name TEXT,
        country TEXT,
        sector TEXT,
        industry TEXT,
        employees INTEGER
    )
    ''')
    print("Table 'Companies' created or already exists.")

    # Create DataSources Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS DataSources (
        document_id TEXT PRIMARY KEY,
        source_names TEXT,
        source_urls TEXT
    )
    ''')
    print("Table 'DataSources' created or already exists.")

    # Create Emissions Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Emissions (
        emission_id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id TEXT,
        year_of_disclosure INTEGER,
        reporting_period TEXT,
        metric_name TEXT,
        scope_type TEXT,
        scope_3_category_detail TEXT,
        value REAL,
        unit TEXT,
        document_id TEXT,
        FOREIGN KEY (company_id) REFERENCES Companies(company_id),
        FOREIGN KEY (document_id) REFERENCES DataSources(document_id)
    )
    ''')
    print("Table 'Emissions' created or already exists.")
    
    conn.commit()
    print("Structured tables created successfully.")

def populate_companies_table(conn):
    """Populates the Companies table from RawEmissionData."""
    print("Populating 'Companies' table...")
    df_raw = pd.read_sql_query(f"SELECT DISTINCT company_id, lei, figi, ticker, mic_code, exchange, permid, company_name, country, sector, industry, employees FROM {RAW_DATA_TABLE}", conn)
    
    # Ensure company_id is not null for primary key constraint
    df_raw = df_raw.dropna(subset=['company_id'])
    df_raw['employees'] = pd.to_numeric(df_raw['employees'], errors='coerce').astype('Int64') # Handle potential non-numeric employee counts

    try:
        df_raw.to_sql('Companies', conn, if_exists='append', index=False)
        print(f"{len(df_raw)} unique companies loaded/updated into 'Companies' table.")
    except sqlite3.IntegrityError as e:
        print(f"Integrity error (likely duplicate company_id or lei) while populating Companies: {e}")
        print("Attempting to insert non-duplicate rows...")
        # Fallback: Insert row by row, skipping duplicates
        cursor = conn.cursor()
        inserted_count = 0
        for _, row in df_raw.iterrows():
            try:
                cursor.execute('''
                    INSERT INTO Companies (company_id, lei, figi, ticker, mic_code, exchange, permid, company_name, country, sector, industry, employees)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', tuple(row))
                inserted_count += 1
            except sqlite3.IntegrityError:
                pass # Skip duplicate
        conn.commit()
        print(f"{inserted_count} unique companies newly inserted into 'Companies' table (duplicates skipped).")


def populate_datasources_table(conn):
    """Populates the DataSources table from RawEmissionData."""
    print("Populating 'DataSources' table...")
    df_raw = pd.read_sql_query(f"SELECT DISTINCT document_id, source_names, source_urls FROM {RAW_DATA_TABLE}", conn)
    
    # Ensure document_id is not null
    df_raw = df_raw.dropna(subset=['document_id'])

    try:
        df_raw.to_sql('DataSources', conn, if_exists='append', index=False)
        print(f"{len(df_raw)} unique data sources loaded/updated into 'DataSources' table.")
    except sqlite3.IntegrityError as e:
        print(f"Integrity error (likely duplicate document_id) while populating DataSources: {e}")
        print("Attempting to insert non-duplicate rows...")
        cursor = conn.cursor()
        inserted_count = 0
        for _, row in df_raw.iterrows():
            try:
                cursor.execute('''
                    INSERT INTO DataSources (document_id, source_names, source_urls)
                    VALUES (?, ?, ?)
                ''', tuple(row))
                inserted_count += 1
            except sqlite3.IntegrityError:
                pass # Skip duplicate
        conn.commit()
        print(f"{inserted_count} unique data sources newly inserted into 'DataSources' table (duplicates skipped).")


def populate_emissions_table(conn):
    """Populates the Emissions table from RawEmissionData."""
    print("Populating 'Emissions' table...")
    df_raw = pd.read_sql_query(f"SELECT company_id, year_of_disclosure, reporting_period, metric, scope, emissions_sources, value, unit, document_id FROM {RAW_DATA_TABLE}", conn)

    emissions_data = []
    for _, row in df_raw.iterrows():
        metric = str(row['metric']).strip() if pd.notna(row['metric']) else ""
        scope_val = str(row['scope']).strip() if pd.notna(row['scope']) else "" # Scope from CSV, e.g. ["Scope 1"]
        
        scope_type = None
        scope_3_category_detail = None

        if "Total Scope 1 GHG Emissions" in metric:
            scope_type = "Scope 1"
        elif "Total Scope 2 GHG Emissions" in metric:
            scope_type = "Scope 2"
        elif "Total Scope 3 GHG Emissions" in metric:
            scope_type = "Scope 3 Total"
        elif "Sources of Scope 3 GHG Emissions" in metric:
            scope_type = "Scope 3 Category"
            # emissions_sources column contains the category details, e.g., "[\"Scope 3 - Business Travel (Cat. 6)\"]"
            # We need to parse this JSON-like string
            try:
                sources_list = json.loads(row['emissions_sources'])
                if isinstance(sources_list, list) and len(sources_list) > 0:
                    scope_3_category_detail = sources_list[0] # Take the first category if multiple
            except (json.JSONDecodeError, TypeError):
                scope_3_category_detail = str(row['emissions_sources']) # Store as string if not parsable JSON
        
        # Only add if it's one of the scopes we care about
        if scope_type:
            emissions_data.append({
                'company_id': row['company_id'],
                'year_of_disclosure': row['year_of_disclosure'],
                'reporting_period': row['reporting_period'],
                'metric_name': metric,
                'scope_type': scope_type,
                'scope_3_category_detail': scope_3_category_detail,
                'value': pd.to_numeric(row['value'], errors='coerce'),
                'unit': row['unit'],
                'document_id': row['document_id']
            })

    if not emissions_data:
        print("No relevant emissions data found to populate 'Emissions' table.")
        return

    df_emissions = pd.DataFrame(emissions_data)
    df_emissions = df_emissions.dropna(subset=['value']) # Ensure 'value' is not NaN

    df_emissions.to_sql('Emissions', conn, if_exists='append', index=False)
    print(f"{len(df_emissions)} records loaded into 'Emissions' table.")


if __name__ == '__main__':
    conn = connect_db()
    if conn:
        try:
            # It's safer to create tables first, then populate.
            # If populating fails, tables still exist.
            create_structured_tables(conn) 
            
            # Clear tables before populating to avoid duplicate data on re-runs
            # This is important during development. For production, you might want different logic.
            print("Clearing existing data from structured tables before populating...")
            cursor = conn.cursor()
            cursor.execute("DELETE FROM Emissions")
            cursor.execute("DELETE FROM Companies")
            cursor.execute("DELETE FROM DataSources")
            conn.commit()
            print("Existing data cleared.")

            populate_companies_table(conn)
            populate_datasources_table(conn)
            populate_emissions_table(conn) # Populate this last due to foreign key constraints
            
            print("Database structuring and population complete.")
        except Exception as e:
            print(f"An error occurred during database structuring: {e}")
        finally:
            conn.close()
            print("Database connection closed.")
