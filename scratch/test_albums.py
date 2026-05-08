import requests
import json

BASE_URL = "http://localhost:8000/api"
USER_ID = "test-user-1"

def check_albums():
    print("--- Checking Albums ---")
    resp = requests.get(f"{BASE_URL}/albums?user_id={USER_ID}")
    print(f"Status: {resp.status_code}")
    data = resp.json()
    albums = data.get("albums", [])
    print(f"Found {len(albums)} albums")
    for a in albums:
        print(f"Album: {a.get('title')} | Count: {a.get('count')} | Image: {a.get('imageUrl') or 'None'}")

def create_and_add():
    print("\n--- Creating Album ---")
    resp = requests.post(f"{BASE_URL}/albums", json={
        "user_id": USER_ID,
        "title": "测试专辑_" + str(json.dumps(True)),
        "description": "测试描述"
    })
    if resp.status_code in [200, 201]:
        album = resp.json().get("album", {})
        album_id = album.get("id") or album.get("album_id")
        print(f"Created Album ID: {album_id}")
        
        # Add a post to it
        print("--- Adding Post to Album ---")
        # Get first post id
        posts_resp = requests.get(f"{BASE_URL}/posts")
        posts = posts_resp.json().get("posts", [])
        if posts:
            post_id = posts[0].get("post_id")
            add_resp = requests.post(f"{BASE_URL}/albums/add-post", json={
                "album_id": album_id,
                "post_id": post_id
            })
            print(f"Add Post Status: {add_resp.status_code}")
            
            # Check again
            check_albums()
        else:
            print("No posts found to add")

if __name__ == "__main__":
    check_albums()
    # create_and_add() # Uncomment to test creation
