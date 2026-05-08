import requests
import os
import sys

# Add backend to path to import db
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
from db import supabase_client

def inspect_table(table):
    url = f"{supabase_client.url}/rest/v1/{table}?select=*"
    resp = requests.get(url + "&limit=1", headers=supabase_client.headers)
    if resp.status_code == 200:
        print(f"Table {table} found.")
    else:
        print(f"Table {table} not found ({resp.status_code}).")

if __name__ == "__main__":
    for t in ["Album", "Collection", "UserAlbum", "user_albums", "collections"]:
        inspect_table(t)
