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
}

def check_phuket_posts():
    url = f"{supabase_url}/rest/v1/posts?select=post_id,title,image_urls,tags"
    resp = requests.get(url, headers=headers)
    if resp.status_code == 200:
        posts = resp.json()
        phuket_posts = [p for p in posts if "普吉岛" in (p.get("tags") or [])]
        for p in phuket_posts:
            print(f"ID: {p['post_id']}, Title: {p['title']}, Images: {p['image_urls']}")
    else:
        print(f"Error: {resp.status_code}, {resp.text}")

if __name__ == "__main__":
    check_phuket_posts()
