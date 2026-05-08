import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MoreHorizontal, Check } from 'lucide-react';
import { Album, Post } from '../types';

interface AlbumDetailProps {
  album: Album;
  onBack: () => void;
  onPostClick: (post: Post) => void;
  isSelectionMode?: boolean;
}

export const AlbumDetail = ({ album, onBack, onPostClick, isSelectionMode = false }: AlbumDetailProps) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#fff8f7] z-[70] flex flex-col overflow-hidden"
    >
      {/* AppBar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 flex justify-between items-center w-full px-4 h-14 shrink-0">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="font-bold text-gray-900 truncate max-w-[200px] text-center">{album.title}</h1>
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal size={24} className="text-red-600" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {isSelectionMode && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">选择要用于 AI 分析的帖子</h2>
            <p className="text-gray-400 text-xs mt-1">最多可选择 10 篇帖子</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {album.posts.map((post) => (
            <div 
              key={post.id} 
              className="relative flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform group"
              onClick={() => onPostClick(post)}
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
                {isSelectionMode && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-md">
                      <Check size={14} className="text-white font-bold" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-gray-800 line-clamp-1 px-1">{post.title}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer from mock - only show in selection mode or browse bottom if needed */}
      {isSelectionMode && (
        <footer className="bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-3 pb-safe flex items-center justify-between z-50">
          <div className="flex flex-col">
            <span className="text-gray-600 text-xs font-bold">已选 {album.posts.length}/10</span>
            <span className="text-red-500 text-[10px]">还可以选 {10 - album.posts.length} 篇</span>
          </div>
          <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-red-100 hover:opacity-90 active:scale-95 transition-all text-sm">
            用选中的帖子提问
          </button>
        </footer>
      )}
    </motion.div>
  );
};
