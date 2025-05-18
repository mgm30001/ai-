// API服务
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// 小说生成API
export const generateNovel = async (novelData) => {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novelData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '生成小说失败');
    }

    // 使用流式响应处理
    return response;
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
};

// 保存小说API
export const saveNovel = async (novelData) => {
  // 在此实现保存小说的逻辑
  // 暂时使用localStorage模拟
  try {
    const novels = JSON.parse(localStorage.getItem('novels') || '[]');
    const newNovel = {
      id: Date.now().toString(),
      ...novelData,
      createdAt: new Date().toISOString(),
    };
    novels.push(newNovel);
    localStorage.setItem('novels', JSON.stringify(novels));
    return newNovel;
  } catch (error) {
    console.error('保存小说错误:', error);
    throw error;
  }
};

// 获取小说列表API
export const getNovels = async () => {
  // 在此实现获取小说列表的逻辑
  // 暂时使用localStorage模拟
  try {
    const novels = JSON.parse(localStorage.getItem('novels') || '[]');
    return novels;
  } catch (error) {
    console.error('获取小说列表错误:', error);
    throw error;
  }
};