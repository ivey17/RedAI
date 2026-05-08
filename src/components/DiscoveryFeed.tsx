import React, { useState } from 'react';
import { FeedCard } from './FeedCard';
import { Post } from '../types';
import { MOCK_POSTS } from '../constants';
import { PostActionSheet } from './PostActionSheet';
import { api } from '../api';

interface DiscoveryFeedProps {
  posts: Post[];
  loading: boolean;
  onPostClick: (post: Post) => void;
  onAddToRedAI: (post: Post) => void;
}

export const DiscoveryFeed = ({ posts, loading, onPostClick, onAddToRedAI }: DiscoveryFeedProps) => {
  const [actionSheetPost, setActionSheetPost] = useState<Post | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <main className="p-2 pb-24">
      <div className="columns-2 gap-2">
        {posts.map((post) => (
          <div key={post.id} className="break-inside-avoid mb-2">
            <FeedCard 
              post={post} 
              onClick={onPostClick} 
              onLongPress={(p) => setActionSheetPost(p)}
            />
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
          <p className="text-sm">暂无推荐帖子，请稍后再试</p>
        </div>
      )}

      <PostActionSheet 
        isOpen={!!actionSheetPost}
        onClose={() => setActionSheetPost(null)}
        post={actionSheetPost}
        onAddToRedAI={onAddToRedAI}
      />
    </main>
  );
};
