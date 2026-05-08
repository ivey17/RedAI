import React from 'react';
import { Search, Bell, SquarePlus, Home, Users, MessageSquare, User, Plus, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export const TopNav = () => (
  <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 h-14 border-b border-gray-100">
    <div className="flex items-center gap-3 flex-1">
      <div className="flex items-center gap-1.5">
        <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-[#ff4d4d] rounded-xl flex items-center justify-center shadow-xl shadow-red-200/50 border border-white/20">
          <BookOpen size={18} className="text-white" strokeWidth={2.5} />
        </div>
      </div>
      <div className="relative flex-1 max-w-[240px]">
        <div className="bg-gray-100 rounded-full h-9 flex items-center px-3 gap-2">
          <Search size={16} className="text-gray-400" />
          <span className="text-gray-400 text-sm">搜索你想看的内容</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4 ml-4">
      <Bell size={22} className="text-gray-700" />
      <SquarePlus size={22} className="text-gray-700" />
    </div>
  </header>
);

export const BottomNav = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'follow', label: '关注', icon: Users },
    { id: 'add', label: '', icon: Plus, special: true },
    { id: 'message', label: '消息', icon: MessageSquare },
    { id: 'me', label: '我', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe px-2 bg-white/90 backdrop-blur-md border-t border-gray-100 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        if (tab.special) {
          return (
            <button
              key={tab.id}
              className="flex flex-col items-center justify-center -mt-2"
              onClick={() => onTabChange(tab.id)}
            >
              <div className="bg-red-500 p-2 rounded-xl active:scale-95 transition-transform shadow-lg shadow-red-200">
                <Icon size={24} className="text-white" />
              </div>
            </button>
          );
        }
        return (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center px-2 transition-colors ${
              activeTab === tab.id ? 'text-red-500' : 'text-gray-500'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={22} fill={activeTab === tab.id ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-bold mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
