import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Album } from '../types';
import { Plus, Check, Bookmark, PlusCircle, X } from 'lucide-react';

interface SaveToAlbumSheetProps {
  isOpen: boolean;
  onClose: () => void;
  albums: Album[];
  onSelectAlbum: (albumId: string | null) => void;
  onCreateAlbum: (title: string, desc?: string) => Promise<void>;
}

export const SaveToAlbumSheet = ({ isOpen, onClose, albums, onSelectAlbum, onCreateAlbum }: SaveToAlbumSheetProps) => {
  const [isCreating, setIsCreating] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newDesc, setNewDesc] = React.useState('');

  React.useEffect(() => {
    if (!isOpen) {
      setIsCreating(false);
      setNewTitle('');
      setNewDesc('');
    }
  }, [isOpen]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateSubmit = async () => {
    if (!newTitle.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onCreateAlbum(newTitle, newDesc);
      // 切换回列表视图，让用户看到新创建的专辑
      setIsCreating(false);
      setNewTitle('');
      setNewDesc('');
    } finally {
      setIsSubmitting(false);
    }
  };
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
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-[24px] z-[101] shadow-2xl flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <span className="text-gray-400 w-8" />
              <h2 className="font-bold text-gray-900 text-lg">保存至专辑</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 no-scrollbar">
              {/* Option: Just Collect */}
              <button 
              <button 
                onClick={() => { onSelectAlbum(null); onClose(); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors mb-4 group border border-dashed border-gray-200"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                  <Bookmark size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-800 text-base">仅收藏（不存入专辑）</p>
                  <p className="text-gray-400 text-xs">笔记将保存在你的主页“收藏”中</p>
                </div>
              </button>

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 px-1 uppercase tracking-wider">我的专辑</p>
                {albums.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => { onSelectAlbum(album.id); onClose(); }}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all border border-transparent hover:border-gray-100"
                  >
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                      {album.imageUrl ? (
                        <img 
                          src={album.imageUrl} 
                          alt={album.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ''; // Clear broken src
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      {!album.imageUrl && (
                        <span className="text-[10px] text-gray-400 font-bold">暂无</span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-800 text-base">{album.title}</p>
                      <p className="text-gray-400 text-xs">{album.count} 个笔记</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer: Create Album */}
            <div className="p-6 border-t border-gray-50 bg-gray-50/50">
              {isCreating ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="专辑名称（必选）"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-800 text-sm"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="专辑简介（可选）"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-800 text-sm"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsCreating(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleCreateSubmit}
                      disabled={!newTitle.trim() || isSubmitting}
                      className="flex-1 py-3 rounded-xl font-bold text-white bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isSubmitting ? '正在创建...' : '确认创建'}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsCreating(true)}
                  className="w-full bg-white border border-gray-200 h-14 rounded-full flex items-center justify-center gap-2 text-gray-900 font-bold active:scale-[0.98] transition-transform shadow-sm"
                >
                  <Plus size={20} />
                  <span>新建专辑</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
