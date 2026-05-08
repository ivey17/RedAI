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

    def _get_url(self, table):
        base_url = self.url.rstrip('/')
        if not base_url.endswith('/rest/v1'):
            base_url = f"{base_url}/rest/v1"
        return f"{base_url}/{table}"

    def select(self, table, filters=None):
        try:
            url = self._get_url(table) + "?select=*"
            if filters:
                url += f"&{filters}"
            
            resp = requests.get(url, headers=self.headers)
            if resp.status_code == 200:
                return resp.json()
            print(f"Select failed with status {resp.status_code}: {resp.text}")
            return []
        except Exception as e:
            print(f"Select error: {e}")
            return []

    def insert(self, table, data):
        try:
            url = self._get_url(table)
            resp = requests.post(url, headers=self.headers, json=data)
            return resp.status_code in [200, 201]
        except:
            return False

    def delete(self, table, filters):
        try:
            url = self._get_url(table) + f"?{filters}"
            resp = requests.delete(url, headers=self.headers)
            return resp.status_code in [200, 204]
        except:
            return False

    def patch(self, table, filters, data):
        try:
            url = self._get_url(table) + f"?{filters}"
            resp = requests.patch(url, headers=self.headers, json=data)
            return resp.status_code in [200, 204]
        except:
            return False

    def bulk_insert(self, table, data_list):
        try:
            url = self._get_url(table)
            resp = requests.post(url, headers=self.headers, json=data_list)
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

def create_user_album(user_id: str, title: str, image_url: str, description: str = ""):
    if not supabase_client: return None
    try:
        data = {"user_id": user_id, "title": title, "imageUrl": image_url, "description": description}
        
        # Robust URL building
        base_url = supabase_client.url.rstrip('/')
        if not base_url.endswith('/rest/v1'):
            base_url = f"{base_url}/rest/v1"
            
        url = f"{base_url}/albums"
        resp = requests.post(url, headers=supabase_client.headers, json=data)
        
        if resp.status_code in [200, 201]:
            result = resp.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0]
            return result
        print(f"Create Album Error {resp.status_code}: {resp.text}")
        return None
    except Exception as e:
        print(f"create_user_album error: {e}")
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

def get_album_posts(album_id: str):
    if not supabase_client: return []
    # 首先从 album_posts 获取关联关系
    relations = supabase_client.select("album_posts", f"album_id=eq.{album_id}")
    if not relations: return []
    
    post_ids = [r["post_id"] for r in relations]
    return get_posts_by_ids(post_ids)

def get_user_saved_posts(user_id: str):
    if not supabase_client: return []
    # 获取用户收藏的帖子关联
    relations = supabase_client.select("saved_posts", f"user_id=eq.{user_id}")
    if not relations: return []
    
    post_ids = [r["post_id"] for r in relations]
    return get_posts_by_ids(post_ids)

def save_user_post(user_id: str, post_id: str):
    if not supabase_client: return False
    # 检查是否已收藏
    existing = supabase_client.select("saved_posts", f"user_id=eq.{user_id}&post_id=eq.{post_id}")
    if existing: return True
    
    return supabase_client.insert("saved_posts", {"user_id": user_id, "post_id": post_id})

# --- MOCK FALLBACKS ---
MOCK_POSTS_STORE = {
    "starter-1": {
        "post_id": "starter-1",
        "title": "欢迎来到 RedAI！",
        "raw_content": "这是一个基于 AI 的深度决策小红书工具。你可以将喜欢的帖子加入分析组，让 AI 帮你做决定。目前你看到的这些是保底数据，请配置 Supabase 环境变量以同步真实数据。",
        "image_urls": ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"],
        "author": {"username": "RedAI 助手", "avatar": ""},
        "likes": "999"
    },
    "starter-2": {
        "post_id": "starter-2",
        "title": "如何使用 AI 提取偏好？",
        "raw_content": "在个人中心点击“修改偏好”，输入你的喜好描述，AI 会自动为你生成结构化标签。例如输入“我喜欢法式风格，看重性价比”，AI 会提取出风格和预算维度的标签。",
        "image_urls": ["https://images.unsplash.com/photo-1675557009875-436f599393e0?w=800&q=80"],
        "author": {"username": "RedAI 教程", "avatar": ""},
        "likes": "666"
    }
}

def save_temp_post(post_data: dict):
    if supabase_client: return supabase_client.insert("posts", post_data)
    MOCK_POSTS_STORE[post_data["post_id"]] = post_data
    return True

def get_all_posts():
    db_posts = []
    if supabase_client:
        db_posts = supabase_client.select("posts")
    
    if db_posts and isinstance(db_posts, list) and len(db_posts) > 0:
        return db_posts
    
    print("DB empty or failed, returning mock posts.")
    return list(MOCK_POSTS_STORE.values())

def get_posts_by_ids(post_ids: list):
    if not post_ids: return []
    if supabase_client:
        ids_str = ",".join([f'"{pid}"' for pid in post_ids])
        posts = supabase_client.select("posts", f"post_id=in.({ids_str})")
        if posts: return posts
    return [MOCK_POSTS_STORE[pid] for pid in post_ids if pid in MOCK_POSTS_STORE]
