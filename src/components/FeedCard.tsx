import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Post } from '../types';

interface FeedCardProps {
  post: Post;
  onClick: (post: Post) => void;
  onLongPress?: (post: Post) => void;
}

export const FeedCard = ({ post, onClick, onLongPress }: FeedCardProps) => {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPress = React.useRef(false);

  const startPress = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      if (onLongPress) {
        onLongPress(post);
        isLongPress.current = true;
      }
    }, 500); // 500ms for long press
  };

  const endPress = (e: React.MouseEvent | React.TouchEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick(post);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer select-none"
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden bg-gray-50">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-auto object-cover max-h-[320px]"
          loading="lazy"
        />
      </div>
      <div className="p-2">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
          {post.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-5 h-5 rounded-full object-cover shrink-0 border border-gray-50"
            />
            <span className="text-gray-500 text-[10px] truncate leading-none">
              {post.author.name}
            </span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Heart size={14} className="text-gray-400" />
            <span className="text-gray-500 text-[10px] font-medium">{post.likes}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
