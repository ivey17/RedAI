import os
import requests
from dotenv import load_dotenv

# Load from backend/.env
load_dotenv("backend/.env")

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
}

def fix_album_thumbnails():
    # Fix demo-phuket
    url = f"{supabase_url}/rest/v1/albums?id=eq.demo-phuket"
    img = "https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?w=800&q=80"
    resp = requests.patch(url, headers=headers, json={"imageUrl": img})
    print(f"Fixed phuket thumbnail: {resp.status_code}")

if __name__ == "__main__":
    fix_album_thumbnails()
