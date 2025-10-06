'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { OutputData } from '@editorjs/editorjs';

// Lazy load the Editor to ensure SSR safety
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function CreatePostPage() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<OutputData>({ blocks: [] });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', JSON.stringify(content));
    formData.append('categoryId', selectedCategory);
    if (file) {
      formData.append('file', file);
    }

    const res = await fetch('/api/problems', {
      method: 'POST',
      body: formData,
    });
    setLoading(false); 
    if (res.ok) {
      window.location.href = '/dashboard/problems';
    } else {
      console.error('Failed to submit problem');
    }
  }

  return (
    <div className="max-w-4xl px-2 mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4">Create New Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Problem Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Category Search and Select */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full border p-2 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories
            .filter((cat) =>
              cat.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>

        <Editor
          data={null}
          onChange={(data) => setContent(data)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="max-w-xs max-h-40 rounded shadow border"
            />
          </div>
        )}
       <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
              Publishing...
            </span>
          ) : (
            "Publish Problem"
          )}
        </button>
      </form>
    </div>
  );
}