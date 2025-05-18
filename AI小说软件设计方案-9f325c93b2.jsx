import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, PenTool, MessageSquare, List, X, ChevronDown, ChevronUp, Mic, Save, Share2, Edit3, Settings, Search, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AIWriterApp = () => {
  const [activeTab, setActiveTab] = useState('style');
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [customStyleOpen, setCustomStyleOpen] = useState(false);
  const [inputMode, setInputMode] = useState('text');
  const [chatMessages, setChatMessages] = useState([]);
  const [libraryItems, setLibraryItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 模拟数据
  const writerStyles = [
    {
      id: 1,
      name: '唐家三少',
      description: '通俗易懂、返璞归真',
      tags: ['玄幻', '热血'],
      example: '这是一个充满魔法与斗气的世界...'
    },
    {
      id: 2,
      name: '烽火戏诸侯',
      description: '大器晚成、语言感人',
      tags: ['武侠', '历史'],
      example: '江湖路远，刀光剑影中藏着多少儿女情长...'
    },
    {
      id: 3,
      name: '月关',
      description: '文笔成熟、人物感人、情节轻松幽默',
      tags: ['历史', '言情'],
      example: '穿越时空的爱恋，在历史长河中谱写新的篇章...'
    }
  ];

  useEffect(() => {
    // 模拟加载小说库数据
    setLibraryItems([
      { id: 1, title: '玄幻世界', style: '唐家三少', date: '2023-05-15' },
      { id: 2, title: '江湖传奇', style: '烽火戏诸侯', date: '2023-06-20' },
      { id: 3, title: '时空之恋', style: '月关', date: '2023-07-10' }
    ]);
  }, []);

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
  };

  const toggleCustomStyle = () => {
    setCustomStyleOpen(!customStyleOpen);
  };

  const handleSendMessage = () => {
    // 模拟发送消息
    setChatMessages([...chatMessages, { id: chatMessages.length + 1, text: '用户反馈内容', isUser: true }]);
    // 模拟AI回复
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: prev.length + 2, text: 'AI已根据您的反馈调整内容...', isUser: false }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="text-blue-500 mr-2" size={24} />
            <h1 className="text-xl font-bold">AI小说创作</h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => setActiveTab('style')} 
              className={`flex items-center ${activeTab === 'style' ? 'text-blue-500' : 'text-gray-600'}`}
            >
              <PenTool className="mr-1" size={18} /> 风格选择
            </button>
            <button 
              onClick={() => setActiveTab('create')} 
              className={`flex items-center ${activeTab === 'create' ? 'text-blue-500' : 'text-gray-600'}`}
            >
              <Edit3 className="mr-1" size={18} /> 创作输入
            </button>
            <button 
              onClick={() => setActiveTab('interact')} 
              className={`flex items-center ${activeTab === 'interact' ? 'text-blue-500' : 'text-gray-600'}`}
            >
              <MessageSquare className="mr-1" size={18} /> 实时交互
            </button>
            <button 
              onClick={() => setActiveTab('library')} 
              className={`flex items-center ${activeTab === 'library' ? 'text-blue-500' : 'text-gray-600'}`}
            >
              <List className="mr-1" size={18} /> 小说管理
            </button>
          </div>
          <button 
            className="md:hidden text-gray-600" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Settings size={24} />}
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 bg-white shadow-md z-40 overflow-hidden"
          >
            <div className="flex flex-col space-y-4 p-4">
              <button 
                onClick={() => { setActiveTab('style'); setIsMenuOpen(false); }} 
                className={`flex items-center ${activeTab === 'style' ? 'text-blue-500' : 'text-gray-600'}`}
              >
                <PenTool className="mr-2" size={18} /> 风格选择
              </button>
              <button 
                onClick={() => { setActiveTab('create'); setIsMenuOpen(false); }} 
                className={`flex items-center ${activeTab === 'create' ? 'text-blue-500' : 'text-gray-600'}`}
              >
                <Edit3 className="mr-2" size={18} /> 创作输入
              </button>
              <button 
                onClick={() => { setActiveTab('interact'); setIsMenuOpen(false); }} 
                className={`flex items-center ${activeTab === 'interact' ? 'text-blue-500' : 'text-gray-600'}`}
              >
                <MessageSquare className="mr-2" size={18} /> 实时交互
              </button>
              <button 
                onClick={() => { setActiveTab('library'); setIsMenuOpen(false); }} 
                className={`flex items-center ${activeTab === 'library' ? 'text-blue-500' : 'text-gray-600'}`}
              >
                <List className="mr-2" size={18} /> 小说管理
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 pt-20 pb-16">
        {/* 风格选择界面 */}
        {activeTab === 'style' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <PenTool className="mr-2 text-blue-500" size={24} />
              选择作家风格
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {writerStyles.map(style => (
                <motion.div
                  key={style.id}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${selectedStyle?.id === style.id ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => handleStyleSelect(style)}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{style.name}</h3>
                        <p className="text-sm text-gray-500">{style.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {style.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                      <p className="font-medium mb-1">示例:</p>
                      <p className="line-clamp-3">{style.example}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <button 
                className="w-full flex justify-between items-center p-6"
                onClick={toggleCustomStyle}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-4">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">自定义风格</h3>
                    <p className="text-sm text-gray-500">创建您独特的写作风格</p>
                  </div>
                </div>
                {customStyleOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <AnimatePresence>
                {customStyleOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">风格名称</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="例如：科幻悬疑"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">风格描述</label>
                        <textarea 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="详细描述您想要的写作风格"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">关键词标签</label>
                        <div className="flex items-center">
                          <input 
                            type="text" 
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="添加关键词"
                          />
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600">
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs flex items-center">
                            科幻 <X size={14} className="ml-1" />
                          </span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs flex items-center">
                            悬疑 <X size={14} className="ml-1" />
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">参考示例</label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">点击上传参考文本</p>
                              <p className="text-xs text-gray-500">TXT, DOCX, PDF</p>
                            </div>
                            <input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                        保存自定义风格
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-end">
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                onClick={() => setActiveTab('create')}
                disabled={!selectedStyle}
              >
                下一步：创作输入
              </button>
            </div>
          </motion.section>
        )}

        {/* 创作输入界面 */}
        {activeTab === 'create' && (
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
                        placeholder="例如：星辰变"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">故事背景</label>
                      <textarea 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="描述故事发生的世界观、时代背景等"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">主角设定</label>
                      <textarea 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="描述主角的性格、外貌、能力等特征"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">情节走向</label>
                      <textarea 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="描述您期望的故事发展脉络"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">其他要求</label>
                      <textarea 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        placeholder="任何其他您想添加的要求"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                      <Mic className="text-blue-500" size={36} />
                    </div>
                    <p className="text-gray-500 mb-4">点击下方按钮开始录音</p>
                    <button className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 font-medium flex items-center">
                      <Mic className="mr-2" size={20} />
                      开始录音
                    </button>
                    <div className="w-full mt-6">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0:00</span>
                        <span>1:20</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                onClick={() => setActiveTab('style')}
              >
                上一步
              </button>
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                onClick={() => setActiveTab('interact')}
              >
                生成小说
              </button>
            </div>
          </motion.section>
        )}

        {/* 实时交互界面 */}
        {activeTab === 'interact' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <MessageSquare className="mr-2 text-blue-500" size={24} />
                实时交互
              </h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
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
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700">
                    这是一个充满魔法与斗气的世界。主角林雷，一个普通的少年，在一次意外中觉醒了远古血脉...
                  </p>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-4 text-sm text-gray-500">AI生成进度</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-gray-500 text-right mb-6">已完成75%</p>

                <div className="flex items-center mb-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-4 text-sm text-gray-500">实时交互</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {chatMessages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex">
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="输入您的修改意见..."
                  />
                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                    onClick={handleSendMessage}
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                onClick={() => setActiveTab('create')}
              >
                上一步
              </button>
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                onClick={() => setActiveTab('library')}
              >
                完成并保存
              </button>
            </div>
          </motion.section>
        )}

        {/* 小说管理界面 */}
        {activeTab === 'library' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <List className="mr-2 text-blue-500" size={24} />
                我的小说库
              </h2>
              <div className="flex items-center">
                <div className="relative">
                  <input 
                    type="text" 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="搜索小说..."
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <button className="ml-2 p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
                  <Settings size={18} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {libraryItems.map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -5 }}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <div className="flex space-x-1">
                            <button className="p-1 text-gray-400 hover:text-blue-500">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-blue-500">
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="mr-2">{item.style}风格</span>
                          <span>•</span>
                          <span className="ml-2">{item.date}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                            继续创作
                          </button>
                          <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            未完成
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="px-6 py-3 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 font-medium flex items-center">
                <Plus className="mr-2" size={18} />
                新建小说
              </button>
            </div>
          </motion.section>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>created by <a href="https://space.coze.cn" className="text-blue-500 hover:underline">coze space</a></p>
          <p>页面内容均由AI生成，仅供参考</p>
        </div>
      </footer>
    </div>
  );
};

export default AIWriterApp;