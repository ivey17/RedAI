import requests
import os
import sys

sys.path.append(os.path.join(os.getcwd(), 'backend'))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
from db import supabase_client, get_all_posts

def fix_images():
    posts = get_all_posts()
    bad_url = "https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?w=800"
    good_url = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800"
    
    bad_posts = [p for p in posts if bad_url in p.get('image_urls', []) or p.get('imageUrl') == bad_url]
    print(f"Found {len(bad_posts)} posts with bad image.")
    
    for p in bad_posts:
        pid = p.get('post_id')
        data = {
            "imageUrl": good_url,
            "image_urls": [good_url]
        }
        url = f"{supabase_client.url}/rest/v1/posts?post_id=eq.{pid}"
        headers = supabase_client.headers.copy()
        headers["Prefer"] = "return=representation"
        resp = requests.patch(url, headers=headers, json=data)
        if resp.status_code in [200, 204]:
            print(f"Patched {pid}")
        else:
            print(f"Failed to patch {pid}: {resp.status_code}")

if __name__ == "__main__":
    fix_images()
