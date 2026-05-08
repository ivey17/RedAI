import json
import random
import uuid
import os
import sys
from dotenv import load_dotenv

# Add backend to path so we can import SupabaseREST
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from db import supabase_client

if not supabase_client:
    print("Error: Supabase client not initialized. Check backend/.env")
    sys.exit(1)

phuket_titles = [
    "普吉岛旅游全攻略，这篇就够了！", "普吉岛避雷指南，千万别去这些地方", "神仙半岛日落测评，真的值得去吗？",
    "普吉岛本地人常去的海鲜市场，性价比极高", "带娃游普吉岛，这几个景点必须安排", "芭东海滩夜市吃喝玩乐测评",
    "普吉岛跳岛游选哪个？斯米兰还是皮皮岛", "普吉岛必打卡咖啡店，出片率100%", "第一次去普吉岛？这份行前准备请查收",
    "普吉岛租摩托车避坑实录", "在普吉岛住了三天神仙酒店，测评来了", "卡伦海滩冲浪体验，新手小白看过来"
]

renovation_titles = [
    "奶油风客厅装修，温柔到骨子里", "原木风卧室，打造治愈系睡眠空间", "极简风全屋定制，少即是多",
    "避坑指南：我家装修踩过的那些坑", "二手房老破小翻新记录", "乳胶漆色号测评：网红色真的好看吗",
    "瓷砖怎么选才不翻车？", "微水泥卫生间真实体验，后悔了吗", "无主灯设计真的适合普通层高吗？",
    "全屋智能家居避坑，这些设备吃灰了", "穷装也能很高级，我家的平价好物清单", "复古法式装修，仿佛住在电影里",
    "厨房装修必备：好用的五金件测评", "阳台封窗怎么选？断桥铝全解析", "半包vs全包，装修到底选哪个？"
]

cooking_titles = [
    "快手早餐：10分钟搞定营养三明治", "懒人福音：电饭煲焖饭大全", "减肥期怎么吃？低卡高蛋白鸡胸肉做法",
    "神仙蘸料配方，蘸鞋底都好吃！", "复刻餐厅招牌菜：糖醋排骨的独家秘诀", "自制神仙饮品，夏天靠它续命",
    "空气炸锅美食大赏，无油更健康", "烘焙小白也能零失败的巴斯克蛋糕"
]

tech_titles = [
    "苹果15 Pro深度测评，值得换吗？", "平价降噪耳机推荐，打工人的续命神器", "机械键盘入坑指南：轴体怎么选",
    "摄影小白的第一台微单，这几款不踩雷", "智能手表真香警告：健康监测全解析"
]

sports_titles = [
    "新手跑步指南：如何避免膝盖受伤？", "帕梅拉跟练一周真实效果反馈", "瑜伽垫测评：防滑减震哪家强",
    "健身房小白怎么练？第一天干什么", "网球初学者必看：选拍与基础动作", "游泳馆奇葩图鉴，你中招了吗",
    "居家无氧运动，一块瑜伽垫就够了", "跳绳减肥法：一个月瘦了10斤！", "飞盘运动为什么这么火？"
]

shanghai_food_titles = [
    "上海必吃榜：武康路上的法式浪漫餐厅", "魔都隐蔽的小酒馆，氛围感绝了", "上海老字号生煎测评，哪家才是天花板",
    "陆家嘴高空餐厅，俯瞰外滩绝美夜景", "愚园路探店：这家Bistro值得N刷", "上海排队王火锅，到底好不好吃？"
]

authors = ["小梨子Lifestyle", "居家的阿豪", "艾米的食谱", "行走的山风", "数码狂人", "探店小队长", "健身达人老铁", "装修避坑指南"]
images = [
    "https://images.unsplash.com/photo-1540202404-b7111422ee53?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518481612222-68bab828fd1b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1466978913421-bac2e5d62e15?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80"
]

posts = []
all_titles = (phuket_titles + renovation_titles + cooking_titles + tech_titles + sports_titles + shanghai_food_titles)

random.seed(42)
for i, title in enumerate(all_titles):
    content_len = random.randint(100, 500)
    desc = "详细内容请看图哦～ " + "这是一段精心准备的攻略文本。涵盖了地点选择、避坑指南、费用明细以及实操技巧。建议大家点赞收藏，防止找不到。如果有什么问题可以在评论区留言，我会一一回复的。" * (content_len // 100 + 1)
    
    posts.append({
        "post_id": str(uuid.uuid4()),
        "user_id": str(uuid.uuid4()),
        "title": title,
        "raw_content": desc[:content_len],
        "image_urls": [random.choice(images)],
        "comments": [],
        "tags": [random.choice(["旅游", "装修", "美食", "数码", "健身"])]
    })

print(f"Generating {len(posts)} posts...")

# Clear existing posts (optional, but good for idempotent seeding)
import requests
# Using a trick to delete all: query for something always true or use a different endpoint
# But for safety, we'll just insert. Supabase REST doesn't have a simple 'delete all' without filters easily.

success = supabase_client.bulk_insert("posts", posts)
if success:
    print(f"Successfully seeded {len(posts)} posts to Supabase!")
else:
    print("Failed to seed posts.")
