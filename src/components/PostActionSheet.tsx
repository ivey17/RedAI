import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Post } from '../types';

interface PostActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onAddToRedAI: (post: Post) => void;
}

export const PostActionSheet = ({ isOpen, onClose, post, onAddToRedAI }: PostActionSheetProps) => {
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

            <div className="flex flex-col items-center gap-6">
              <div className="w-full space-y-0.5 bg-red-50/50 rounded-2xl overflow-hidden">
                {['不感兴趣', '举报'].map((action) => (
                  <button
                    key={action}
                    className="w-full py-5 text-gray-800 text-lg font-medium hover:bg-red-50 active:bg-red-100 transition-colors border-b border-white/20 last:border-none"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full py-5 bg-white/80 rounded-2xl text-gray-900 text-lg font-bold shadow-sm active:scale-[0.98] transition-all"
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
