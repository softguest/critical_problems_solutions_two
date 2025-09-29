// export interface Problem {
//   id: string;
//   title: string;
//   content: string;
//   excerpt: string;
//   category: string;
//   author: string;
//   createdAt: string;
//   updatedAt: string;
//   readTime: number;
// }

// export interface Category {
//   imageUrl: string;
//   id: string;
//   name: string;
//   description: string;
//   problemCount: number;
// }

export interface Category {
  id: string;
  name: string;
  categoryDescription?: string;
  imageUrl?: string;
  problemCount?: number;
}

export interface Problem {
  id: string;
  title: string;
  excerpt?: string;
  createdAt: string;
  author?: string;
  readTime?: number;
  categoryId?: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}