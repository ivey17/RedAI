/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOCK_POSTS } from './constants';
import { Post, Album } from './types';
import { TopNav, BottomNav } from './components/Navigation';
import { DiscoveryFeed } from './components/DiscoveryFeed';
import { PostDetail } from './components/PostDetail';
import { Profile } from './components/Profile';
import { RedAIOverlay } from './components/RedAIOverlay';
import { AlbumDetail } from './components/AlbumDetail';
import { RedAIDecisionEngine } from './components/RedAIDecisionEngine';
import { AlbumActionSheet } from './components/AlbumActionSheet';
import { WorkingSetSheet } from './components/WorkingSetSheet';
import { LoginPage } from './components/LoginPage';
import { Sparkles, Brain, CheckCircle, Users, MessageSquare } from 'lucide-react';
import { api } from './api';

type Tab = 'home' | 'follow' | 'add' | 'message' | 'me';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumSelectionMode, setAlbumSelectionMode] = useState(false);
  const [isAIOverlayOpen, setIsAIOverlayOpen] = useState(false);
  const [isDecisionEngineOpen, setIsDecisionEngineOpen] = useState(false);
  const [isAlbumActionSheetOpen, setIsAlbumActionSheetOpen] = useState(false);
  const [isWorkingSetSheetOpen, setIsWorkingSetSheetOpen] = useState(false);
  const [actionSheetAlbum, setActionSheetAlbum] = useState<Album | null>(null);
  const [redAICount, setRedAICount] = useState(0);
  const [workingSetPosts, setWorkingSetPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Sync data on mount or login
  React.useEffect(() => {
    if (isLoggedIn) {
      // Load Posts
      api.getFeedPosts().then(data => {
        setPosts(data);
        setPostsLoading(false);
      });
      // Load Working Set
      refreshWorkingSet();
    }
  }, [isLoggedIn]);

  const refreshWorkingSet = async () => {
    try {
      const wsPosts = await api.getWorkingSet();
      setWorkingSetPosts(wsPosts);
      setRedAICount(wsPosts.length);
    } catch (err) {
      console.error('Failed to refresh working set:', err);
    }
  };

  // Handle post click
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  // Handle RedAI trigger
  const handleOpenAI = () => {
    // Jump directly to analysis page instead of half-screen overlay
    setIsDecisionEngineOpen(true);
  };

  const handleAlbumClick = (album: Album, isSelectionMode: boolean) => {
    setSelectedAlbum(album);
    setAlbumSelectionMode(isSelectionMode);
  };

  const handleAlbumLongPress = (album: Album) => {
    setActionSheetAlbum(album);
    setIsAlbumActionSheetOpen(true);
  };

  const handleAlbumRedAIDecision = (album: Album) => {
    if (album.posts.length <= 10) {
      setIsDecisionEngineOpen(true);
    } else {
      setSelectedAlbum(album);
      setAlbumSelectionMode(true);
    }
  };

  const handleAddToRedAI = async (post: Post) => {
    // Open sheet immediately for instant feedback
    setIsWorkingSetSheetOpen(true);
    
    // Optimistically add to local state to avoid delay
    setWorkingSetPosts(prev => {
      if (prev.find(p => p.id === post.id)) return prev;
      return [...prev, post];
    });
    setRedAICount(prev => prev + 1);

    try {
      await api.addToWorkingSet(post);
      // Refresh to get source of truth from backend
      await refreshWorkingSet();
    } catch (err: any) {
      if (err.message === 'max_reached') {
        setIsWorkingSetSheetOpen(false); // Close if failed
        if (confirm('10是贴组上线，是否要进行分析？')) {
          setIsDecisionEngineOpen(true);
        }
      } else {
        alert('添加失败');
        setIsWorkingSetSheetOpen(false);
        refreshWorkingSet(); // Revert local changes
      }
    }
  };

  const handleRemoveFromWorkingSet = async (postId: string) => {
    // Optimistic update
    const previousPosts = [...workingSetPosts];
    setWorkingSetPosts(prev => prev.filter(p => p.id !== postId));
    setRedAICount(prev => Math.max(0, prev - 1));

    try {
      await api.removeFromWorkingSet(postId);
      // Optional: refresh from backend to ensure sync
      // await refreshWorkingSet(); 
    } catch (err) {
      alert('移除失败');
      // Revert on failure
      setWorkingSetPosts(previousPosts);
      setRedAICount(previousPosts.length);
    }
  };

  const handleDecisionEnginePostClick = (post: Post) => {
    setIsDecisionEngineOpen(false);
    setSelectedPost(post);
  };

  return (
    <div className="min-h-screen bg-[#fff8f7] font-sans text-[#291716] overflow-x-hidden">
      {!isLoggedIn && <LoginPage onLogin={(uid) => {
        setIsLoggedIn(true);
        import('./api').then(({ setUserId }) => setUserId(uid));
      }} />}
      
      {/* Navbar show only on home/main tabs */}
      {!selectedPost && activeTab !== 'me' && <TopNav />}
      
      {/* Content Area */}
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && (
              <DiscoveryFeed 
                posts={posts}
                loading={postsLoading}
                onPostClick={handlePostClick} 
                onAddToRedAI={handleAddToRedAI} 
              />
            )}
            {activeTab === 'follow' && (
              <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <Users size={48} className="mb-4 opacity-20" />
                <p className="text-sm">关注内容暂无更新</p>
              </div>
            )}
            {activeTab === 'message' && (
              <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p className="text-sm">这里还没有消息哦</p>
              </div>
            )}
            {activeTab === 'me' && (
              <Profile 
                onOpenAI={handleOpenAI} 
                onAlbumClick={handleAlbumClick} 
                onPostClick={handlePostClick}
                onOpenDeepDecision={() => setIsDecisionEngineOpen(true)} 
                onAlbumLongPress={handleAlbumLongPress}
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Album Detail View */}
      <AnimatePresence>
        {selectedAlbum && (
          <AlbumDetail 
            album={selectedAlbum} 
            isSelectionMode={albumSelectionMode}
            onBack={() => setSelectedAlbum(null)} 
            onPostClick={(post) => {
              setSelectedPost(post);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Post Detail View */}
      <AnimatePresence>
        {selectedPost && (
          <PostDetail 
            post={selectedPost} 
            onBack={() => setSelectedPost(null)} 
            onOpenAI={handleOpenAI}
            onAddToRedAI={handleAddToRedAI}
          />
        )}
      </AnimatePresence>

      {/* Navigation - show only when not in detail view */}
      {!selectedPost && (
        <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as Tab)} />
      )}

      {/* Overlays */}
      <RedAIOverlay 
        isOpen={isAIOverlayOpen} 
        onClose={() => setIsAIOverlayOpen(false)} 
        post={selectedPost || MOCK_POSTS[0]} 
        onOpenDeepDecision={() => {
          setIsAIOverlayOpen(false);
          setIsDecisionEngineOpen(true);
        }}
        onAddToRedAI={handleAddToRedAI}
      />
      
      <WorkingSetSheet 
        isOpen={isWorkingSetSheetOpen}
        onClose={() => setIsWorkingSetSheetOpen(false)}
        posts={workingSetPosts}
        onRemove={handleRemoveFromWorkingSet}
        onConfirm={() => setIsWorkingSetSheetOpen(false)}
      />

      <AnimatePresence>
        {isDecisionEngineOpen && (
          <RedAIDecisionEngine 
            onBack={() => setIsDecisionEngineOpen(false)} 
            posts={workingSetPosts}
            onRemove={handleRemoveFromWorkingSet}
            onPostClick={handleDecisionEnginePostClick}
            onAddFromAlbum={() => {
              setIsDecisionEngineOpen(false);
              setActiveTab('我');
            }}
          />
        )}
      </AnimatePresence>

      <AlbumActionSheet 
        isOpen={isAlbumActionSheetOpen}
        onClose={() => setIsAlbumActionSheetOpen(false)}
        album={actionSheetAlbum}
        onRedAIDecision={handleAlbumRedAIDecision}
      />
    </div>
  );
}

// No additional local icon components needed as they are imported from lucide-react

