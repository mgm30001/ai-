import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Save, Share2, Send, Loader2 } from 'lucide-react';
import { generateNovel, saveNovel } from '../../services/api';

const Interaction = ({ onPrevStep, onNextStep }) => {
  const [novelContent, setNovelContent] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentNovel, setCurrentNovel] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  useEffect(() => {
    // 从localStorage获取当前小说数据
    const storedNovel = localStorage.getItem('currentNovel');
    if (storedNovel) {
      const novelData = JSON.parse(storedNovel);
      setCurrentNovel(novelData);
      
      // 开始生成小说内容
      startNovelGeneration(novelData);
    }
  }, []);
  
  const startNovelGeneration = async (novelData) => {
    if (!novelData) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // 调用API生成小说
      const response = await generateNovel(novelData);
      
      if (!response.ok) {
        throw new Error('生成小说失败');
      }
      
      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // 解码并添加新的内容片段
        const chunk = decoder.decode(value, { stream: true });
        content += chunk;
        setNovelContent(content);
        
        // 模拟进度更新（实际应用中可能需要从服务器获取真实进度）
        setGenerationProgress(prev => Math.min(prev + 5, 95));
      }
      
      // 完成生成
      setGenerationProgress(100);
    } catch (error) {
      console.error('生成小说时出错:', error);
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        text: `生成失败: ${error.message}`, 
        isUser: false 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // 添加用户消息
    setChatMessages([...chatMessages, { 
      id: Date.now(), 
      text: inputValue, 
      isUser: true 
    }]);
    setInputValue('');

    // AI回复
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: 'AI正在根据您的反馈调整内容，请稍候...', 
        isUser: false 
      }]);
      
      // 在真实API实现中，这里应该加入将用户意见发送给后端的逻辑
      // 当前是模拟实现
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // 保存当前小说
      const savedNovel = saveNovel({
        ...currentNovel,
        content: novelContent,
        messages: chatMessages
      });
      
      console.log('小说保存成功:', savedNovel);
      
      // 显示成功消息
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        text: '小说已保存成功!', 
        isUser: false 
      }]);
    } catch (error) {
      console.error('保存小说时出错:', error);
      
      // 显示错误消息
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        text: `保存失败: ${error.message}`, 
        isUser: false 
      }]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2 text-blue-500" size={24} />
          实时交互
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            className={`p-2 rounded-full transition-all ${
              isSaving 
                ? 'bg-green-100 text-green-500' 
                : 'bg-blue-100 text-blue-500 hover:bg-blue-200'
            }`}
            onClick={handleSave}
          >
            <Save size={18} />
          </button>
          <button className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">生成内容预览</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-[400px] overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-line">
              {novelContent || "生成小说中......"}
            </p>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">AI生成进度</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="relative w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 text-right mb-6">
            {isGenerating ? (
              <span className="flex items-center justify-end">
                <Loader2 className="animate-spin mr-2" size={14} />
                正在生成...
              </span>
            ) : (
              `已完成 ${generationProgress}%`
            )}
          </p>

          <div className="flex items-center mb-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">实时交互</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {chatMessages.map(message => (
              <div 
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    message.isUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="输入您的修改意见..."
            />
            <button 
              className={`px-4 py-2 flex items-center justify-center gap-2 rounded-r-lg transition-all ${
                inputValue.trim() 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-300 cursor-not-allowed text-gray-100'
              }`}
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <Send size={16} />
              <span>发送</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          className="px-8 py-3 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50"
          onClick={onPrevStep}
        >
          返回创作
        </button>
        <button 
          className="px-8 py-3 rounded-lg text-white font-medium bg-blue-500 hover:bg-blue-600"
          onClick={onNextStep}
        >
          保存并完成
        </button>
      </div>
    </motion.section>
  );
};

export default Interaction;
