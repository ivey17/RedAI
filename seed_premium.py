import json
import random
import uuid
import os
import sys
import requests
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from db import supabase_client

if not supabase_client:
    print("Error: Supabase client not initialized.")
    sys.exit(1)

# --- CONFIGURATION ---

# More reliable and high-quality image IDs from Unsplash
TRAVEL_IMAGES = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506929662033-75393902772c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80"
]

HOME_IMAGES = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1505691722718-628a5d97d58b?auto=format&fit=crop&w=800&q=80"
]

FOOD_IMAGES = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
]

CATEGORIES = {
    "旅游": {
        "titles": ["普吉岛5天4夜人均3k，避雷指南！", "斯米兰群岛日落，这辈子值了", "上海周边2h直达的世外桃源", "第一次去日本怎么玩？看这篇就够了", "大理洱海边的神仙民宿测评"],
        "content_template": "刚从{}回来，有些话憋在心里很久了... \n\n📍 推荐路线：\n- Day 1: 抵达并前往{}\n- Day 2: 核心景点打卡，强烈推荐去这里的海滩。\n\n⚠️ 避雷指南：\n1. 这里的海鲜市场千万别去第一家，往里走便宜一半！\n2. 建议下午4点后拍照，光线非常温柔。\n\n💡 穿搭建议：建议穿浅色系，出片率更高哦～",
        "locations": ["普吉岛", "斯米兰", "莫干山", "京都", "大理"],
        "images": TRAVEL_IMAGES
    },
    "家居": {
        "titles": ["120平奶油风装修，硬装仅花8w！", "小户型扩容术，我家客厅大了一倍", "沉浸式收纳，强迫症福音", "复古法式卧室，每天都不想下床", "不到100块提升幸福感的家居好物"],
        "content_template": "很多人问我家{}多少钱，今天公开清单啦！\n\n🏠 装修心得：\n- 全屋乳胶漆色号：奶酪白\n- 放弃复杂吊顶，视觉层高瞬间提升。\n\n✨ 软装建议：\n建议选{}色系的家具，整体感更强。如果你也在装修，记得收藏这一篇！",
        "locations": ["客厅", "厨房", "卧室", "玄关"],
        "images": HOME_IMAGES
    },
    "美食": {
        "titles": ["神仙蘸料！火锅烧烤万能公式", "懒人电饭煲焖饭，一周不重样", "魔都必吃Bistro，氛围感拉满", "减脂期也要吃的肉！低卡鸡胸肉做法", "这就是上海生煎的天花板吗？"],
        "content_template": "吃{}不好吃？那是你不会调蘸料！\n\n🥣 秘制配方：\n1. 基础版：蒜泥+葱花+香菜+蚝油\n2. 进阶版：加入两勺秘制红油\n\n这绝对是适合所有{}的神仙配方，赶紧艾特你的饭搭子来看！",
        "locations": ["火锅", "烤肉", "冒菜", "串串"],
        "images": FOOD_IMAGES
    }
}

AUTHORS = [
    {"id": "11111111-1111-1111-1111-111111111111", "name": "小梨子Lifestyle", "avatar": "https://i.pravatar.cc/150?u=a1"},
    {"id": "22222222-2222-2222-2222-222222222222", "name": "居家的阿豪", "avatar": "https://i.pravatar.cc/150?u=a2"},
    {"id": "33333333-3333-3333-3333-333333333333", "name": "旅行达人阿飞", "avatar": "https://i.pravatar.cc/150?u=a3"},
    {"id": "44444444-4444-4444-4444-444444444444", "name": "装修避坑师", "avatar": "https://i.pravatar.cc/150?u=a4"},
    {"id": "55555555-5555-5555-5555-555555555555", "name": "小艾厨房", "avatar": "https://i.pravatar.cc/150?u=a5"},
    {"id": "66666666-6666-6666-6666-666666666666", "name": "数码课代表", "avatar": "https://i.pravatar.cc/150?u=a6"}
]

COMMENTS = [
    "感谢分享！刚好下周要去",
    "这个色号真的绝了，收藏了",
    "博主求链接！衣服好好看",
    "已经跟着做了，味道非常棒",
    "避坑成功，谢谢提醒",
    "想看更多的细节图，期待下一篇",
    "博主拍照是用什么器材呀？"
]

posts = []
random.seed(42) # Different seed for variety

for category, data in CATEGORIES.items():
    for i in range(15): # 15 posts per category
        title = random.choice(data["titles"])
        loc = random.choice(data["locations"])
        content = data["content_template"].format(loc, loc)
        author = random.choice(AUTHORS)
        
        post_id = str(uuid.uuid4())
        full_title = f"{title} | {loc}实测" if random.random() > 0.5 else title
        
        posts.append({
            "post_id": post_id,
            "user_id": author["id"],
            "title": full_title,
            "raw_content": content,
            "description": content,
            "image_urls": [random.choice(data["images"]) for _ in range(random.randint(1, 3))],
            "imageUrl": random.choice(data["images"]),
            "author": author,
            "likes": f"{random.randint(1, 99)}.{random.randint(1, 9)}k" if random.random() > 0.3 else str(random.randint(50, 999)),
            "comments": [
                {"author": random.choice(AUTHORS)["name"], "text": random.choice(COMMENTS), "likes": random.randint(0, 100)}
                for _ in range(random.randint(2, 5))
            ],
            "tags": [category, loc, "热门", "推荐"],
            "location": loc,
            "publishDate": "2024-05-08"
        })

print(f"Prepared {len(posts)} high-quality posts.")

# Clear existing posts
print("Clearing old posts...")
resp = requests.delete(f"{supabase_client.url}/rest/v1/posts?post_id=neq.00000000-0000-0000-0000-000000000000", headers=supabase_client.headers)

# Batch insert
CHUNK_SIZE = 15 # Smaller chunks for better reliability
for i in range(0, len(posts), CHUNK_SIZE):
    chunk = posts[i:i+CHUNK_SIZE]
    success = supabase_client.bulk_insert("posts", chunk)
    if success:
        print(f"Inserted chunk {i//CHUNK_SIZE + 1} ({len(chunk)} posts)")
    else:
        print(f"Failed to insert chunk {i//CHUNK_SIZE + 1}")

print("Seeding complete!")
