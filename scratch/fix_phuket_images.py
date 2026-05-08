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
    "Prefer": "return=minimal"
}

PHUKET_IMAGES = [
    "https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?w=800&q=80",
    "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    "https://images.unsplash.com/photo-1506929196900-df3675f92388?w=800&q=80",
    "https://images.unsplash.com/photo-1528181304800-2f140819898f?w=800&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
]

def fix_phuket_images():
    # 1. Get all phuket posts
    url = f"{supabase_url}/rest/v1/posts?select=post_id,tags"
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print(f"Fetch failed: {resp.text}")
        return

    posts = resp.json()
    phuket_posts = [p for p in posts if "普吉岛" in (p.get("tags") or [])]
    
    print(f"Found {len(phuket_posts)} Phuket posts to fix.")
    
    for i, p in enumerate(phuket_posts):
        new_img = PHUKET_IMAGES[i % len(PHUKET_IMAGES)]
        update_url = f"{supabase_url}/rest/v1/posts?post_id=eq.{p['post_id']}"
        upd_resp = requests.patch(update_url, headers=headers, json={"image_urls": [new_img]})
        if upd_resp.status_code in [200, 201, 204]:
            print(f"Fixed post {p['post_id']}")
        else:
            print(f"Failed to fix {p['post_id']}: {upd_resp.text}")

if __name__ == "__main__":
    fix_phuket_images()
