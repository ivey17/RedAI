import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Trash2, Layers } from 'lucide-react';
import { Post } from '../types';

interface WorkingSetSheetProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onRemove: (postId: string) => void;
  onConfirm: () => void;
}

export const WorkingSetSheet = ({ isOpen, onClose, posts, onRemove, onConfirm }: WorkingSetSheetProps) => {
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
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-[32px] z-[101] shadow-2xl flex flex-col max-h-[70vh]"
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">REDAI 分析帖组</h3>
                  <p className="text-[10px] text-gray-400 font-medium">已选择 {posts.length} / 10 篇</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-gray-50 text-gray-400 rounded-full hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                  <Layers size={40} className="opacity-20" />
                  <p className="text-sm">帖组内还没有内容哦</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {posts.map((post) => (
                    <motion.div 
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col gap-1.5 relative group"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative">
                        <img 
                          src={post.imageUrl} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                          alt="thumbnail" 
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Delete Button - Moved inside the image corner */}
                        <button 
                          onClick={() => onRemove(post.id)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all z-10"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                      
                      <h4 className="text-[10px] font-bold text-gray-800 line-clamp-1 px-0.5">
                        {post.title}
                      </h4>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 pt-2 border-t border-gray-50 bg-gray-50/30">
              <button 
                onClick={onConfirm}
                className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} />
                <span>确认并返回</span>
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-3">
                您可以随时点击底栏“分析”按钮对当前帖组进行深度决策
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
