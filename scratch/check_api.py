import requests
import json

try:
    resp = requests.get("http://localhost:8000/api/posts")
    print(f"Status Code: {resp.status_code}")
    data = resp.json()
    posts = data.get("posts", [])
    print(f"Number of posts: {len(posts)}")
    if posts:
        print("First post title:", posts[0].get("title"))
except Exception as e:
    print(f"Error: {e}")
