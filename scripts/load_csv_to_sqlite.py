import pandas as pd
import sqlite3
import os

# Define file paths
# Assuming the script is in 'scripts/' and the CSV is one level up from project root
# Adjusting path to be relative to the project root /Users/apple/Desktop/sustainability_benchmarking
CSV_FILE_PATH = '../Data for Varun.csv'
DATABASE_NAME = 'corporate_emissions.sqlite' # Will be created in the project root
TABLE_NAME = 'RawEmissionData'
CHUNK_SIZE = 10000  # Process 10,000 rows at a time

def create_db_and_table(db_name, table_name):
    """Creates an SQLite database and a table if they don't exist."""
    conn = sqlite3.connect(db_name)
    print("Database '{}' created/connected successfully.".format(db_name))
    # No need to create table schema here, pandas to_sql will infer it from the first chunk
    conn.close()

def load_csv_to_db(csv_path, db_name, table_name, chunk_size):
    """Loads data from a CSV file to an SQLite table in chunks."""
    if not os.path.exists(csv_path):
        print("Error: CSV file not found at {}".format(csv_path))
        return

    conn = sqlite3.connect(db_name)
    
    print("Starting to load data from '{}' to table '{}' in database '{}'...".format(csv_path, table_name, db_name))
    
    first_chunk = True
    total_rows_processed = 0

    try:
        for i, chunk in enumerate(pd.read_csv(csv_path, chunksize=chunk_size, low_memory=False)):
            # For the first chunk, replace the table if it exists.
            # For subsequent chunks, append.
            if_exists_param = 'replace' if first_chunk else 'append'
            
            chunk.to_sql(table_name, conn, if_exists=if_exists_param, index=False)
            
            total_rows_processed += len(chunk)
            print("Processed chunk {} ({} rows). Total rows processed: {}".format(i+1, len(chunk), total_rows_processed))
            
            if first_chunk:
                first_chunk = False
        
        print("Data loading complete. Total {} rows loaded into '{}'.".format(total_rows_processed, table_name))

    except FileNotFoundError:
        print("Error: The file {} was not found.".format(csv_path))
    except pd.errors.EmptyDataError:
        print("Error: The file {} is empty.".format(csv_path))
    except Exception as e:
        print("An error occurred: {}".format(e))
    finally:
        conn.close()
        print("Database connection closed.")

if __name__ == '__main__':
    # Correct the CSV path to be relative to the project root where the script will be run from
    # The script is in sustainability_benchmarking/scripts/
    # The CSV is in sustainability_benchmarking/../Data for Varun.csv
    # So, from the project root, the path is '../Data for Varun.csv'
    
    # The database will be created in the current working directory when the script is run.
    # If running `python scripts/load_csv_to_sqlite.py` from `/Users/apple/Desktop/sustainability_benchmarking`,
    # then DATABASE_NAME will be created in `/Users/apple/Desktop/sustainability_benchmarking/corporate_emissions.sqlite`
    
    create_db_and_table(DATABASE_NAME, TABLE_NAME)
    load_csv_to_db(CSV_FILE_PATH, DATABASE_NAME, TABLE_NAME, CHUNK_SIZE)
