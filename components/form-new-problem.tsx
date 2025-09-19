'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Session } from 'next-auth';
import { OutputData } from '@editorjs/editorjs';

type FormNewProblemProps = {
  data: Session | null;
};

// Lazy load EditorJS
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const FormNewProblem = ({ data }: FormNewProblemProps) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<OutputData>({ blocks: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", JSON.stringify(content));
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/problem", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { newProblem } = await res.json();
        router.push(`/dashboard/problem/${newProblem.id}`);
      } else {
        console.error("Failed to create problem");
        alert("Error: Could not create problem");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong while submitting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <input
          type="text"
          placeholder="Problem title"
          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Editor
          data={null}
          onChange={(data) => setContent(data)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={!data?.user?.email || loading}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 w-full"
        >
          {loading ? "Publishing..." : "Publish Problem"}
        </button>
      </form>
    </div>
  );
};

export default FormNewProblem;
