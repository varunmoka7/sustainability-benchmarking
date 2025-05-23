import sqlite3
import pandas as pd
import os

DATABASE_NAME = 'corporate_emissions.sqlite'
OUTPUT_CSV_NAME = 'excel_pivoted_scope_data.csv'
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUTPUT_CSV_PATH = os.path.join(PROJECT_ROOT, OUTPUT_CSV_NAME)

def export_pivoted_data():
    """
    Connects to SQLite, fetches emissions data for Scope 1, 2, and 3 Total,
    pivots it to have scopes as columns, and exports to CSV.
    """
    db_path = os.path.join(PROJECT_ROOT, DATABASE_NAME)
    if not os.path.exists(db_path):
        print("Error: Database file '{}' not found at '{}'.".format(DATABASE_NAME, db_path))
        return

    conn = sqlite3.connect(db_path)
    print("Connected to database '{}'.".format(DATABASE_NAME))

    query = """
    SELECT
        C.company_id,
        C.company_name,
        C.country,
        C.sector,
        C.industry,
        E.reporting_period,
        E.scope_type,
        E.value,
        E.unit
    FROM Emissions E
    JOIN Companies C ON E.company_id = C.company_id
    WHERE E.scope_type IN ('Scope 1', 'Scope 2', 'Scope 3 Total');
    """

    print("Fetching data for pivoting...")
    try:
        df = pd.read_sql_query(query, conn)
        print("Data fetched successfully. Shape before pivot: {}".format(df.shape))

        if df.empty:
            print("No data found for Scope 1, Scope 2, or Scope 3 Total. CSV not created.")
            return

        # Pivot the table
        # We need a unique identifier for each row before pivoting if there are multiple entries
        # for the same company, year, and scope (which shouldn't happen for 'Total' scopes).
        # If it could, group by and sum first. Assuming one value per company/year/scope_type here.
        
        df_pivot = df.pivot_table(
            index=['company_id', 'company_name', 'country', 'sector', 'industry', 'reporting_period', 'unit'],
            columns='scope_type',
            values='value'
        ).reset_index()

        # Rename columns for clarity if needed, e.g., spaces if Excel prefers
        # df_pivot.columns.name = None # Remove the columns' name if it's 'scope_type'

        # Ensure all three scope columns exist, fill missing with 0 or NaN
        for scope_col in ['Scope 1', 'Scope 2', 'Scope 3 Total']:
            if scope_col not in df_pivot.columns:
                df_pivot[scope_col] = pd.NA # Or 0.0 if you prefer zeros for missing scopes

        print("Data pivoted. Shape after pivot: {}".format(df_pivot.shape))

        # Reorder columns for better readability
        ordered_columns = [
            'company_id', 'company_name', 'country', 'sector', 'industry', 'reporting_period', 
            'Scope 1', 'Scope 2', 'Scope 3 Total', 'unit'
        ]
        # Filter for columns that actually exist in df_pivot to avoid errors
        final_columns = [col for col in ordered_columns if col in df_pivot.columns]
        df_pivot = df_pivot[final_columns]

        df_pivot.to_csv(OUTPUT_CSV_PATH, index=False, encoding='utf-8')
        print("Pivoted data successfully exported to '{}'".format(OUTPUT_CSV_PATH))

    except Exception as e:
        print("An error occurred: {}".format(e))
    finally:
        conn.close()
        print("Database connection closed.")

if __name__ == '__main__':
    export_pivoted_data()
