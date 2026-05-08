import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle, ChevronDown, Plus, ArrowUp, Zap, BookOpen } from 'lucide-react';
import { Post } from '../types';

interface RedAIOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onOpenDeepDecision?: () => void;
  onAddToRedAI: (post: Post) => void;
}

export const RedAIOverlay = ({ isOpen, onClose, post, onOpenDeepDecision }: RedAIOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full bg-[#fafafa] rounded-t-3xl z-[70] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 border border-white/20">
                  <BookOpen className="text-white" size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">RedAI 决策助手</h2>
                  <p className="text-[11px] text-red-500 flex items-center gap-1.5 font-bold mt-0.5">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    实时多维决策分析中
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 bg-gray-100 text-gray-400 rounded-full hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Preview */}
            <div className="p-6 overflow-y-auto flex-1 no-scrollbar space-y-6">
              {/* Promotion Banner from Image 4 Context */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={onOpenDeepDecision}
                className="bg-gradient-to-r from-red-600 to-rose-500 p-5 rounded-2xl shadow-xl relative overflow-hidden group cursor-pointer"
              >
                <div className="relative z-10">
                  <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                    开启 RedAI 深度决策 <Sparkles size={16} />
                  </h3>
                  <p className="text-white/80 text-xs">分析该帖及相关内容，为您生成专业方案</p>
                </div>
                <div className="absolute right-[-10px] top-[-10px] bg-white/10 w-24 h-24 rounded-full blur-2xl" />
                <div className="absolute right-4 bottom-4 bg-white/20 p-2 rounded-full backdrop-blur-md">
                   <ArrowUp className="text-white rotate-45" size={20} />
                </div>
              </motion.div>
              {post && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-6 font-sans">
                  <div className="flex gap-3 items-center mb-3">
                    <img src={post.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="thumb" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold truncate text-gray-800">{post.title}</p>
                      <p className="text-[10px] text-gray-500">已分析 3,420 字正文及评论</p>
                    </div>
                    <CheckCircle className="text-red-500 fill-current bg-white rounded-full" size={20} />
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-red-50 text-red-600 text-[10px] px-2 py-1 rounded font-bold">价格透明度 98%</span>
                    <span className="bg-red-50 text-red-600 text-[10px] px-2 py-1 rounded font-bold">路线避坑指南</span>
                  </div>
                </div>
              )}

              {/* Matrix (Mocked from image) */}
              <div className="space-y-3 mb-6">
                 {['你想做什么决策？', '你关注哪些条件？', '输出你需要什么格式？'].map((q, i) => (
                   <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                     <span className="text-sm text-gray-600">{q}</span>
                     <ChevronDown size={18} className="text-gray-400" />
                   </div>
                 ))}
              </div>

              {/* Analysis Table Idea */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-[11px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-2 font-bold text-gray-400">维度</th>
                      <th className="p-2 font-bold text-gray-400">内容 A</th>
                      <th className="p-2 font-bold text-gray-400">内容 B</th>
                      <th className="p-2 font-bold text-gray-400 text-red-500">内容 C</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="p-2 font-bold">点击率</td>
                      <td className="p-2">4.2%</td>
                      <td className="p-2">3.8%</td>
                      <td className="p-2 font-bold text-red-500">5.1%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pb-8">
                <button className="w-full bg-red-600 py-3 rounded-full text-white font-bold shadow-lg shadow-red-100 active:scale-[0.98] transition-transform">
                  开始提问
                </button>
                <button 
                  onClick={() => post && onAddToRedAI(post)}
                  className="w-full bg-red-50 py-3 rounded-full text-red-600 font-bold border border-red-100 active:scale-[0.98] transition-transform"
                >
                  加入REDAI分析帖组
                </button>
                <p className="text-[10px] text-gray-400 text-center">RedAI 可根据多篇笔记为您汇总决策建议</p>
              </div>
            </div>

            {/* Input Bar for when it's like a chat */}
            <div className="p-3 border-t border-gray-50 safe-area-pb">
               <div className="flex items-center gap-2">
                 <div className="p-2 bg-gray-50 rounded-full">
                    <Plus size={20} className="text-gray-400" />
                 </div>
                 <div className="flex-1 bg-gray-50 rounded-full h-10 flex items-center px-4 border border-gray-100">
                    <input type="text" placeholder="输入你的问题..." className="w-full bg-transparent border-none text-sm focus:ring-0" />
                    <div className="bg-red-500 p-1 rounded-full">
                      <ArrowUp size={16} className="text-white" />
                    </div>
                 </div>
                 <div className="p-2 bg-cyan-600 rounded-full">
                    <Sparkles size={18} className="text-white" />
                 </div>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
