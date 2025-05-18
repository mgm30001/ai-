from openai import OpenAI
import json

# 初始化OpenAI客户端
client = OpenAI(
    api_key="097c49ac994437f0b9c29c539d2ab1e7695fbdc4",
    base_url="https://api-w1uda5y12f7e9a12.aistudio-app.com/v1"
)

# 构建提示词 - 这里使用固定提示词作为示例
prompt = "请以武侠风格创作一篇小说，讲述一位年轻剑客的成长故事，字数约1000字。"

# 调用AI生成小说
completion = client.chat.completions.create(
    model="gemma3:27b",
    temperature=0.7,
    messages=[
        {"role": "system", "content": "你是一位专业的小说家"},
        {"role": "user", "content": prompt}
    ],
    stream=True
)

# 收集响应内容
novel_content = ""
for chunk in completion:
    if hasattr(chunk.choices[0].delta, "content") and chunk.choices[0].delta.content:
        novel_content += chunk.choices[0].delta.content

# 保存生成的小说
output_file_name = "武侠风格小说.txt"
with open(output_file_name, 'w', encoding='utf-8') as f:
    f.write(novel_content)

print(f"小说已生成并保存为 {output_file_name}")