import os
import requests
from dotenv import load_dotenv

load_dotenv()

# Supabase REST Configuration
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

class SupabaseREST:
    def __init__(self, url, key):
        self.url = url
        self.key = key
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

    def select(self, table, filters=None):
        try:
            url = f"{self.url}/rest/v1/{table}?select=*"
            if filters:
                url += f"&{filters}"
            resp = requests.get(url, headers=self.headers)
            return resp.json() if resp.status_code == 200 else []
        except Exception as e:
            print(f"Select error: {e}")
            return []

    def insert(self, table, data):
        try:
            resp = requests.post(f"{self.url}/rest/v1/{table}", headers=self.headers, json=data)
            return resp.status_code in [200, 201]
        except:
            return False

    def delete(self, table, filters):
        try:
            resp = requests.delete(f"{self.url}/rest/v1/{table}?{filters}", headers=self.headers)
            return resp.status_code in [200, 204]
        except:
            return False

    def patch(self, table, filters, data):
        try:
            resp = requests.patch(f"{self.url}/rest/v1/{table}?{filters}", headers=self.headers, json=data)
            return resp.status_code in [200, 204]
        except:
            return False

    def bulk_insert(self, table, data_list):
        try:
            resp = requests.post(f"{self.url}/rest/v1/{table}", headers=self.headers, json=data_list)
            return resp.status_code in [200, 201]
        except:
            return False

supabase_client = SupabaseREST(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Mock Redis (In-Memory)
class MockRedis:
    def __init__(self): self._data = {}
    def get_list(self, key): return self._data.get(key, [])
    def append_to_list(self, key, val):
        if key not in self._data: self._data[key] = []
        if val not in self._data[key]: self._data[key].append(val)
    def remove_from_list(self, key, val):
        if key in self._data and val in self._data[key]: self._data[key].remove(val)
    def set_list(self, key, vals): self._data[key] = vals
    def delete(self, key):
        if key in self._data: del self._data[key]

redis_client = MockRedis()

# --- REAL DB HELPERS ---
def get_user_albums(user_id: str):
    if not supabase_client: return []
    return supabase_client.select("albums", f"user_id=eq.{user_id}")

def create_user_album(user_id: str, title: str, image_url: str):
    if not supabase_client: return None
    data = {"user_id": user_id, "title": title, "imageUrl": image_url}
    # Supabase returns the inserted object
    resp = requests.post(f"{supabase_client.url}/rest/v1/albums", headers=supabase_client.headers, json=data)
    if resp.status_code in [200, 201]:
        try:
            return resp.json()[0]
        except:
            return resp.json()
    print("Create Album Error:", resp.status_code, resp.text)
    return None

def add_post_to_album(album_id: str, post_id: str):
    if not supabase_client: return False
    
    # 1. 检查专辑是否已有封面，如果没有，获取该帖子的首图作为封面
    albums = supabase_client.select("albums", f"id=eq.{album_id}")
    if albums and (not albums[0].get("imageUrl") or albums[0].get("imageUrl") == ""):
        # 获取帖子信息以提取图片
        posts = get_posts_by_ids([post_id])
        if posts and posts[0].get("image_urls"):
            cover_url = posts[0]["image_urls"][0]
            supabase_client.patch("albums", f"id=eq.{album_id}", {"imageUrl": cover_url})

    # 2. 建立关联
    data = {"album_id": album_id, "post_id": post_id}
    return supabase_client.insert("album_posts", data)

# --- MOCK FALLBACKS ---
MOCK_POSTS_STORE = {}
def save_temp_post(post_data: dict):
    if supabase_client: return supabase_client.insert("posts", post_data)
    MOCK_POSTS_STORE[post_data["post_id"]] = post_data
    return True

def get_all_posts():
    if supabase_client:
        posts = supabase_client.select("posts")
        if posts: return posts
    return list(MOCK_POSTS_STORE.values())

def get_posts_by_ids(post_ids: list):
    if not post_ids: return []
    if supabase_client:
        ids_str = ",".join([f'"{pid}"' for pid in post_ids])
        posts = supabase_client.select("posts", f"post_id=in.({ids_str})")
        if posts: return posts
    return [MOCK_POSTS_STORE[pid] for pid in post_ids if pid in MOCK_POSTS_STORE]
