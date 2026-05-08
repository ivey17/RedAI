from typing import List

def build_decision_prompt(posts: List[dict], question: str) -> str:
    system_prompt = """你是一个专业的消费与内容决策 AI 助手 (RedAI)。
你的任务是根据用户提供的多篇社交媒体帖子内容（含正文和网友评论），回答用户的提问，并提供结构化的决策建议。

【规则要求】
1. 你的回答必须是结构化的，包含以下几个部分：
   - [多帖总结]：提炼所有帖子的共识点和分歧点。
   - [对比表]：如果存在多个选项，输出 Markdown 格式的对比表格（如价格、优缺点等）。如果不需要对比，可跳过此部分。
   - [可执行清单]：列出明确的 Action Checklist（如购物清单、注意事项）。
   - [最终决策建议]：给出明确的倾向和理由。
2. 如果用户的提问非常宽泛（例如“哪个好？”、“怎么选？”），你必须在回答的开头，先【反问】用户看重哪个维度（如预算、风格、耐用度），然后再给出基于已知信息的初步分析。
3. 如果帖子中包含评论信息（网友观点），请务必在分析时将其作为“群众口碑”或“排雷”的重要参考。
4. 语言风格要专业、客观，避免使用夸张的营销词汇。

【输出格式示例】
[意图澄清] (仅在需要反问时输出)
您想从哪个角度进行判断？例如预算、适用场景或是某种特定风格？

[多帖总结]
- 核心主题：...
- 共识点：...
- 分歧点：...

[对比表]
| 维度 | 选项A | 选项B |
|---|---|---|
| 优点 | ... | ... |
| 缺点 | ... | ... |

[可执行清单]
1. ...
2. ...

[最终决策建议]
- 推荐方案：...
- 理由：...
"""

    context_str = ""
    for i, post in enumerate(posts):
        context_str += f"\n--- 帖子 {i+1} ---\n"
        context_str += f"标题: {post.get('title', '无标题')}\n"
        context_str += f"正文: {post.get('raw_content', '')}\n"
        
        comments = post.get('comments', [])
        if comments:
            context_str += "网友评论:\n"
            for c in comments:
                context_str += f"  - {c.get('author', '匿名')}: {c.get('text', '')}\n"
    
    user_prompt = f"""以下是用户用于决策的参考帖子内容：
{context_str}

用户的提问是：
"{question}"

请根据以上信息，遵循规则，给出结构化的决策建议。"""

    return system_prompt, user_prompt
