import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Mic, AlertCircle } from 'lucide-react';
import { generateNovel } from '../../services/api';

const CreationInput = ({ onPrevStep, onNextStep, selectedStyle }) => {
  const [inputMode, setInputMode] = useState('text');
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Edit3 className="mr-2 text-blue-500" size={24} />
          创作输入
        </h2>
        {selectedStyle && (
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">当前风格:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {selectedStyle.name}
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setInputMode('text')}
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${inputMode === 'text' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              文本输入
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${inputMode === 'voice' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              语音输入
            </button>
          </nav>
        </div>

        <div className="p-6">
          {inputMode === 'text' ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">小说标题</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="输入小说标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">开篇提示</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="描述您想要的开篇场景、人物或剧情走向..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button className="w-24 h-24 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-12 h-12 text-blue-500" />
              </button>
              <p className="text-gray-500">点击麦克风开始语音输入</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
          <AlertCircle className="mr-2 flex-shrink-0 h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onPrevStep}
          className="px-8 py-3 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50"
          disabled={isLoading}
        >
          返回
        </button>
        <button
          onClick={() => {
            if (!selectedStyle || !title.trim() || !prompt.trim()) {
              setError('请填写所有必要的字段！');
              return;
            }
            
            setError('');
            setIsLoading(true);
            
            // 准备小说生成请求数据
            const novelData = {
              style: selectedStyle.name,
              title: title,
              background: prompt,
              character: '主角', // 可以根据需要添加更多字段
              plot: prompt,
              other_reqs: ''
            };
            
            // 存储小说信息到localStorage供下一步使用
            localStorage.setItem('currentNovel', JSON.stringify(novelData));
            
            // 跳转到下一步
            onNextStep();
          }}
          className={`px-8 py-3 rounded-lg text-white font-medium ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={isLoading}
        >
          {isLoading ? '正在处理...' : '开始创作'}
        </button>
      </div>
    </motion.section>
  );
};

export default CreationInput;
