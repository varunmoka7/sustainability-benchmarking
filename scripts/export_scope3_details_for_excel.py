import sqlite3
import pandas as pd
import os

DATABASE_NAME = 'corporate_emissions.sqlite'
OUTPUT_CSV_NAME = 'excel_scope3_details_data.csv'
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUTPUT_CSV_PATH = os.path.join(PROJECT_ROOT, OUTPUT_CSV_NAME)

def export_scope3_details_data():
    """
    Connects to SQLite, fetches all Scope 3 Category emissions data along with company details,
    and exports it to a CSV file.
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
        E.scope_3_category_detail, /* This is the key field for Scope 3 details */
        E.value,
        E.unit,
        E.metric_name
    FROM Emissions E
    JOIN Companies C ON E.company_id = C.company_id
    WHERE E.scope_type = 'Scope 3 Category'; 
    """

    print("Fetching Scope 3 category data...")
    try:
        df = pd.read_sql_query(query, conn)
        print("Data fetched successfully. Shape: {}".format(df.shape))

        if not df.empty:
            # Sort data for better readability in CSV
            df_sorted = df.sort_values(by=['company_name', 'reporting_period', 'scope_3_category_detail'])
            df_sorted.to_csv(OUTPUT_CSV_PATH, index=False, encoding='utf-8')
            print("Scope 3 category data successfully exported to '{}'".format(OUTPUT_CSV_PATH))
        else:
            print("No Scope 3 Category data found. CSV file not created.")

    except Exception as e:
        print("An error occurred during data fetching or CSV export: {}".format(e))
    finally:
        conn.close()
        print("Database connection closed.")

if __name__ == '__main__':
    export_scope3_details_data()
