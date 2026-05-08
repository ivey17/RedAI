import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share, Heart, MessageCircle, Star, Plus, Zap, Edit3 } from 'lucide-react';
import { Post, Album } from '../types';
import { SaveToAlbumSheet } from './SaveToAlbumSheet';
import { api } from '../api';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onOpenAI: () => void;
  onAddToRedAI: (post: Post) => void;
}

export const PostDetail = ({ post, onBack, onOpenAI, onAddToRedAI }: PostDetailProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveSheetOpen, setIsSaveSheetOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);

  const loadAlbums = async () => {
    const data = await api.getAlbums();
    setAlbums(data);
  };

  React.useEffect(() => {
    loadAlbums();
    // Check real saved status
    const checkSaved = async () => {
      const saved = await api.isPostSaved(post.id);
      setIsSaved(saved);
    };
    checkSaved();
  }, [post.id]);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-white z-[80] overflow-y-auto no-scrollbar pb-20"
    >
      {/* Top Navigation */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-[81] border-b border-gray-100 flex justify-between items-center w-full px-4 h-14">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
          <div className="flex items-center gap-2">
            <img src={post.author?.avatar || 'https://i.pravatar.cc/150'} className="w-8 h-8 rounded-full border border-gray-100" alt="avatar" />
            <span className="font-bold text-sm text-gray-800">{post.author?.name || '未知作者'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-90 active:scale-95 transition-all">
            关注
          </button>
          <Share size={22} className="text-gray-800" />
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative w-full bg-gray-100 flex items-center justify-center min-h-[300px]">
        <img src={post.imageUrl} className="w-full h-auto max-h-[70vh] object-contain" alt="main" />
        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-medium">
          1/1
        </div>
      </div>

      {/* Content */}
      <article className="p-4 space-y-4 font-sans">
        <h1 className="text-lg font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>
        <div className="text-sm text-gray-600 leading-relaxed space-y-4">
          <p className="whitespace-pre-wrap">{post.description}</p>
          {post.location && <p>📍 地点：{post.location}</p>}
        </div>
        <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-50">
          编辑于 {post.publishDate || '今天'} · 上海
        </div>
      </article>

      {/* Bottom Action Bar - Optimized for Mobile Responsiveness */}
      <footer className="fixed bottom-0 left-0 w-full bg-white z-[90] border-t border-gray-100 px-2 h-16 flex items-center justify-between gap-1 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        {/* Left: Fake Input */}
        <div className="flex-1 min-w-[60px] bg-gray-100 h-10 rounded-full px-3 flex items-center gap-1.5 text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
          <Edit3 size={14} className="shrink-0" />
          <span className="text-[11px] truncate">说点什么...</span>
        </div>
        
        {/* Right Action Group */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Interaction Icons */}
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform">
              <Heart size={18} className="text-gray-800 group-hover:text-red-500 transition-colors" />
              <span className="text-[9px] text-gray-500 font-medium">{post.likes || '39'}</span>
            </div>
            
            <div 
              onClick={() => setIsSaveSheetOpen(true)}
              className="flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform"
            >
              <Star size={18} className={`text-gray-800 ${isSaved ? 'text-yellow-500 fill-yellow-500' : 'group-hover:text-yellow-500'} transition-colors`} />
              <span className="text-[9px] text-gray-500 font-medium">{isSaved ? '10' : '9'}</span>
            </div>
            
            <div className="flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform">
              <MessageCircle size={18} className="text-gray-800 group-hover:text-blue-500 transition-colors" />
              <span className="text-[9px] text-gray-500 font-medium">32</span>
            </div>
          </div>

          {/* RedAI Buttons */}
          <div className="flex items-center gap-1.5 ml-0.5 pl-2 border-l border-gray-100">
             <button 
               onClick={() => onAddToRedAI(post)}
               className="text-red-600 font-bold text-[9px] px-1 py-1 rounded-md hover:bg-red-50 transition-colors whitespace-nowrap"
             >
               加入分析帖组
             </button>
             <button 
               onClick={onOpenAI}
               className="bg-red-600 text-white px-3.5 py-2 rounded-full text-xs font-black shadow-lg shadow-red-100 active:scale-95 transition-all flex items-center gap-1"
             >
               <Zap size={12} fill="currentColor" />
               <span>分析</span>
             </button>
          </div>
        </div>
      </footer>

      <SaveToAlbumSheet
        isOpen={isSaveSheetOpen}
        onClose={() => setIsSaveSheetOpen(false)}
        albums={albums}
        onSelectAlbum={async (id) => {
          setIsSaved(true);
          const { api } = await import('../api');
          try {
            if (id) {
              await api.saveToAlbum(id, post.id);
            } else {
              await api.savePost(post.id);
            }
            loadAlbums();
          } catch (e) {
            console.error(e);
          }
        }}
        onCreateAlbum={async (title, desc) => {
          const { api } = await import('../api');
          try {
            console.log('Creating album:', title);
            const newAlbum = await api.createAlbum(title, desc);
            console.log('Album created:', newAlbum);
            await api.saveToAlbum(newAlbum.id, post.id);
            console.log('Post saved to album');
            setIsSaved(true);
            loadAlbums(); // Refresh list
            alert('专辑创建并保存成功');
          } catch (e) {
            console.error('Failed to create/save album:', e);
            alert('创建失败，请稍后重试');
          }
        }}
      />
    </motion.div>
  );
};
