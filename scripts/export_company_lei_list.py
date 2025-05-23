import sqlite3
import pandas as pd
import os

DATABASE_NAME = 'corporate_emissions.sqlite'
OUTPUT_CSV_NAME = 'company_lei_list.csv'
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUTPUT_CSV_PATH = os.path.join(PROJECT_ROOT, OUTPUT_CSV_NAME)

def export_company_lei_data():
    """
    Connects to SQLite, fetches unique company names and their LEI codes,
    and exports it to a CSV file.
    """
    db_path = os.path.join(PROJECT_ROOT, DATABASE_NAME)
    if not os.path.exists(db_path):
        print("Error: Database file '{}' not found at '{}'.".format(DATABASE_NAME, db_path))
        return

    conn = sqlite3.connect(db_path)
    print("Connected to database '{}'.".format(DATABASE_NAME))

    query = """
    SELECT DISTINCT
        company_name,
        lei
    FROM Companies
    ORDER BY company_name;
    """

    print("Fetching company names and LEI codes...")
    try:
        df = pd.read_sql_query(query, conn)
        print("Data fetched successfully. Shape: {}".format(df.shape))

        if not df.empty:
            # Rename columns for clarity in CSV if desired
            df.rename(columns={'company_name': 'Company Name', 'lei': 'LEI Code'}, inplace=True)
            df.to_csv(OUTPUT_CSV_PATH, index=False, encoding='utf-8')
            print("Company LEI list successfully exported to '{}'".format(OUTPUT_CSV_PATH))
        else:
            print("No company data found in the Companies table. CSV file not created.")

    except Exception as e:
        print("An error occurred during data fetching or CSV export: {}".format(e))
    finally:
        conn.close()
        print("Database connection closed.")

if __name__ == '__main__':
    export_company_lei_data()
