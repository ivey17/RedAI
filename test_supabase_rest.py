import os
import requests
from dotenv import load_dotenv

load_dotenv("backend/.env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# Try to get 1 item from posts table
response = requests.get(f"{url}/rest/v1/posts?select=*&limit=1", headers=headers)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
