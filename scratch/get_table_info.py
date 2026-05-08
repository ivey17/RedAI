import requests
import os
import sys

# Add backend to path to import db
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
from db import supabase_client

def get_table_info(table):
    # Trying to get column names from a failing insert
    url = f"{supabase_client.url}/rest/v1/{table}"
    data = {"___invalid_column___": "val"}
    resp = requests.post(url, headers=supabase_client.headers, json=data)
    print(f"Error message for {table}: {resp.text}")

if __name__ == "__main__":
    get_table_info("albums")
