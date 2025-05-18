import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { List, Edit3, Share2, Plus, Search, Settings } from 'lucide-react';

const NovelLibrary = () => {
  const [libraryItems, setLibraryItems] = useState([]);

  useEffect(() => {
    // 模拟加载小说库数据
    setLibraryItems([
      { id: 1, title: '玄幻世界', style: '唐家三少', date: '2023-05-15' },
      { id: 2, title: '江湖传奇', style: '烽火戏诸侯', date: '2023-06-20' },
      { id: 3, title: '时空之恋', style: '月关', date: '2023-07-10' }
    ]);
  }, []);

  return (
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
  );
};

export default NovelLibrary;
