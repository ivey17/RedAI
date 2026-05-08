import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Album } from '../types';
import { Edit3, Trash2, Move, BookOpen, X } from 'lucide-react';

interface AlbumActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  album: Album | null;
  onRedAIDecision: (album: Album) => void;
}

export const AlbumActionSheet = ({ isOpen, onClose, album, onRedAIDecision }: AlbumActionSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full bg-[#fef2f2] rounded-t-[32px] z-[101] shadow-2xl p-6 pb-safe overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-red-100 rounded-full mx-auto mb-6" />

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  if (album) onRedAIDecision(album);
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={24} />
                  <div className="text-left">
                    <p className="font-bold text-lg">使用 RedAI 深度决策</p>
                    <p className="text-white/70 text-[10px]">分析该专辑中的内容并生成方案</p>
                  </div>
                </div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                   <Edit3 size={18} className="rotate-90" />
                </div>
              </button>

              <div className="w-full space-y-0.5 bg-white/50 rounded-2xl overflow-hidden mt-3 shadow-sm">
                {[
                  { icon: Edit3, text: '修改专辑信息', color: 'text-gray-800' },
                  { icon: Move, text: '迁移笔记', color: 'text-gray-800' },
                  { icon: Trash2, text: '删除专辑', color: 'text-red-500' },
                ].map((item, i) => (
                  <button
                    key={i}
                    className="w-full p-5 flex items-center gap-4 hover:bg-white active:bg-red-50 transition-colors border-b border-white/20 last:border-none"
                  >
                    <item.icon size={20} className={item.color} />
                    <span className={`text-lg font-medium ${item.color}`}>{item.text}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full py-5 bg-white rounded-2xl text-gray-900 text-lg font-bold shadow-sm mt-3 active:scale-[0.98] transition-all"
              >
                取消
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
