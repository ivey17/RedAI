export interface Post {
  id: string;
  title: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: string;
  description?: string;
  location?: string;
  publishDate?: string;
}

export interface Album {
  id: string;
  title: string;
  count: number;
  imageUrl: string;
  posts: Post[];
}

export interface RedAIAnalysis {
  ctr: string;
  engagement: string;
  conversion: string;
  suggestions: string[];
}
