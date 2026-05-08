import { Post, Album } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

let CURRENT_USER_ID = localStorage.getItem('redai_current_user') || 'test-user-1';

export const setUserId = (id: string) => {
  CURRENT_USER_ID = id;
  localStorage.setItem('redai_current_user', id);
};

// Replace CURRENT_USER_ID with CURRENT_CURRENT_USER_ID in all calls

export const api = {
  // Feed & Albums
  getFeedPosts: async (): Promise<Post[]> => {
    try {
      console.log('Fetching posts from:', `${API_BASE_URL}/posts`);
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) {
        console.error('Fetch failed with status:', response.status);
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      console.log('Posts data received:', data);
      // Map backend structure to frontend structure
      if (!data.posts) {
        console.warn('No posts array in data:', data);
        return [];
      }
      return data.posts.map((p: any) => ({
        id: p.post_id,
        title: p.title,
        imageUrl: p.image_urls?.[0] || '',
        author: p.author || { name: '未知用户', avatar: '' },
        likes: p.likes || '0',
        description: p.raw_content
      }));
    } catch (e) {
      console.error('Error fetching posts:', e);
      return [];
    }
  },

  getAlbums: async (): Promise<Album[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/albums?user_id=${CURRENT_USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch albums');
      const data = await response.json();
      return data.albums.map((a: any) => ({
        id: a.album_id || a.id,
        title: a.title,
        count: a.count || 0,
        imageUrl: a.imageUrl,
        posts: [] // We'd load posts separately in a real scenario
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  createAlbum: async (title: string, description?: string): Promise<Album> => {
    const response = await fetch(`${API_BASE_URL}/albums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: CURRENT_USER_ID,
        title,
        description,
        image_url: '' // optional
      })
    });
    if (!response.ok) throw new Error('Failed to create album');
    const data = await response.json();
    const a = data.album;
    return {
      id: a.album_id || a.id,
      title: a.title,
      count: a.count || 0,
      imageUrl: a.imageUrl,
      posts: []
    };
  },

  saveToAlbum: async (albumId: string, postId: string) => {
    const response = await fetch(`${API_BASE_URL}/albums/add-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ album_id: albumId, post_id: postId })
    });
    if (!response.ok) throw new Error('Failed to save to album');
    return response.json();
  },

  // Working Set
  addToWorkingSet: async (post: Post) => {
    try {
      const response = await fetch(`${API_BASE_URL}/working-set/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: CURRENT_USER_ID,
          post_id: post.id,
          post_content: post.description || post.title,
          image_urls: [post.imageUrl],
          comments: []
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Error adding post');
      return data;
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  },

  getWorkingSet: async (): Promise<Post[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/working-set?user_id=${CURRENT_USER_ID}`);
      if (!response.ok) throw new Error('Failed to get working set');
      const data = await response.json();
      return data.posts.map((p: any) => ({
        id: p.post_id,
        title: p.title,
        imageUrl: p.image_urls?.[0] || '',
        author: { name: '已选', avatar: '' },
        likes: '0',
        description: p.raw_content
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  removeFromWorkingSet: async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/working-set/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: CURRENT_USER_ID, post_id: postId })
      });
      if (!response.ok) throw new Error('Failed to remove post');
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  
  clearWorkingSet: async () => {
    await fetch(`${API_BASE_URL}/working-set/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: CURRENT_USER_ID })
    });
  },

  // AI Chat
  chat: async (postIds: string[], question: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: CURRENT_USER_ID,
          post_ids: postIds,
          question: question
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Chat failed');
      }
      return await response.json();
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  },

  extractPreferences: async (text: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/extract-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, user_id: CURRENT_USER_ID })
      });
      if (!response.ok) throw new Error('Extraction failed');
      return await response.json();
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  }
};
