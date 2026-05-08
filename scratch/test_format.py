import os
import sys
import requests

sys.path.append(os.path.join(os.getcwd(), 'backend'))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
from db import get_all_posts

all_posts = get_all_posts()
phuket = [p for p in all_posts if '普吉岛' in p.get('tags', []) and '演示' in p.get('tags', [])]
for p in phuket:
    print(p)
