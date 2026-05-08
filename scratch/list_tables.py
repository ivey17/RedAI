import requests
import os
import sys

# Add backend to path to import db
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
from db import supabase_client

def list_tables():
    # Querying PostgREST openapi spec
    url = f"{supabase_client.url}/rest/v1/"
    resp = requests.get(url, headers=supabase_client.headers)
    if resp.status_code == 200:
        spec = resp.json()
        print("Available tables in PostgREST spec:")
        for path in spec.get("paths", {}).keys():
            if path != "/":
                print(f" - {path.strip('/')}")
    else:
        print(f"Failed to get spec: {resp.status_code}")

if __name__ == "__main__":
    list_tables()
