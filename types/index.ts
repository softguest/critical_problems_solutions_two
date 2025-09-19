export interface Problem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  readTime: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  problemCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}