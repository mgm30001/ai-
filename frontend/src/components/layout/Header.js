import React from 'react';
import { BookOpen, PenTool, Edit3, MessageSquare, List, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ activeTab, setActiveTab, isMenuOpen, setIsMenuOpen }) => {
  return (
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

      {/* Mobile menu */}
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
    </nav>
  );
};

export default Header;
