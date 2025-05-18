import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from openai import OpenAI
import json

app = Flask(__name__)
CORS(app)  # 允许跨域请求，方便前端调用

# --- AI 配置 ---
# 从环境变量读取API密钥和URL
API_KEY = os.environ.get("AISTUDIO_API_KEY", "097c49ac994437f0b9c29c539d2ab1e7695fbdc4")
BASE_URL = os.environ.get("AISTUDIO_BASE_URL", "https://api-w1uda5y12f7e9a12.aistudio-app.com/v1")
MODEL_NAME = os.environ.get("AISTUDIO_MODEL", "gemma3:27b") # 或者您想使用的其他模型

try:
    client = OpenAI(
        api_key=API_KEY,
        base_url=BASE_URL
    )
except Exception as e:
    print(f"初始化 OpenAI 客户端时出错: {e}")
    client = None

# --- AI 小说生成函数 ---
def generate_novel_content(prompt_details):
    """根据提供的细节生成小说内容"""
    if not client:
        raise ConnectionError("未能初始化 AI 服务客户端。")

    # 根据 prompt_details 构建更丰富的提示词
    style = prompt_details.get('style', '默认风格')
    title = prompt_details.get('title', '未命名小说')
    background = prompt_details.get('background', '在一个遥远的世界...')
    character = prompt_details.get('character', '一位年轻的冒险者...')
    plot = prompt_details.get('plot', '他/她踏上了一段奇妙的旅程...')
    other_reqs = prompt_details.get('other_reqs', '')
    continue_from = prompt_details.get('continue_from', '')
    is_continue = prompt_details.get('is_continue', False)

    # 构建更具体的提示词
    if is_continue and continue_from:
        full_prompt = f"""
请继续以下小说的创作，保持 [{style}] 风格：

已有内容：
{continue_from}

请继续创作：
"""
    else:
        full_prompt = f"""
请以 [{style}] 风格创作一篇小说，标题为《{title}》。

故事背景：
{background}

主角设定：
{character}

情节走向：
{plot}

其他要求：
{other_reqs}

请开始创作：
"""

    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0.7,
            messages=[
                {"role": "system", "content": "你是一位才华横溢的小说家，擅长模仿各种写作风格。"},
                {"role": "user", "content": full_prompt}
            ],
            stream=True # 使用流式传输以获得更好的用户体验
        )

        def generate():
            for chunk in completion:
                if hasattr(chunk.choices[0].delta, "content") and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        return Response(generate(), mimetype='text/plain') # 返回流式响应

    except Exception as e:
        print(f"调用 AI API 时出错: {e}")
        # 返回错误信息给前端，而不是简单的字符串
        error_message = json.dumps({"error": f"AI 服务调用失败: {str(e)}"})
        # 返回 500 Internal Server Error 状态码
        return Response(error_message, status=500, mimetype='application/json')


# --- API 端点 ---
@app.route('/generate', methods=['POST'])
def handle_generate():
    """处理小说生成请求"""
    if not request.is_json:
        return jsonify({"error": "请求必须是 JSON 格式"}), 400

    data = request.get_json()

    # 简单验证输入
    required_fields = ['style', 'title', 'background', 'character', 'plot']
    if not all(field in data for field in required_fields):
         # 可以稍微放宽要求，允许某些字段为空
         print(f"收到的数据不完整: {data}")
         # return jsonify({"error": "缺少必要的创作信息"}), 400

    print(f"收到生成请求: {json.dumps(data, indent=2, ensure_ascii=False)}")

    try:
        # 调用生成函数并返回流式响应
        return generate_novel_content(data)
    except ConnectionError as e:
        return jsonify({"error": str(e)}), 503 # Service Unavailable
    except Exception as e:
        print(f"生成过程中发生内部错误: {e}")
        return jsonify({"error": "生成小说时发生内部错误"}), 500

if __name__ == '__main__':
    # 在生产环境使用gunicorn运行
    # 本地开发时使用Flask内置服务器
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get("FLASK_DEBUG", "True").lower() == "true")
