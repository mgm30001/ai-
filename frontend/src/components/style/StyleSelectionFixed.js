import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, BookOpen, ChevronDown, ChevronUp, X, Plus, Upload } from 'lucide-react';

const StyleSelection = ({ onNextStep, onStyleSelect, selectedStyle }) => {
  const [customStyleOpen, setCustomStyleOpen] = useState(false);
  const [localSelectedStyle, setLocalSelectedStyle] = useState(selectedStyle);
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

  const toggleCustomStyle = () => {
    setCustomStyleOpen(!customStyleOpen);
  };

  const handleStyleSelect = (style) => {
    setLocalSelectedStyle(style);
    // 确保将选择的风格传递给父组件
    if (onStyleSelect) {
      onStyleSelect(style);
    }
    console.log('选择风格:', style.name);
  };

  return (
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
            className={`bg-white rounded-xl shadow-md overflow-hidden border-2 cursor-pointer ${localSelectedStyle?.id === style.id ? 'border-blue-500' : 'border-transparent'}`}
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
              <PenTool size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">自定义风格</h3>
              <p className="text-sm text-gray-500">创建您独特的写作风格</p>
            </div>
          </div>
          {customStyleOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {customStyleOpen && (
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
            <div className="mb-6">
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
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onNextStep}
          disabled={!localSelectedStyle}
          className={`px-8 py-3 rounded-lg text-white font-medium ${
            localSelectedStyle 
              ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          开始创作
        </button>
      </div>
    </motion.section>
  );
};

export default StyleSelection;