import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")

# DeepSeek has an OpenAI compatible API
client = None
if DEEPSEEK_API_KEY:
    client = OpenAI(
        api_key=DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com/v1",
    )

def generate_decision(system_prompt: str, user_prompt: str) -> str:
    if not client:
        # Fallback Mock for Demo if no key provided
        return """[多帖总结]
- 核心主题：用户在询问相关产品的推荐。
- 共识点：多数意见认为体验很好。
- 分歧点：价格方面有不同看法。

[对比表]
| 维度 | 选项A | 选项B |
|---|---|---|
| 优点 | 质量好 | 便宜 |
| 缺点 | 较贵 | 做工一般 |

[可执行清单]
1. 确认预算。
2. 前往实体店体验。

[最终决策建议]
- 推荐方案：如果您注重品质，建议选择选项A。
- 理由：综合评论来看，选项A的长期体验更好。"""

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=2048
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"DeepSeek API Error: {e}")
        return f"AI 处理出错，请稍后再试。({e})"
