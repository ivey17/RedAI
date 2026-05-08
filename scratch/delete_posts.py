import os
import sys
import requests

sys.path.append(os.path.join(os.getcwd(), 'backend'))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
from db import supabase_client, get_all_posts

def delete_posts():
    all_posts = get_all_posts()
    
    phuket_posts = [p for p in all_posts if '普吉岛' in p.get('tags', []) and '演示' in p.get('tags', [])]
    fitness_posts = [p for p in all_posts if '健身' in p.get('tags', []) and '演示' in p.get('tags', [])]
    
    print(f"Current Phuket posts: {len(phuket_posts)}")
    print(f"Current Fitness posts: {len(fitness_posts)}")
    
    # Delete 13 Phuket posts
    phuket_to_delete = phuket_posts[:13]
    for p in phuket_to_delete:
        pid = p.get('post_id') or p.get('id')
        url = f"{supabase_client.url}/rest/v1/posts?post_id=eq.{pid}"
        resp = requests.delete(url, headers=supabase_client.headers)
        if resp.status_code in [200, 204]:
            print(f"Deleted Phuket post {pid}")
        else:
            print(f"Failed to delete Phuket post {pid}")

    # Delete 3 Fitness posts
    fitness_to_delete = fitness_posts[:3]
    for p in fitness_to_delete:
        pid = p.get('post_id') or p.get('id')
        url = f"{supabase_client.url}/rest/v1/posts?post_id=eq.{pid}"
        resp = requests.delete(url, headers=supabase_client.headers)
        if resp.status_code in [200, 204]:
            print(f"Deleted Fitness post {pid}")
        else:
            print(f"Failed to delete Fitness post {pid}")

if __name__ == "__main__":
    delete_posts()
