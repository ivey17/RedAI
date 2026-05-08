import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share, Heart, MessageCircle, Star, Plus, Zap, Edit3 } from 'lucide-react';
import { Post, Album } from '../types';
import { SaveToAlbumSheet } from './SaveToAlbumSheet';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onOpenAI: () => void;
  onAddToRedAI: (post: Post) => void;
}

export const PostDetail = ({ post, onBack, onOpenAI, onAddToRedAI }: PostDetailProps) => {
  const [isSaveSheetOpen, setIsSaveSheetOpen] = React.useState(false);
  const [albums, setAlbums] = React.useState<Album[]>([]);
  const [isSaved, setIsSaved] = React.useState(false);

  const loadAlbums = () => {
    import('../api').then(({ api }) => {
      api.getAlbums().then(setAlbums);
    });
  };

  React.useEffect(() => {
    loadAlbums();
  }, []);

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
      <div className="relative w-full aspect-[3/4] bg-gray-100">
        <img src={post.imageUrl} className="w-full h-full object-cover" alt="main" />
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

      {/* Bottom Action Bar - Redesigned */}
      <footer className="fixed bottom-0 left-0 w-full bg-white z-[90] border-t border-gray-100 px-4 h-16 flex items-center gap-3 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        {/* Left: Fake Input */}
        <div className="flex-1 bg-gray-100 h-10 rounded-full px-4 flex items-center gap-2 text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
           <Edit3 size={16} />
           <span className="text-xs">说点什么...</span>
        </div>
        
        {/* Right: Icons & RedAI */}
        <div className="flex items-center gap-5 px-1 shrink-0">
           <div className="flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform">
             <Heart size={20} className="text-gray-800 group-hover:text-red-500 transition-colors" />
             <span className="text-[10px] text-gray-500 font-medium">{post.likes || '39'}</span>
           </div>
           
           <div 
             onClick={() => setIsSaveSheetOpen(true)}
             className="flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform"
           >
             <Star size={20} className={`text-gray-800 ${isSaved ? 'text-yellow-500 fill-yellow-500' : 'group-hover:text-yellow-500'} transition-colors`} />
             <span className="text-[10px] text-gray-500 font-medium">{isSaved ? '10' : '9'}</span>
           </div>
           
           <div className="flex flex-col items-center gap-0.5 group cursor-pointer active:scale-90 transition-transform">
             <MessageCircle size={20} className="text-gray-800 group-hover:text-blue-500 transition-colors" />
             <span className="text-[10px] text-gray-500 font-medium">32</span>
           </div>

           {/* RedAI Entry Point - More prominent */}
           <div className="flex items-center gap-3 ml-1 pl-4 border-l border-gray-100">
              <button 
                onClick={() => onAddToRedAI(post)}
                className="text-red-600 font-black text-[10px] px-2 py-1 rounded-md hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                加入REDAI分析帖组
              </button>
              <button 
                onClick={onOpenAI}
                className="bg-red-600 text-white px-5 py-2 rounded-full text-xs font-black shadow-lg shadow-red-100 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Zap size={14} fill="currentColor" />
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
          if (id) {
            const { api } = await import('../api');
            try {
              await api.saveToAlbum(id, post.id);
              loadAlbums();
            } catch (e) {
              console.error(e);
            }
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
