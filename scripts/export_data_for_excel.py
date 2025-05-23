import sqlite3
import pandas as pd
import os

DATABASE_NAME = 'corporate_emissions.sqlite'
OUTPUT_CSV_NAME = 'excel_dashboard_data.csv' 
# Output CSV will be in the project root if script is run from project root
# Or relative to where the script is run from. Let's ensure it's in project root.
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUTPUT_CSV_PATH = os.path.join(PROJECT_ROOT, OUTPUT_CSV_NAME)


def export_data_to_csv():
    """
    Connects to the SQLite database, fetches combined emissions and company data,
    and exports it to a CSV file.
    """
    if not os.path.exists(os.path.join(PROJECT_ROOT, DATABASE_NAME)):
        print("Error: Database file '{}' not found in project root '{}'.".format(DATABASE_NAME, PROJECT_ROOT))
        return

    conn = sqlite3.connect(os.path.join(PROJECT_ROOT, DATABASE_NAME))
    print("Connected to database '{}'.".format(DATABASE_NAME))

    query = """
    SELECT
        C.company_name,
        C.country,
        C.sector,
        C.industry,
        C.employees,
        E.reporting_period,
        E.scope_type,
        E.scope_3_category_detail,
        E.value,
        E.unit,
        E.metric_name, 
        C.company_id,
        C.lei,
        E.year_of_disclosure,
        E.document_id
    FROM Emissions E
    JOIN Companies C ON E.company_id = C.company_id
    ORDER BY C.company_name, E.reporting_period DESC;
    """

    print("Fetching data with query...")
    try:
        df = pd.read_sql_query(query, conn)
        print("Data fetched successfully. Shape: {}".format(df.shape))

        if not df.empty:
            df.to_csv(OUTPUT_CSV_PATH, index=False, encoding='utf-8')
            print("Data successfully exported to '{}'".format(OUTPUT_CSV_PATH))
        else:
            print("No data returned from the query. CSV file not created.")

    except Exception as e:
        print("An error occurred during data fetching or CSV export: {}".format(e))
    finally:
        conn.close()
        print("Database connection closed.")

if __name__ == '__main__':
    export_data_to_csv()
