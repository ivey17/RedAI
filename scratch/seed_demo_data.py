import requests
import uuid
import sys
import os

# Add backend to path to import db
sys.path.append(os.path.join(os.getcwd(), 'backend'))
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
    from db import create_user_album, add_post_to_album, supabase_client
except ImportError:
    print("Could not import db helpers. Make sure you are in the project root.")
    sys.exit(1)

USER_ID = "test-user-1"

def create_demo_post(title, content, img_url):
    post_id = str(uuid.uuid4())
    data = {
        "post_id": post_id,
        "user_id": USER_ID,
        "title": title,
        "raw_content": content,
        "image_urls": [img_url],
        "likes": "1.2w",
        "author": {"name": "RedAI Demo", "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
    }
    # Direct insert into posts table
    url = f"{supabase_client.url}/rest/v1/posts"
    resp = requests.post(url, headers=supabase_client.headers, json=data)
    if resp.status_code in [200, 201]:
        return post_id
    print(f"Failed to create post: {resp.status_code} {resp.text}")
    return None

def seed_demo_data():
    if not supabase_client:
        print("Supabase client not initialized. Check ENV.")
        return

    # 1. Phuket Album
    print("Creating Phuket Travel Album...")
    phuket_album = create_user_album(
        USER_ID, 
        "吉普岛旅游", 
        "https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?w=800",
        "普吉岛5天4夜深度游攻略，包含美食、景点和住宿推荐。"
    )
    if phuket_album:
        album_id = phuket_album.get('album_id') or phuket_album.get('id')
        phuket_posts = [
            ("普吉岛落日餐厅，绝美海景晚餐", "在这里看落日真的太浪漫了，人均只要200+...", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500"),
            ("芭东海滩夜市必吃，榴莲冰淇淋绝了", "晚上的芭东海滩超级热闹，这几家店千万别错过...", "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500"),
            ("斯米兰岛开岛啦！果冻海真的美哭", "一年只开半年的岛屿，一定要去一次...", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500"),
            ("普吉岛租车攻略，自驾环岛太爽了", "中国驾照就能租，一天只要150RMB...", "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500"),
            ("普吉镇老街，色彩斑斓的南洋风情", "适合拍照的一天，满大街都是多巴胺配色...", "https://images.unsplash.com/photo-1506929196900-df3675f92388?w=500"),
            ("查龙寺朝圣，感受泰国的佛教文化", "建筑非常宏伟，进入需要注意着装...", "https://images.unsplash.com/photo-1528181304800-2f140819898f?w=500"),
            ("卡伦海滩冲浪初体验，教练很耐心", "浪不大，非常适合新手入门...", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500"),
            ("普吉岛免税店购物清单，买什么最划算", "欧莱雅真的是白菜价，一定要冲...", "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500"),
            ("珊瑚岛香蕉船，玩的就是心跳", "水上项目非常丰富，价格也透明...", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500"),
            ("普吉岛泰式按摩推荐，消除一身疲惫", "手法专业，环境优雅，按完之后整个人都轻了...", "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500"),
            ("普吉岛签证避坑指南，落地签流程", "排队人很多，记得提前准备好资料...", "https://images.unsplash.com/photo-1512100356131-ad1bb3ba3940?w=500"),
            ("泰国必备APP推荐，自由行不迷路", "打车用Grab，地图用Google...", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500"),
            ("普吉岛行李打包清单，防晒最重要", "紫外线真的很强，一定要带足防晒霜...", "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500")
        ]
        for title, content, img in phuket_posts:
            pid = create_demo_post(title, content, img)
            if pid: add_post_to_album(album_id, pid)
        print(f"Added 13 posts to Phuket album.")

    # 2. Fitness Album
    print("\nCreating Fitness Album...")
    fitness_album = create_user_album(
        USER_ID, 
        "女性减脂健身", 
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
        "针对女性的科学减脂计划，包含饮食建议和居家训练动作。"
    )
    if fitness_album:
        album_id = fitness_album.get('album_id') or fitness_album.get('id')
        fitness_posts = [
            ("女性一周减脂餐，不重样超好吃", "低卡高蛋白，即使是减脂期也要好好吃饭...", "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500"),
            ("高效居家燃脂运动，每天20分钟", "不需要器材，随时随地都能练...", "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500"),
            ("减脂期避坑指南，这些“健康餐”其实增肥", "注意隐形热量，别让努力白费...", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500"),
            ("如何度过减脂平台期？3个建议", "心态不要崩，尝试改变运动强度...", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500"),
            ("拉伸的重要性，练出天鹅颈和漫画腿", "运动后的拉伸不仅能缓解肌肉酸痛，还能塑形...", "https://images.unsplash.com/photo-1552196564-972d46387254?w=500")
        ]
        for title, content, img in fitness_posts:
            pid = create_demo_post(title, content, img)
            if pid: add_post_to_album(album_id, pid)
        print(f"Added 5 posts to Fitness album.")

if __name__ == "__main__":
    seed_demo_data()
