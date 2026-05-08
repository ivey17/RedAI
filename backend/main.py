from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from schemas import (
    WorkingSetAddRequest, WorkingSetUpdateRequest, 
    WorkingSetRemoveRequest, WorkingSetClearRequest, 
    AIChatRequest, Post, PreferenceExtractRequest
)
from db import redis_client, save_temp_post, get_posts_by_ids
from prompt_builder import build_decision_prompt
from ai_engine import generate_decision
import uuid

app = FastAPI(title="RedAI API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "RedAI Backend is running!"}

@app.get("/api/debug-db")
def debug_db():
    from db import supabase_client, MOCK_POSTS_STORE, get_all_posts
    import os
    return {
        "supabase_url": os.environ.get("SUPABASE_URL"),
        "has_key": bool(os.environ.get("SUPABASE_KEY")),
        "client_exists": supabase_client is not None,
        "mock_size": len(MOCK_POSTS_STORE),
        "posts_count": len(get_all_posts())
    }

# --- Feed & Album APIs ---
@app.get("/api/posts")
def get_feed_posts():
    from db import get_all_posts
    posts = get_all_posts()
    
    # If no posts in DB, return some default ones or handle empty
    if not posts:
        return {"posts": []}
        
    return {"posts": posts}

@app.get("/api/albums")
def get_albums(user_id: str):
    from db import get_user_albums, supabase_client
    albums = get_user_albums(user_id)
    
    if albums:
        # 为每个专辑填充帖子数量
        for album in albums:
            album_id = album.get("id") or album.get("album_id")
            if supabase_client:
                # 获取关联贴数量
                album_posts = supabase_client.select("album_posts", f"album_id=eq.{album_id}")
                album["count"] = len(album_posts)
            else:
                album["count"] = 0
            
            # 确保 imageUrl 字段存在
            if "imageUrl" not in album:
                album["imageUrl"] = album.get("image_url", "")
    
    if not albums:
        # fallback
        return {
            "albums": [
                {
                    "id": "a1",
                    "album_id": "a1",
                    "title": "默认专辑",
                    "count": 0,
                    "imageUrl": ""
                }
            ]
        }
    return {"albums": albums}

from schemas import AlbumCreateRequest, AlbumAddPostRequest

@app.post("/api/albums")
def create_album(req: AlbumCreateRequest):
    from db import create_user_album
    import uuid
    # Mock behavior if supabase isn't connected
    album_id = str(uuid.uuid4())
    img_url = req.image_url or "https://images.unsplash.com/photo-1516156008625-3a9d0450a1d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    album = create_user_album(req.user_id, req.title, img_url)
    if not album:
        album = {"id": album_id, "album_id": album_id, "title": req.title, "imageUrl": img_url, "count": 0}
    return {"album": album}

@app.post("/api/albums/add-post")
def add_post_to_album_api(req: AlbumAddPostRequest):
    from db import add_post_to_album
    success = add_post_to_album(req.album_id, req.post_id)
    return {"success": True}


# --- Working Set APIs ---

def get_working_set_key(user_id: str) -> str:
    return f"working_set:{user_id}"

@app.post("/api/working-set/add")
def add_to_working_set(req: WorkingSetAddRequest):
    key = get_working_set_key(req.user_id)
    current_posts = redis_client.get_list(key)
    
    if len(current_posts) >= 10:
        raise HTTPException(status_code=400, detail="max_reached")
    
    # Save post temporarily
    post_data = {
        "post_id": req.post_id,
        "user_id": req.user_id,
        "raw_content": req.post_content,
        "title": "临时帖子", # Can be extracted later
        "image_urls": req.image_urls,
        "comments": [c.model_dump() for c in req.comments]
    }
    save_temp_post(post_data)
    
    redis_client.append_to_list(key, req.post_id)
    
    return {"success": True, "current_count": len(redis_client.get_list(key))}

@app.get("/api/working-set")
def get_working_set(user_id: str):
    key = get_working_set_key(user_id)
    post_ids = redis_client.get_list(key)
    posts = get_posts_by_ids(post_ids)
    return {"posts": posts}

@app.post("/api/working-set/update")
def update_working_set(req: WorkingSetUpdateRequest):
    if len(req.selected_post_ids) > 10:
        raise HTTPException(status_code=400, detail="最多 10 条")
    if len(req.selected_post_ids) == 0:
        raise HTTPException(status_code=400, detail="请至少选择 1 条")
        
    key = get_working_set_key(req.user_id)
    redis_client.set_list(key, req.selected_post_ids)
    return {"success": True, "go_to": "redai_chat"}

@app.post("/api/working-set/remove")
def remove_from_working_set(req: WorkingSetRemoveRequest):
    key = get_working_set_key(req.user_id)
    redis_client.remove_from_list(key, req.post_id)
    return {"success": True, "remaining": len(redis_client.get_list(key))}

@app.post("/api/working-set/clear")
def clear_working_set(req: WorkingSetClearRequest):
    key = get_working_set_key(req.user_id)
    redis_client.delete(key)
    return {"success": True}


# --- AI Chat API ---

@app.post("/api/ai/chat")
def ai_chat(req: AIChatRequest):
    if not req.post_ids or len(req.post_ids) == 0:
        raise HTTPException(status_code=400, detail="no_post_selected")
    
    if len(req.post_ids) > 10:
        raise HTTPException(status_code=400, detail="max_limit")

    # Load posts
    posts = get_posts_by_ids(req.post_ids)
    if not posts:
        raise HTTPException(status_code=404, detail="Posts not found")

    # Build Prompt
    sys_prompt, user_prompt = build_decision_prompt(posts, req.question)
    
    # Optional: Need Search logic can be plugged here
    
    # Generate Decision
    result = generate_decision(sys_prompt, user_prompt)
    
    # Session Management logic (mock for now)
    session_id = req.session_id or str(uuid.uuid4())
    
    # Log to Result Store (mock)
    
    return {
        "session_id": session_id,
        "result": result
    }

@app.post("/api/ai/extract-preferences")
def extract_preferences(req: PreferenceExtractRequest):
    if not req.text or len(req.text.strip()) < 5:
        return {
            "success": False, 
            "message": "描述太简略啦，试着多说一点你的喜好（比如喜欢的风格、品牌或具体要求）？",
            "tags": []
        }
    
    sys_prompt = """你是一个专业的标签提取助手。你的任务是从用户的个人描述中提取“偏好标签”。
    
    【输出要求】
    1. 必须以 JSON 格式输出。
    2. 如果可以提取出标签，输出格式为：{"tags": ["维度：关键词", ...], "suggestion": ""}
    3. 如果内容过于模糊、无意义或无法提取出有效的偏好，输出格式为：{"tags": [], "suggestion": "提示词：您可以试试描述喜欢的风格（如：法式复古）、消费观（如：极致性价比）或特定需求。"}
    4. 标签维度参考：预算偏好、风格偏好、美食倾向、护肤成分、兴趣圈层等。
    5. 标签必须简洁，每个标签不超过 10 个字。
    
    请直接返回 JSON，不要包含任何 Markdown 格式。"""
    
    user_prompt = f"用户描述：{req.text}"
    
    try:
        raw_result = generate_decision(sys_prompt, user_prompt)
        # 尝试清理可能的 markdown 标记
        json_str = raw_result.replace("```json", "").replace("```", "").strip()
        import json
        data = json.loads(json_str)
        
        if not data.get("tags") and not data.get("suggestion"):
            data["suggestion"] = "暂时没能提取到有效标签，请更详细地描述一下吧！"
            
        return {
            "success": len(data.get("tags", [])) > 0,
            "tags": data.get("tags", []),
            "suggestion": data.get("suggestion", "")
        }
    except Exception as e:
        print(f"Extraction error: {e}")
        return {
            "success": False,
            "message": "AI 提取失败，请尝试换种描述方式。",
            "tags": []
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
