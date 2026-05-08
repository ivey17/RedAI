import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Bell, X, PlusCircle, 
  ChevronDown, MousePointerClick, Sliders, ListFilter, 
  Bot, Sparkles, ArrowUp, Plus, BookOpen, Globe, FileText
} from 'lucide-react';
import { Post } from '../types';
import { api } from '../api';

interface RedAIDecisionEngineProps {
  onBack: () => void;
  posts: Post[];
  onRemove: (postId: string) => void;
  onPostClick: (post: Post) => void;
  onAddFromAlbum?: () => void;
}

export const RedAIDecisionEngine = ({ onBack, posts, onRemove, onPostClick, onAddFromAlbum }: RedAIDecisionEngineProps) => {
  const [chatLoading, setChatLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'post' | 'web'>('post');
  const [showAddOptions, setShowAddOptions] = useState(false);
  
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [conditions, setConditions] = useState<string[]>([]);
  const [format, setFormat] = useState<string | null>(null);

  // Sync is now handled by parent via props

  const handleChat = async () => {
    if (!question.trim() || posts.length === 0) return;
    
    const currentQ = question;
    setQuestion('');
    setChatLoading(true);
    
    // Simulate AI extraction and processing for natural language parsing
    setTimeout(async () => {
      if (step === 0) {
        let extractedGoal = currentQ.replace(/我想|我要|帮我|请|去|做个|做/g, '').trim();
        if (extractedGoal.length > 10) extractedGoal = extractedGoal.substring(0, 10) + '...';
        setGoal(extractedGoal || '未指定目标');
        setStep(1);
        setChatLoading(false);
      } else if (step === 1) {
        const extractedConditions = currentQ.split(/[,，\s、和及]/).map(s => s.replace(/要求|还要|需要/g, '').trim()).filter(Boolean).slice(0, 3);
        setConditions(extractedConditions.length > 0 ? extractedConditions : ['无特殊条件']);
        setStep(2);
        setChatLoading(false);
      } else if (step === 2) {
        let extractedFormat = currentQ.replace(/输出|给我|我要|按照|按/g, '').trim();
        if (extractedFormat.length > 10) extractedFormat = extractedFormat.substring(0, 10) + '...';
        const finalFormat = extractedFormat || '常规输出';
        setFormat(finalFormat);
        setStep(3);
        
        // Final AI Result generation after all tags extracted
        try {
          const finalPrompt = `我的目标是：${goal}。我的条件是：${conditions.join(', ')}。请给我：${finalFormat}。`;
          const res = await api.chat(posts.map(p => p.id), finalPrompt);
          setAiResult(res.result);
        } catch (err: any) {
          alert('AI 处理失败: ' + err.message);
        } finally {
          setChatLoading(false);
        }
      }
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-[#fff8f7] z-[120] flex flex-col overflow-hidden font-sans"
    >
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 flex justify-between items-center w-full px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-50 rounded-full">
            <ArrowLeft size={20} className="text-red-500" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200/50">
               <BookOpen size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-sm text-red-600">RedAI 内容决策引擎</h1>
              <p className="text-[10px] text-gray-400">已选择 {posts.length} 篇帖子</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Search size={22} className="text-gray-400" />
          <Bell size={22} className="text-gray-400" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {/* Post Selection Horizontal Scroll - Redesigned to show title and image */}
        <section className="p-4 overflow-x-auto flex gap-3 no-scrollbar bg-white/50 border-b border-gray-50">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div 
                key={post.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative flex-shrink-0 w-32 group"
              >
              <div 
                onClick={() => onPostClick(post)}
                className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
              >
                <img className="w-full h-full object-cover" src={post.imageUrl} alt={post.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-2 left-2 right-2">
                   <p className="text-[9px] text-white font-bold line-clamp-2 leading-tight">
                     {post.title}
                   </p>
                </div>
              </div>
              
              {/* Delete Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(post.id);
                }}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow-lg border-2 border-white active:scale-90 transition-transform z-10"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </motion.div>
          ))}
          </AnimatePresence>
          
          <div className="relative flex-shrink-0">
            <div 
              onClick={() => setShowAddOptions(!showAddOptions)}
              className="w-32 aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50/50 text-gray-400 gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <PlusCircle size={24} />
              <span className="text-[10px] font-bold">继续添加</span>
            </div>
            
            {/* Pop-up Options */}
            <AnimatePresence>
              {showAddOptions && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute top-1/2 left-full ml-3 -translate-y-1/2 bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 z-50 flex flex-col w-28"
                >
                  <button 
                    onClick={() => { setShowAddOptions(false); onAddFromAlbum?.(); }}
                    className="text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 px-3 py-2.5 rounded-lg text-left transition-colors whitespace-nowrap"
                  >
                    添加专辑
                  </button>
                  <div className="h-px bg-gray-50 my-0.5 mx-2" />
                  <button 
                    onClick={() => { setShowAddOptions(false); onBack(); }}
                    className="text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 px-3 py-2.5 rounded-lg text-left transition-colors whitespace-nowrap"
                  >
                    首页浏览
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Guided Selection Area */}
        <section className="px-3 space-y-2 mt-2">
          {/* Step 0: Goal */}
          <div className={`bg-white p-3 rounded-xl shadow-sm border ${step === 0 ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-50'} flex justify-between items-center transition-all`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${goal ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'} flex items-center justify-center transition-colors`}>
                <MousePointerClick size={18} />
              </div>
              <span className={`text-sm font-medium ${goal ? 'text-red-500' : 'text-gray-700'}`}>
                {goal ? '决策目标' : '你想做什么决策？'}
              </span>
            </div>
            {goal ? (
              <span className="text-xs font-bold bg-red-50 text-red-600 px-2 py-1 rounded">{goal}</span>
            ) : (
              <ChevronDown size={18} className="text-gray-300" />
            )}
          </div>

          {/* Step 1: Conditions */}
          {(step >= 1 || conditions.length > 0) && (
            <div className={`bg-white p-3 rounded-xl shadow-sm border ${step === 1 ? 'border-orange-300 ring-2 ring-orange-50' : 'border-gray-50'} flex justify-between items-center transition-all`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${conditions.length > 0 ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-500'} flex items-center justify-center transition-colors`}>
                  <Sliders size={18} />
                </div>
                <span className={`text-sm font-medium ${conditions.length > 0 ? 'text-orange-500' : 'text-gray-700'}`}>
                  {conditions.length > 0 ? '关注条件' : '你关注哪些条件？'}
                </span>
              </div>
              {conditions.length > 0 ? (
                <div className="flex gap-1">
                  {conditions.map(c => (
                    <span key={c} className="text-xs font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded">{c}</span>
                  ))}
                </div>
              ) : (
                <ChevronDown size={18} className="text-gray-300" />
              )}
            </div>
          )}

          {/* Step 2: Format */}
          {(step >= 2 || format) && (
            <div className={`bg-white p-3 rounded-xl shadow-sm border ${step === 2 ? 'border-cyan-300 ring-2 ring-cyan-50' : 'border-gray-50'} flex justify-between items-center transition-all`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${format ? 'bg-cyan-600 text-white' : 'bg-cyan-50 text-cyan-600'} flex items-center justify-center transition-colors`}>
                  <ListFilter size={18} />
                </div>
                <span className={`text-sm font-medium ${format ? 'text-cyan-600' : 'text-gray-700'}`}>
                  {format ? '输出格式' : '输出你需要什么格式？'}
                </span>
              </div>
              {format ? (
                <span className="text-xs font-bold bg-cyan-50 text-cyan-700 px-2 py-1 rounded">{format}</span>
              ) : (
                <ChevronDown size={18} className="text-gray-300" />
              )}
            </div>
          )}
        </section>

        {/* Chat / Result Area */}
        {(aiResult || chatLoading) && (
          <section className="px-3 py-6 space-y-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                <Bot size={18} />
              </div>
              <div className="flex-1 space-y-4">
                {chatLoading ? (
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-[11px] text-gray-400">正在分析多篇笔记并生成建议...</span>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                    <div className="prose prose-sm text-gray-800 text-xs whitespace-pre-wrap leading-relaxed">
                      {aiResult}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer Input Area */}
      <footer className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-3 py-3 z-50 pb-safe">
        {/* Toggle Mode */}
        <div className="flex justify-center mb-2">
          <div className="bg-gray-100 p-1 rounded-full flex gap-1 shadow-inner">
            <button 
              onClick={() => setSearchMode('post')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${searchMode === 'post' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FileText size={12} /> 仅根据帖子
            </button>
            <button 
              onClick={() => setSearchMode('web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${searchMode === 'web' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Globe size={12} /> 联网搜索
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-500 hover:opacity-80 transition-opacity active:scale-95">
            <Plus size={20} />
          </button>
          <div className="flex-1 relative">
            <input 
              className="w-full bg-gray-50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-red-100 placeholder:text-gray-300 h-11" 
              placeholder={posts.length === 0 ? "请先添加帖子到分析" : step === 0 ? "例如：我想去巴黎5日游..." : step === 1 ? "例如：要求出片，还要省钱..." : step === 2 ? "例如：按天给我行程路线安排..." : "分析已完成"} 
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChat()}
              disabled={posts.length === 0 || chatLoading || step === 3}
            />
            <div className="absolute right-2 top-1.5">
              <button 
                onClick={handleChat}
                disabled={!question.trim() || chatLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform ${question.trim() ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'}`}
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-600 text-white shadow-sm active:scale-95 transition-transform">
            <Sparkles size={18} fill="currentColor" />
          </button>
        </div>
      </footer>

    </motion.div>
  );
};
