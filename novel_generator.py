#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
This program generates a short novel in the style of a famous author
based on user input for the author and a theme.
"""

import os

# It's generally not recommended to import openai directly in the global scope
# if the API key is hardcoded. However, for this specific request context where
# the user provided the snippet, we will follow their structure.
# For a real application, consider environment variables or a config file for the API key.

# --- User Provided OpenAI Setup ---
# from openai import OpenAI # This will be imported dynamically after checking installation
# client = OpenAI(
#     api_key="097c49ac994437f0b9c29c539d2ab1e7695fbdc4",
#     base_url="https://api-w1uda5y12f7e9a12.aistudio-app.com/v1"
# )
# --- End User Provided OpenAI Setup ---

SUPPORTED_AUTHORS = {
    1: "高尔基 (Maxim Gorky)",
    2: "鲁迅 (Lu Xun)",
    3: "贾平凹 (Jia Pingwa)",
    4: "金庸 (Jin Yong)",
    5: "钱钟书 (Qian Zhongshu)",
}

# Global variable for the OpenAI client, initialized in main()
client = None

def install_and_import_openai():
    """Checks if openai is installed, installs it if not, and then imports it."""
    global client
    try:
        from openai import OpenAI
        print("OpenAI library is already installed.")
    except ImportError:
        print("OpenAI library not found. Attempting to install...")
        try:
            import subprocess
            subprocess.check_call(["python3.11", "-m", "pip", "install", "openai"])
            print("OpenAI library installed successfully.")
            from openai import OpenAI # Try importing again
        except Exception as e:
            print(f"Error installing OpenAI library: {e}")
            print("Please ensure you have pip installed and can connect to PyPI.")
            print("You can try installing it manually: pip install openai")
            return False

    # Initialize client using user-provided details
    # It's crucial to handle API keys securely. Hardcoding is not recommended for production.
    # For this exercise, we use the key provided by the user.
    # In a real scenario, use environment variables or a secure config management system.
    api_key_from_user = "097c49ac994437f0b9c29c539d2ab1e7695fbdc4"
    base_url_from_user = "https://api-w1uda5y12f7e9a12.aistudio-app.com/v1"

    if not api_key_from_user or not base_url_from_user:
        print("Error: API key or base URL is missing. Cannot initialize OpenAI client.")
        print("Please ensure these are correctly set if you are modifying the script.")
        return False

    try:
        client = OpenAI(
            api_key=api_key_from_user,
            base_url=base_url_from_user
        )
        print("OpenAI client initialized successfully.")
        return True
    except Exception as e:
        print(f"Error initializing OpenAI client: {e}")
        return False


def choose_author():
    """Prompts the user to choose an author from the supported list."""
    print("\n请选择一位作家的风格来生成小说：")
    for key, name in SUPPORTED_AUTHORS.items():
        print(f"{key}. {name}")
    
    while True:
        try:
            choice = int(input("请输入选项数字："))
            if choice in SUPPORTED_AUTHORS:
                return SUPPORTED_AUTHORS[choice]
            else:
                print("无效的选项，请输入列表中的数字。")
        except ValueError:
            print("请输入一个有效的数字。")

def get_story_theme():
    """Prompts the user to enter a theme for the story."""
    print("\n请输入您希望生成的小说的主题或梗概：")
    theme = input("> ")
    while not theme.strip():
        print("主题不能为空，请重新输入：")
        theme = input("> ")
    return theme

def generate_novel_segment(author_style, theme):
    """Generates a novel segment using the OpenAI API."""
    global client
    if not client:
        print("OpenAI client is not initialized. Cannot generate novel.")
        return

    prompt_text = (
        f"请你扮演一位经验丰富的小说家，模仿作家 {author_style} 的独特写作风格和文笔，"
        f"围绕以下主题创作一段精彩的小说片段：\n\n主题：{theme}\n\n"
        f"要求：\n"
        f"1. 风格务必神似 {author_style}，包括其常用的叙事方式、语言特点、人物塑造技巧以及作品中常见的情感基调和思想内涵。"
        f"2. 故事情节需要有一定的吸引力，能够引发读者兴趣。"
        f"3. 字数请控制在1000字以上，确保内容充实。"
        f"4. 请直接开始创作小说内容，不要包含任何解释性文字或与小说无关的对话。"
    )

    print(f"\n正在以 {author_style} 的风格，围绕主题 “{theme}” 生成小说，请稍候...")
    print("这可能需要几分钟的时间，具体取决于模型的响应速度和生成内容的长度。")

    try:
        completion = client.chat.completions.create(
            model="gemma3:27b", # As specified by the user
            temperature=0.7, # Slightly higher for more creative output
            messages=[
                {"role": "user", "content": prompt_text}
            ],
            stream=True
        )

        print("\n--- 生成的小说片段 ---未来之境：")
        full_response = ""
        for chunk in completion:
            if hasattr(chunk.choices[0].delta, "content") and chunk.choices[0].delta.content:
                content_piece = chunk.choices[0].delta.content
                print(content_piece, end="", flush=True)
                full_response += content_piece
        print("\n--- 小说片段结束 ---")
        
        word_count = len(full_response.split())
        char_count = len(full_response)
        print(f"\n生成内容统计：约 {word_count} 个词，{char_count} 个字符。")
        if char_count < 800: # A rough proxy for 1000 CJK characters, as word count can be misleading for CJK.
             print("注意：生成的内容可能未达到期望的1000字以上，您可以尝试调整主题或重新运行。")

    except Exception as e:
        print(f"\n调用AI模型生成小说时发生错误：{e}")
        print("请检查您的网络连接以及API密钥和URL是否正确配置。")

def main():
    """Main function to run the novel generator program."""
    print("欢迎使用名家风格小说生成器！")
    
    if not install_and_import_openai():
        print("无法初始化OpenAI环境，程序将退出。")
        return

    author = choose_author()
    theme = get_story_theme()
    generate_novel_segment(author, theme)
    print("\n感谢使用！")

if __name__ == "__main__":
    main()


