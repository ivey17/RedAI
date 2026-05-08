import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, CheckSquare, Square, Layers, AlertCircle } from 'lucide-react';
import { Post, Album } from '../types';

interface AlbumPostSelectorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  album: Album | null;
  posts: Post[];
  onConfirm: (selectedPosts: Post[]) => void;
}

export const AlbumPostSelectorSheet = ({ isOpen, onClose, album, posts, onConfirm }: AlbumPostSelectorSheetProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);

  // Reset selection when sheet opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds([]);
      setWarning(null);
    }
  }, [isOpen]);

  const togglePost = (postId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(postId)) {
        setWarning(null);
        return prev.filter(id => id !== postId);
      } else {
        if (prev.length >= 10) {
          setWarning('最多只能选择 10 篇帖子进行深度决策');
          return prev;
        }
        setWarning(null);
        return [...prev, postId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === posts.length || selectedIds.length === 10) {
      // Deselect all
      setSelectedIds([]);
      setWarning(null);
    } else {
      // Select up to 10
      const next: string[] = [];
      for (let i = 0; i < Math.min(10, posts.length); i++) {
        next.push(posts[i].id);
      }
      setSelectedIds(next);
      if (posts.length > 10) {
        setWarning('已为您自动选中前 10 篇帖子');
      } else {
        setWarning(null);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedIds.length === 0) {
      setWarning('请至少选择 1 篇帖子');
      return;
    }
    const selectedPosts = posts.filter(p => selectedIds.includes(p.id));
    onConfirm(selectedPosts);
  };

  const isAllSelected = posts.length > 0 && (selectedIds.length === posts.length || selectedIds.length === 10);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full bg-[#fef2f2] rounded-t-[32px] z-[101] shadow-2xl flex flex-col max-h-[85vh] h-[80vh]"
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-red-100 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="px-6 py-4 border-b border-red-100/50 flex justify-between items-center bg-white/50 rounded-t-3xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl flex items-center justify-center text-red-600 shadow-sm">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">选择要分析的帖子</h3>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-gray-400 font-medium">{album?.title}</p>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <p className="text-xs text-red-500 font-bold">已选 {selectedIds.length} / 10</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSelectAll}
                  className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  {isAllSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  {isAllSelected ? '全不选' : '全选'}
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 bg-white text-gray-400 rounded-full shadow-sm hover:text-gray-600 transition-colors active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Warning Banner */}
            <AnimatePresence>
              {warning && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-orange-50 px-6 py-2 flex items-center gap-2 text-orange-600 text-xs font-medium border-b border-orange-100"
                >
                  <AlertCircle size={14} />
                  {warning}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto p-4 no-scrollbar bg-white/30">
              {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                  <Layers size={48} className="opacity-20" />
                  <p className="text-sm">专辑内暂无帖子</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {posts.map((post) => {
                    const isSelected = selectedIds.includes(post.id);
                    return (
                      <motion.div 
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => togglePost(post.id)}
                        className={`flex flex-col gap-2 relative group cursor-pointer rounded-2xl p-2 transition-all ${
                          isSelected ? 'bg-red-50 shadow-md ring-2 ring-red-400' : 'bg-white shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 relative">
                          <img 
                            src={post.imageUrl} 
                            className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`} 
                            alt="thumbnail" 
                          />
                          <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-red-500/10' : 'bg-black/0 group-hover:bg-black/5'}`} />
                          
                          {/* Checkbox */}
                          <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all ${
                            isSelected ? 'bg-red-500 text-white scale-110' : 'bg-white/80 backdrop-blur-sm text-gray-300 scale-100'
                          }`}>
                            <Check size={14} strokeWidth={isSelected ? 3 : 2} />
                          </div>
                        </div>
                        
                        <h4 className={`text-xs font-bold line-clamp-2 px-1 ${isSelected ? 'text-red-900' : 'text-gray-800'}`}>
                          {post.title}
                        </h4>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 pt-4 border-t border-red-100/50 bg-white/80 backdrop-blur-md pb-safe">
              <button 
                onClick={handleConfirm}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-lg"
              >
                <Check size={22} />
                <span>一键分析 ({selectedIds.length})</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
