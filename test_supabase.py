import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv("backend/.env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

try:
    supabase = create_client(url, key)
    # Check if we can fetch from 'posts' table
    res = supabase.table('posts').select('*').limit(1).execute()
    print("Supabase connection successful.")
    print("Table 'posts' exists and query returned:", res.data)
except Exception as e:
    print("Supabase error:", e)
