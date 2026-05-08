import requests
import uuid
import sys
import os
from dotenv import load_dotenv

# Add backend to path to import db
sys.path.append(os.path.join(os.getcwd(), 'backend'))
load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
try:
    from db import create_user_album, add_post_to_album, supabase_client
except ImportError:
    print("Could not import db helpers.")
    sys.exit(1)

USER_ID = "11111111-1111-1111-1111-111111111111"

def create_demo_post(title, content, img_url, tags=[]):
    post_id = str(uuid.uuid4())
    data = {
        "post_id": post_id,
        "user_id": USER_ID,
        "title": title,
        "raw_content": content,
        "image_urls": [img_url],
        "imageUrl": img_url,
        "likes": "1.2w",
        "author": {"name": "RedAI Demo", "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"},
        "tags": tags,
        "publishDate": "2024-05-09"
    }
    url = f"{supabase_client.url}/rest/v1/posts"
    resp = requests.post(url, headers=supabase_client.headers, json=data)
    if resp.status_code in [200, 201]:
        return post_id
    return None

def seed_demo_data():
    if not supabase_client: return

    phuket_posts = [
        ("普吉岛5天4夜攻略", "普吉岛深度游，含美食景点推荐...", "https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?w=800"),
        ("普吉岛落日餐厅推荐", "海景晚餐，浪漫落日...", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500"),
        ("泰国签证最新政策", "免签时代，说走就走...", "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500"),
        ("芭东海滩夜市必吃", "榴莲冰淇淋必打卡...", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500"),
        ("普吉岛租车自驾攻略", "中国驾照可用，轻松环岛...", "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500"),
        ("普吉镇老街打卡", "南洋风情，多巴胺建筑...", "https://images.unsplash.com/photo-1506929196900-df3675f92388?w=500"),
        ("斯米兰岛果冻海", "每年限时开放，绝美水下世界...", "https://images.unsplash.com/photo-1528181304800-2f140819898f?w=500"),
        ("查龙寺文化之旅", "宏伟寺庙，感受信仰力量...", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500"),
        ("卡伦海滩冲浪日记", "冲浪爱好者天堂...", "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500"),
        ("普吉岛泰式按摩推荐", "专业手法，全身放松...", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500"),
        ("珊瑚岛水上项目", "水上飞人、香蕉船...", "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500"),
        ("普吉免税店购物清单", "大牌护肤品好价...", "https://images.unsplash.com/photo-1512100356131-ad1bb3ba3940?w=500"),
        ("普吉岛行李打包建议", "防晒补水是关键...", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500")
    ]

    fitness_posts = [
        ("女性一周减脂餐推荐", "低卡饱腹，美味减脂...", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800"),
        ("高效居家燃脂运动", "马甲线养成计划...", "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500"),
        ("减脂期避坑指南", "这些陷阱别踩...", "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500"),
        ("女性生理期运动建议", "温和锻炼，科学调节...", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500"),
        ("拉伸的重要性：塑形必备", "漫画腿、天鹅颈拉伸法...", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500")
    ]

    # 1. Phuket Album
    print("Creating Phuket Travel Album...")
    phuket_album = create_user_album(USER_ID, "吉普岛旅游", phuket_posts[0][2], "普吉岛深度游攻略")
    album_id = phuket_album.get('id') if phuket_album else None
    for title, content, img in phuket_posts:
        pid = create_demo_post(title, content, img, ["旅游", "普吉岛", "演示"])
        if pid and album_id: add_post_to_album(album_id, pid)
    print("Added 13 Phuket posts.")

    # 2. Fitness Album
    print("\nCreating Fitness Album...")
    fitness_album = create_user_album(USER_ID, "女性减脂健身", fitness_posts[0][2], "针对女性的科学减脂计划")
    album_id_fit = fitness_album.get('id') if fitness_album else None
    for title, content, img in fitness_posts:
        pid = create_demo_post(title, content, img, ["健身", "减脂", "演示"])
        if pid and album_id_fit: add_post_to_album(album_id_fit, pid)
    print("Added 5 Fitness posts.")

if __name__ == "__main__":
    seed_demo_data()
