import requests
import json

try:
    resp = requests.get("http://localhost:8000/api/posts")
    print(f"Status Code: {resp.status_code}")
    data = resp.json()
    print(f"Posts count: {len(data.get('posts', []))}")
    if data.get('posts'):
        print("First post title:", data['posts'][0].get('title'))
except Exception as e:
    print(f"Error: {e}")
